/**
 * Tests unitarios para el Factory Pattern (ServiceFactory)
 */

import { ServiceFactory } from '../factories/ServiceFactory';
import { MascotaService } from '../services/MascotaService';
import { AuthService } from '../services/AuthService';
import { ReporteService } from '../services/ReporteService';
import { MensajeService } from '../services/MensajeService';
import { SoporteTicketService } from '../services/SoporteTicketService';

describe('Factory Pattern - ServiceFactory', () => {
  describe('createMascotaService', () => {
    it('debe crear una instancia de MascotaService', () => {
      const service = ServiceFactory.createMascotaService();
      expect(service).toBeInstanceOf(MascotaService);
    });

    it('debe permitir inyectar repositorio personalizado', () => {
      const mockRepo = {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByEstado: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      };
      const service = ServiceFactory.createMascotaService(mockRepo);
      expect(service).toBeInstanceOf(MascotaService);
    });
  });

  describe('createAuthService', () => {
    it('debe crear una instancia de AuthService', () => {
      const service = ServiceFactory.createAuthService();
      expect(service).toBeInstanceOf(AuthService);
    });
  });

  describe('createReporteService', () => {
    it('debe crear una instancia de ReporteService', () => {
      const service = ServiceFactory.createReporteService();
      expect(service).toBeInstanceOf(ReporteService);
    });
  });

  describe('createMensajeService', () => {
    it('debe crear una instancia de MensajeService', () => {
      const service = ServiceFactory.createMensajeService();
      expect(service).toBeInstanceOf(MensajeService);
    });
  });

  describe('createSoporteTicketService', () => {
    it('debe crear una instancia de SoporteTicketService', () => {
      const service = ServiceFactory.createSoporteTicketService();
      expect(service).toBeInstanceOf(SoporteTicketService);
    });
  });

  describe('createNotificationService', () => {
    it('debe crear servicio con email por defecto', () => {
      const service = ServiceFactory.createNotificationService();
      expect(service.getCurrentChannel()).toBe('email');
    });

    it('debe crear servicio con SMS', () => {
      const service = ServiceFactory.createNotificationService('sms');
      expect(service.getCurrentChannel()).toBe('sms');
    });

    it('debe crear servicio con push', () => {
      const service = ServiceFactory.createNotificationService('push');
      expect(service.getCurrentChannel()).toBe('push');
    });
  });
});
