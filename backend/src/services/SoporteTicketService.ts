import { SoporteTicket } from '../models';
import { ISoporteTicketRepository } from '../repositories/SoporteTicketRepository';

export class SoporteTicketService {
  private repository: ISoporteTicketRepository;

  constructor(repository: ISoporteTicketRepository) {
    this.repository = repository;
  }

  async obtenerTodos(): Promise<SoporteTicket[]> {
    return this.repository.findAll();
  }

  async obtenerPorEmail(email: string): Promise<SoporteTicket[]> {
    return this.repository.findByUsuarioEmail(email);
  }

  async crearTicket(ticket: Partial<SoporteTicket>): Promise<SoporteTicket> {
    if (!ticket.usuario_email || !ticket.tipo_problema || !ticket.detalle) {
      throw new Error('Email, tipo de problema y detalle son obligatorios');
    }
    ticket.fecha = new Date().toISOString();
    ticket.estado = ticket.estado || 'abierto';
    return this.repository.create(ticket);
  }

  async actualizarEstado(id: number, estado: string): Promise<SoporteTicket | null> {
    const estadosValidos = ['abierto', 'en_proceso', 'resuelto', 'cerrado'];
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`);
    }
    return this.repository.update(id, { estado });
  }
}
