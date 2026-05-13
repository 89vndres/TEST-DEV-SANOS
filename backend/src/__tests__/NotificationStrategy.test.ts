/**
 * Tests unitarios para el Strategy Pattern (NotificationService)
 */

import {
  NotificationService,
  EmailNotificationStrategy,
  SmsNotificationStrategy,
  PushNotificationStrategy,
  NotificationData,
} from '../strategies/NotificationStrategy';

describe('Strategy Pattern - NotificationService', () => {
  const testData: NotificationData = {
    to: 'usuario@example.com',
    subject: 'Mascota encontrada',
    body: 'Tu mascota Firulais fue avistada en Santiago Centro',
  };

  describe('EmailNotificationStrategy', () => {
    it('debe enviar notificación por email', async () => {
      const strategy = new EmailNotificationStrategy();
      const result = await strategy.send(testData);

      expect(result.success).toBe(true);
      expect(result.channel).toBe('email');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('SmsNotificationStrategy', () => {
    it('debe enviar notificación por SMS', async () => {
      const strategy = new SmsNotificationStrategy();
      const result = await strategy.send(testData);

      expect(result.success).toBe(true);
      expect(result.channel).toBe('sms');
    });
  });

  describe('PushNotificationStrategy', () => {
    it('debe enviar notificación push', async () => {
      const strategy = new PushNotificationStrategy();
      const result = await strategy.send(testData);

      expect(result.success).toBe(true);
      expect(result.channel).toBe('push');
    });
  });

  describe('NotificationService', () => {
    it('debe usar la estrategia de email por defecto', async () => {
      const service = new NotificationService(new EmailNotificationStrategy());
      expect(service.getCurrentChannel()).toBe('email');

      const result = await service.notify(testData);
      expect(result.success).toBe(true);
      expect(result.channel).toBe('email');
    });

    it('debe permitir cambiar la estrategia en runtime', async () => {
      const service = new NotificationService(new EmailNotificationStrategy());
      expect(service.getCurrentChannel()).toBe('email');

      service.setStrategy(new SmsNotificationStrategy());
      expect(service.getCurrentChannel()).toBe('sms');

      const result = await service.notify(testData);
      expect(result.channel).toBe('sms');
    });

    it('debe enviar por múltiples canales', async () => {
      const strategies = [
        new EmailNotificationStrategy(),
        new SmsNotificationStrategy(),
        new PushNotificationStrategy(),
      ];

      const results = await NotificationService.notifyAll(strategies, testData);
      expect(results).toHaveLength(3);
      expect(results.map((r) => r.channel)).toEqual(['email', 'sms', 'push']);
      expect(results.every((r) => r.success)).toBe(true);
    });
  });
});
