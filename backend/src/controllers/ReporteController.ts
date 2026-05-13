import { Router, Request, Response } from 'express';
import { ReporteService } from '../services/ReporteService';

export function createReporteController(reporteService: ReporteService): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const reportes = await reporteService.obtenerTodosLosReportes();
      res.json(reportes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/tipo/:tipo', async (req: Request, res: Response) => {
    try {
      const reportes = await reporteService.obtenerReportesPorTipo(req.params.tipo);
      res.json(reportes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const reporte = await reporteService.obtenerReportePorId(id);
      if (!reporte) {
        res.status(404).json({ error: 'Reporte no encontrado' });
        return;
      }
      res.json(reporte);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const reporte = await reporteService.crearReporte(req.body);
      res.status(201).json(reporte);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      await reporteService.eliminarReporte(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
