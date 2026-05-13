/**
 * Tests unitarios para AuthService
 */

import { AuthService } from '../services/AuthService';
import { IUsuarioRepository } from '../repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';

const mockRepository: jest.Mocked<IUsuarioRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(mockRepository);
  });

  describe('login', () => {
    it('debe retornar token y usuario con credenciales válidas', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockRepository.findByEmail.mockResolvedValue({
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user',
      });

      const result = await service.login({ email: 'test@example.com', password: 'password123' });
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.role).toBe('user');
    });

    it('debe lanzar error con email inexistente', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'noexiste@x.com', password: 'pass' }))
        .rejects.toThrow('Credenciales incorrectas');
    });

    it('debe lanzar error con contraseña incorrecta', async () => {
      const hashedPassword = await bcrypt.hash('correcta', 10);
      mockRepository.findByEmail.mockResolvedValue({
        id: 1,
        nombre: 'Test',
        email: 'test@x.com',
        password: hashedPassword,
        role: 'user',
      });

      await expect(service.login({ email: 'test@x.com', password: 'incorrecta' }))
        .rejects.toThrow('Credenciales incorrectas');
    });
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({
        id: 1,
        nombre: 'Nuevo User',
        email: 'nuevo@example.com',
        password: 'hashed',
        role: 'user',
      });

      const result = await service.register({
        email: 'nuevo@example.com',
        password: 'password123',
        nombre: 'Nuevo User',
      });

      expect(result.message).toBe('Usuario registrado con éxito');
      expect(result.user.email).toBe('nuevo@example.com');
    });

    it('debe lanzar error si el email ya existe', async () => {
      mockRepository.findByEmail.mockResolvedValue({
        id: 1,
        nombre: 'Existente',
        email: 'existe@x.com',
        password: 'hash',
        role: 'user',
      });

      await expect(service.register({
        email: 'existe@x.com',
        password: 'password123',
        nombre: 'Existente',
      })).rejects.toThrow('El correo ya está registrado');
    });

    it('debe lanzar error si la contraseña es muy corta', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      await expect(service.register({
        email: 'nuevo@x.com',
        password: '123',
        nombre: 'Test',
      })).rejects.toThrow('La contraseña debe tener al menos 6 caracteres');
    });

    it('debe asignar rol admin si email contiene "admin"', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockImplementation(async (data) => ({
        id: 1,
        nombre: data.nombre || '',
        email: data.email || '',
        password: data.password || '',
        role: data.role || 'user',
      }));

      const result = await service.register({
        email: 'admin@example.com',
        password: 'password123',
        nombre: 'Admin User',
      });

      expect(result.user.role).toBe('admin');
    });
  });

  describe('verifyToken', () => {
    it('debe verificar un token válido', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockRepository.findByEmail.mockResolvedValue({
        id: 1,
        nombre: 'Test',
        email: 'test@x.com',
        password: hashedPassword,
        role: 'user',
      });

      const loginResult = await service.login({ email: 'test@x.com', password: 'password123' });
      const decoded = service.verifyToken(loginResult.token);
      expect(decoded.email).toBe('test@x.com');
    });

    it('debe lanzar error con token inválido', () => {
      expect(() => service.verifyToken('token-invalido')).toThrow('Token inválido o expirado');
    });
  });
});
