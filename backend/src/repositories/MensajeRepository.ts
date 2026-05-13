import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import { Mensaje } from '../models';

export interface IMensajeRepository {
  findAll(): Promise<Mensaje[]>;
  findById(id: number): Promise<Mensaje | null>;
  create(mensaje: Partial<Mensaje>): Promise<Mensaje>;
  delete(id: number): Promise<boolean>;
}

export class MensajeRepository extends BaseRepository<Mensaje> implements IMensajeRepository {
  constructor(supabaseClient?: SupabaseClient) {
    super('mensajes', supabaseClient);
  }
}
