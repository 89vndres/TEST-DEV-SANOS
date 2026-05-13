import { Direccion } from '../models';
import { BaseRepository, IRepository } from './BaseRepository';
import SupabaseConfig from '../config/supabase';

export interface IDireccionRepository extends IRepository<Direccion> {
  findByUsuarioEmail(email: string): Promise<Direccion[]>;
}

export class DireccionRepository extends BaseRepository<Direccion> implements IDireccionRepository {
  constructor() {
    super('direcciones');
  }

  async findByUsuarioEmail(email: string): Promise<Direccion[]> {
    const client = SupabaseConfig.getClient();
    const { data, error } = await client
      .from(this.tableName)
      .select('*')
      .eq('usuario_email', email);

    if (error) throw error;
    return data || [];
  }
}
