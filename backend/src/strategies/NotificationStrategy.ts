export interface NotificationData {
  to: string;
  subject: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  channel: string;
  message: string;
  timestamp: string;
}

export interface INotificationStrategy {
  readonly channel: string;
  send(data: NotificationData): Promise<NotificationResult>;
}

export class EmailNotificationStrategy implements INotificationStrategy {
  readonly channel = 'email';

  async send(data: NotificationData): Promise<NotificationResult> {
    console.log(`[EMAIL] Enviando a ${data.to}: ${data.subject}`);
    return {
      success: true,
      channel: this.channel,
      message: `Email enviado a ${data.to}`,
      timestamp: new Date().toISOString(),
    };
  }
}

export class SmsNotificationStrategy implements INotificationStrategy {
  readonly channel = 'sms';

  async send(data: NotificationData): Promise<NotificationResult> {
    console.log(`[SMS] Enviando a ${data.to}: ${data.body.substring(0, 160)}`);
    return {
      success: true,
      channel: this.channel,
      message: `SMS enviado a ${data.to}`,
      timestamp: new Date().toISOString(),
    };
  }
}

export class PushNotificationStrategy implements INotificationStrategy {
  readonly channel = 'push';

  async send(data: NotificationData): Promise<NotificationResult> {
    console.log(`[PUSH] Enviando a ${data.to}: ${data.subject}`);
    return {
      success: true,
      channel: this.channel,
      message: `Push notification enviada a ${data.to}`,
      timestamp: new Date().toISOString(),
    };
  }
}

export class NotificationService {
  private strategy: INotificationStrategy;

  constructor(strategy: INotificationStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: INotificationStrategy): void {
    this.strategy = strategy;
  }

  getCurrentChannel(): string {
    return this.strategy.channel;
  }

  async notify(data: NotificationData): Promise<NotificationResult> {
    return this.strategy.send(data);
  }

  static async notifyAll(
    strategies: INotificationStrategy[],
    data: NotificationData
  ): Promise<NotificationResult[]> {
    return Promise.all(strategies.map((s) => s.send(data)));
  }
}
