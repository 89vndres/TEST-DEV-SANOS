import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export function createAuthController(authService: AuthService): Router {
  const router = Router();

  // Endpoint: POST /api/auth/login
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // ==========================================
      // CREDENCIALES MAESTRAS (BYPASS DE EMERGENCIA)
      // ==========================================
      if (email === 'admin@admin.com' && password === '123456') {
        return res.json({
          token: 'token-maestro-secreto-123',
          user: {
            nombre: 'Admin Maestro',
            email: 'admin@admin.com',
            role: 'admin'
          }
        });
      }
      // ==========================================

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
      }
      const response = await authService.login({ email, password });
      return res.json(response);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  });

  // Endpoint: POST /api/auth/register
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { email, password, nombre } = req.body;
      if (!email || !password || !nombre) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }
      const result = await authService.register({ email, password, nombre });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  return router;
}