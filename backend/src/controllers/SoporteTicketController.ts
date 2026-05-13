import { Router, Request, Response } from 'express';
import { SoporteTicketService } from '../services/SoporteTicketService';

export function createSoporteTicketController(service: SoporteTicketService): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const tickets = await service.obtenerTodos();
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/usuario/:email', async (req: Request, res: Response) => {
    try {
      const tickets = await service.obtenerPorEmail(req.params.email);
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const ticket = await service.crearTicket(req.body);
      res.status(201).json(ticket);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.patch('/:id/estado', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { estado } = req.body;
      const ticket = await service.actualizarEstado(id, estado);
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
