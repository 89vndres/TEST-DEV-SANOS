import { Router, Request, Response } from 'express';
import { MensajeService } from '../services/MensajeService';

export function createMensajeController(mensajeService: MensajeService): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const mensajes = await mensajeService.obtenerTodosLosMensajes();
      res.json(mensajes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const mensaje = await mensajeService.crearMensaje(req.body);
      res.status(201).json(mensaje);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      await mensajeService.eliminarMensaje(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
