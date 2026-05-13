import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import { Usuario } from '../models';

export interface IUsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(usuario: Partial<Usuario>): Promise<Usuario>;
  update(id: number, usuario: Partial<Usuario>): Promise<Usuario | null>;
  delete(id: number): Promise<boolean>;
}

export class UsuarioRepository extends BaseRepository<Usuario> implements IUsuarioRepository {
  constructor(supabaseClient?: SupabaseClient) {
    super('usuarios', supabaseClient);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching usuario by email: ${error.message}`);
    }
    return data as Usuario;
  }
}
