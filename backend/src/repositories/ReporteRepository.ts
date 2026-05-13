import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import { Reporte } from '../models';

export interface IReporteRepository {
  findAll(): Promise<Reporte[]>;
  findById(id: number): Promise<Reporte | null>;
  findByTipoReporte(tipoReporte: string): Promise<Reporte[]>;
  create(reporte: Partial<Reporte>): Promise<Reporte>;
  update(id: number, reporte: Partial<Reporte>): Promise<Reporte | null>;
  delete(id: number): Promise<boolean>;
}

export class ReporteRepository extends BaseRepository<Reporte> implements IReporteRepository {
  constructor(supabaseClient?: SupabaseClient) {
    super('reportes', supabaseClient);
  }

  async findByTipoReporte(tipoReporte: string): Promise<Reporte[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('tipo_reporte', tipoReporte)
      .order('id', { ascending: true });

    if (error) throw new Error(`Error fetching reportes by tipo: ${error.message}`);
    return (data as Reporte[]) || [];
  }
}
