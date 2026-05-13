import { Reporte } from '../models';
import { IReporteRepository } from '../repositories/ReporteRepository';
import { ReporteBuilder } from '../builders/ReporteBuilder';

export class ReporteService {
  private repository: IReporteRepository;

  constructor(repository: IReporteRepository) {
    this.repository = repository;
  }

  async obtenerTodosLosReportes(): Promise<Reporte[]> {
    return this.repository.findAll();
  }

  async obtenerReportePorId(id: number): Promise<Reporte | null> {
    return this.repository.findById(id);
  }

  async obtenerReportesPorTipo(tipo: string): Promise<Reporte[]> {
    return this.repository.findByTipoReporte(tipo);
  }

  async crearReporte(data: {
    descripcion: string;
    ubicacion_aproximada: string;
    tipo_reporte: string;
    mascota_id?: number;
    usuario_id?: number;
  }): Promise<Reporte> {
    const builder = new ReporteBuilder()
      .setDescripcion(data.descripcion)
      .setUbicacion(data.ubicacion_aproximada)
      .setTipoReporte(data.tipo_reporte);

    if (data.mascota_id) builder.setMascotaId(data.mascota_id);
    if (data.usuario_id) builder.setUsuarioId(data.usuario_id);

    const reporteValidado = builder.build();
    return this.repository.create(reporteValidado);
  }

  async eliminarReporte(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
