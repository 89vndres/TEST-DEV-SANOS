import { Direccion } from '../models';
import { IDireccionRepository } from '../repositories/DireccionRepository';

export class DireccionService {
  constructor(private readonly repository: IDireccionRepository) {}

  async obtenerTodas(): Promise<Direccion[]> {
    return this.repository.findAll();
  }

  async obtenerPorEmail(email: string): Promise<Direccion[]> {
    if (!email) throw new Error('El email es requerido');
    return this.repository.findByUsuarioEmail(email);
  }

  async crearDireccion(direccion: Direccion): Promise<Direccion> {
    if (!direccion.usuario_email) throw new Error('El email del usuario es requerido');
    if (!direccion.direccion) throw new Error('La direccion es requerida');
    if (!direccion.ciudad) throw new Error('La ciudad es requerida');

    if (direccion.predeterminada === undefined) {
      direccion.predeterminada = false;
    }

    return this.repository.create(direccion);
  }

  async actualizarDireccion(id: number, direccion: Partial<Direccion>): Promise<Direccion | null> {
    return this.repository.update(id, direccion);
  }

  async eliminarDireccion(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
