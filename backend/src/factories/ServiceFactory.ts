import { MascotaRepository, IMascotaRepository } from '../repositories/MascotaRepository';
import { UsuarioRepository, IUsuarioRepository } from '../repositories/UsuarioRepository';
import { ReporteRepository, IReporteRepository } from '../repositories/ReporteRepository';
import { MensajeRepository, IMensajeRepository } from '../repositories/MensajeRepository';
import { SoporteTicketRepository, ISoporteTicketRepository } from '../repositories/SoporteTicketRepository';
import { DireccionRepository, IDireccionRepository } from '../repositories/DireccionRepository';
import { MascotaService } from '../services/MascotaService';
import { AuthService } from '../services/AuthService';
import { ReporteService } from '../services/ReporteService';
import { MensajeService } from '../services/MensajeService';
import { SoporteTicketService } from '../services/SoporteTicketService';
import { DireccionService } from '../services/DireccionService';
import {
  NotificationService,
  EmailNotificationStrategy,
  SmsNotificationStrategy,
  PushNotificationStrategy,
  INotificationStrategy,
} from '../strategies/NotificationStrategy';

type Environment = 'production' | 'development' | 'test';

export class ServiceFactory {
  private static env: Environment = (process.env.NODE_ENV as Environment) || 'development';

  static setEnvironment(env: Environment): void {
    ServiceFactory.env = env;
  }

  static createMascotaRepository(): IMascotaRepository {
    return new MascotaRepository();
  }

  static createUsuarioRepository(): IUsuarioRepository {
    return new UsuarioRepository();
  }

  static createReporteRepository(): IReporteRepository {
    return new ReporteRepository();
  }

  static createMensajeRepository(): IMensajeRepository {
    return new MensajeRepository();
  }

  static createSoporteTicketRepository(): ISoporteTicketRepository {
    return new SoporteTicketRepository();
  }

  static createDireccionRepository(): IDireccionRepository {
    return new DireccionRepository();
  }

  static createMascotaService(repo?: IMascotaRepository): MascotaService {
    return new MascotaService(repo || ServiceFactory.createMascotaRepository());
  }

  static createAuthService(repo?: IUsuarioRepository): AuthService {
    return new AuthService(repo || ServiceFactory.createUsuarioRepository());
  }

  static createReporteService(repo?: IReporteRepository): ReporteService {
    return new ReporteService(repo || ServiceFactory.createReporteRepository());
  }

  static createMensajeService(repo?: IMensajeRepository): MensajeService {
    return new MensajeService(repo || ServiceFactory.createMensajeRepository());
  }

  static createSoporteTicketService(repo?: ISoporteTicketRepository): SoporteTicketService {
    return new SoporteTicketService(repo || ServiceFactory.createSoporteTicketRepository());
  }

  static createDireccionService(repo?: IDireccionRepository): DireccionService {
    return new DireccionService(repo || ServiceFactory.createDireccionRepository());
  }

  static createNotificationService(channel: string = 'email'): NotificationService {
    let strategy: INotificationStrategy;
    switch (channel) {
      case 'sms':
        strategy = new SmsNotificationStrategy();
        break;
      case 'push':
        strategy = new PushNotificationStrategy();
        break;
      case 'email':
      default:
        strategy = new EmailNotificationStrategy();
        break;
    }
    return new NotificationService(strategy);
  }
}
