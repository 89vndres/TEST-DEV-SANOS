import { Router, Request, Response } from 'express';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';

export function createAdminUsuarioController(): Router {
  const router = Router();
  const repository = new UsuarioRepository();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const usuarios = await repository.findAll();
      const safe = usuarios.map(({ password, ...rest }) => rest);
      res.json(safe);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { nombre, email, password, role } = req.body;
      if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'nombre, email y password son requeridos' });
      }
      const existing = await repository.findByEmail(email);
      if (existing) return res.status(409).json({ error: 'El email ya esta registrado' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const usuario = await repository.create({ nombre, email, password: hashedPassword, role: role || 'user' });
      const { password: _, ...safe } = usuario;
      res.status(201).json(safe);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = { ...req.body };

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      } else {
        delete updateData.password;
      }

      const usuario = await repository.update(id, updateData);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      const { password: _, ...safe } = usuario;
      res.json(safe);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await repository.delete(id);
      res.json({ message: 'Usuario eliminado' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
