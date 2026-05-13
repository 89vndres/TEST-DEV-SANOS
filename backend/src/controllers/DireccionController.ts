import { Router, Request, Response } from 'express';
import { DireccionService } from '../services/DireccionService';

export function createDireccionController(service: DireccionService): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string;
      if (email) {
        const direcciones = await service.obtenerPorEmail(email);
        return res.json(direcciones);
      }
      const direcciones = await service.obtenerTodas();
      res.json(direcciones);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const direccion = await service.crearDireccion(req.body);
      res.status(201).json(direccion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const direccion = await service.actualizarDireccion(id, req.body);
      if (!direccion) return res.status(404).json({ error: 'Direccion no encontrada' });
      res.json(direccion);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await service.eliminarDireccion(id);
      res.json({ message: 'Direccion eliminada' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
