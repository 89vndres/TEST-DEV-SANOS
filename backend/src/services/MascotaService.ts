import { Mascota } from '../models';
import { IMascotaRepository } from '../repositories/MascotaRepository';

export class MascotaService {
  private repository: IMascotaRepository;

  constructor(repository: IMascotaRepository) {
    this.repository = repository;
  }

  async obtenerTodasLasMascotas(): Promise<Mascota[]> {
    return this.repository.findAll();
  }

  async obtenerMascotasPorEstado(estado: string): Promise<Mascota[]> {
    return this.repository.findByEstado(estado);
  }

  async obtenerMascotaPorId(id: number): Promise<Mascota | null> {
    return this.repository.findById(id);
  }

  async guardarMascota(mascota: Partial<Mascota>): Promise<Mascota> {
    if (!mascota.nombre || mascota.nombre.trim() === '') {
      throw new Error('El nombre de la mascota es obligatorio');
    }
    if (!mascota.especie || mascota.especie.trim() === '') {
      throw new Error('La especie es obligatoria');
    }
    if (!mascota.estado) {
      mascota.estado = 'perdido';
    }
    return this.repository.create(mascota);
  }

  async actualizarMascota(id: number, mascota: Partial<Mascota>): Promise<Mascota | null> {
    const existente = await this.repository.findById(id);
    if (!existente) {
      throw new Error(`Mascota con id ${id} no encontrada`);
    }
    return this.repository.update(id, mascota);
  }

  async eliminarMascota(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
