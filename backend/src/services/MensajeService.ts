import { Mensaje } from '../models';
import { IMensajeRepository } from '../repositories/MensajeRepository';

export class MensajeService {
  private repository: IMensajeRepository;

  constructor(repository: IMensajeRepository) {
    this.repository = repository;
  }

  async obtenerTodosLosMensajes(): Promise<Mensaje[]> {
    return this.repository.findAll();
  }

  async crearMensaje(mensaje: Partial<Mensaje>): Promise<Mensaje> {
    if (!mensaje.email || !mensaje.mensaje) {
      throw new Error('Email y mensaje son obligatorios');
    }
    mensaje.fecha = new Date().toISOString();
    return this.repository.create(mensaje);
  }

  async eliminarMensaje(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
