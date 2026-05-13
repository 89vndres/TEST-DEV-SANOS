import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import { Mascota } from '../models';

export interface IMascotaRepository {
  findAll(): Promise<Mascota[]>;
  findById(id: number): Promise<Mascota | null>;
  findByEstado(estado: string): Promise<Mascota[]>;
  create(mascota: Partial<Mascota>): Promise<Mascota>;
  update(id: number, mascota: Partial<Mascota>): Promise<Mascota | null>;
  delete(id: number): Promise<boolean>;
}

export class MascotaRepository extends BaseRepository<Mascota> implements IMascotaRepository {
  constructor(supabaseClient?: SupabaseClient) {
    super('mascotas', supabaseClient);
  }

  async findByEstado(estado: string): Promise<Mascota[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('estado', estado)
      .order('id', { ascending: true });

    if (error) throw new Error(`Error fetching mascotas by estado: ${error.message}`);
    return (data as Mascota[]) || [];
  }
}
