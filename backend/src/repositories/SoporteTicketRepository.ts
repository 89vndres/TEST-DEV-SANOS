import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import { SoporteTicket } from '../models';

export interface ISoporteTicketRepository {
  findAll(): Promise<SoporteTicket[]>;
  findById(id: number): Promise<SoporteTicket | null>;
  findByUsuarioEmail(email: string): Promise<SoporteTicket[]>;
  create(ticket: Partial<SoporteTicket>): Promise<SoporteTicket>;
  update(id: number, ticket: Partial<SoporteTicket>): Promise<SoporteTicket | null>;
  delete(id: number): Promise<boolean>;
}

export class SoporteTicketRepository extends BaseRepository<SoporteTicket> implements ISoporteTicketRepository {
  constructor(supabaseClient?: SupabaseClient) {
    super('soporte_tickets', supabaseClient);
  }

  async findByUsuarioEmail(email: string): Promise<SoporteTicket[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('usuario_email', email)
      .order('id', { ascending: true });

    if (error) throw new Error(`Error fetching tickets by email: ${error.message}`);
    return (data as SoporteTicket[]) || [];
  }
}
