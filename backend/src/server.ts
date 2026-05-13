import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { ServiceFactory } from './factories/ServiceFactory';
import { createAuthController } from './controllers/AuthController';
import { createMascotaController } from './controllers/MascotaController';
import { createReporteController } from './controllers/ReporteController';
import { createMensajeController } from './controllers/MensajeController';
import { createSoporteTicketController } from './controllers/SoporteTicketController';
import { createDireccionController } from './controllers/DireccionController';
import { createAdminUsuarioController } from './controllers/AdminUsuarioController';
import { authMiddleware, adminMiddleware } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const authService = ServiceFactory.createAuthService();
const mascotaService = ServiceFactory.createMascotaService();
const reporteService = ServiceFactory.createReporteService();
const mensajeService = ServiceFactory.createMensajeService();
const soporteTicketService = ServiceFactory.createSoporteTicketService();
const direccionService = ServiceFactory.createDireccionService();

// Montaje de rutas
app.use('/api/auth', createAuthController(authService));
app.use('/api/mascotas', createMascotaController(mascotaService));
app.use('/api/reportes', createReporteController(reporteService));
app.use('/api/mensajes', createMensajeController(mensajeService));

app.use('/api/direcciones', authMiddleware, createDireccionController(direccionService));
app.use('/api/soporte', authMiddleware, createSoporteTicketController(soporteTicketService));
app.use('/api/admin/usuarios', authMiddleware, adminMiddleware, createAdminUsuarioController());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Sanos y Salvos API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Sanos y Salvos API corriendo en http://localhost:${PORT}`);
});

export default app;