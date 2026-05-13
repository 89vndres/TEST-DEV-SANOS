/**
 * Tests unitarios para MascotaService
 * Usa mocks del repositorio para probar la lógica de negocio aislada
 */

import { MascotaService } from '../services/MascotaService';
import { IMascotaRepository } from '../repositories/MascotaRepository';
import { Mascota } from '../models';

// Mock del repositorio (gracias al Repository Pattern, es fácil inyectar mocks)
const mockRepository: jest.Mocked<IMascotaRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEstado: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('MascotaService', () => {
  let service: MascotaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MascotaService(mockRepository);
  });

  const mascotaMock: Mascota = {
    id: 1,
    nombre: 'Firulais',
    especie: 'Perro',
    raza: 'Labrador',
    color: 'Dorado',
    caracteristicas_distintivas: 'Collar rojo',
    estado: 'perdido',
    foto_url: 'https://images.pexels.com/photos/20357690/pexels-photo-20357690.jpeg?cs=srgb&dl=pexels-yogi-yogesh-932879433-20357690.jpg&fm=jpg',
    ubicacion: 'Santiago Centro',
    edad: '3 años',
    tamano: 'Grande',
  };

  describe('obtenerTodasLasMascotas', () => {
    it('debe retornar todas las mascotas', async () => {
      mockRepository.findAll.mockResolvedValue([mascotaMock]);
      const resultado = await service.obtenerTodasLasMascotas();
      expect(resultado).toHaveLength(1);
      expect(resultado[0].nombre).toBe('Firulais');
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar lista vacía cuando no hay mascotas', async () => {
      mockRepository.findAll.mockResolvedValue([]);
      const resultado = await service.obtenerTodasLasMascotas();
      expect(resultado).toHaveLength(0);
    });
  });

  describe('obtenerMascotasPorEstado', () => {
    it('debe filtrar mascotas por estado', async () => {
      mockRepository.findByEstado.mockResolvedValue([mascotaMock]);
      const resultado = await service.obtenerMascotasPorEstado('perdido');
      expect(resultado).toHaveLength(1);
      expect(mockRepository.findByEstado).toHaveBeenCalledWith('perdido');
    });
  });

  describe('obtenerMascotaPorId', () => {
    it('debe retornar la mascota cuando existe', async () => {
      mockRepository.findById.mockResolvedValue(mascotaMock);
      const resultado = await service.obtenerMascotaPorId(1);
      expect(resultado).not.toBeNull();
      expect(resultado!.id).toBe(1);
    });

    it('debe retornar null cuando no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);
      const resultado = await service.obtenerMascotaPorId(999);
      expect(resultado).toBeNull();
    });
  });

  describe('guardarMascota', () => {
    it('debe crear una mascota válida', async () => {
      mockRepository.create.mockResolvedValue(mascotaMock);
      const resultado = await service.guardarMascota({
        nombre: 'Firulais',
        especie: 'Perro',
      });
      expect(resultado.nombre).toBe('Firulais');
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('debe lanzar error si no tiene nombre', async () => {
      await expect(service.guardarMascota({ especie: 'Perro' }))
        .rejects.toThrow('El nombre de la mascota es obligatorio');
    });

    it('debe lanzar error si no tiene especie', async () => {
      await expect(service.guardarMascota({ nombre: 'Firulais' }))
        .rejects.toThrow('La especie es obligatoria');
    });

    it('debe asignar estado "perdido" por defecto', async () => {
      mockRepository.create.mockResolvedValue(mascotaMock);
      await service.guardarMascota({ nombre: 'Firulais', especie: 'Perro' });
      const callArgs = mockRepository.create.mock.calls[0][0];
      expect(callArgs.estado).toBe('perdido');
    });
  });

  describe('eliminarMascota', () => {
    it('debe eliminar la mascota', async () => {
      mockRepository.delete.mockResolvedValue(true);
      const resultado = await service.eliminarMascota(1);
      expect(resultado).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
