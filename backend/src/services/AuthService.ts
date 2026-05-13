import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario, LoginRequest, LoginResponse, RegisterRequest } from '../models';
import { IUsuarioRepository } from '../repositories/UsuarioRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta-desarrollo-sanosysalvos-2024';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

export class AuthService {
  private repository: IUsuarioRepository;

  constructor(repository: IUsuarioRepository) {
    this.repository = repository;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const usuario = await this.repository.findByEmail(request.email);
    if (!usuario) {
      throw new Error('Credenciales incorrectas');
    }

    const passwordValid = await bcrypt.compare(request.password, usuario.password);
    if (!passwordValid) {
      throw new Error('Credenciales incorrectas');
    }

    const token = this.generateToken(usuario);
    return {
      token,
      user: {
        email: usuario.email,
        role: usuario.role,
        nombre: usuario.nombre,
      },
    };
  }

  async register(request: RegisterRequest): Promise<{ message: string; user: Partial<Usuario> }> {
    if (!request.email || !request.password || !request.nombre) {
      throw new Error('Todos los campos son obligatorios');
    }
    if (request.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const existente = await this.repository.findByEmail(request.email);
    if (existente) {
      throw new Error('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const role = request.email.includes('admin') ? 'admin' : 'user';

    const nuevoUsuario = await this.repository.create({
      email: request.email,
      password: hashedPassword,
      nombre: request.nombre,
      role,
    });

    return {
      message: 'Usuario registrado con éxito',
      user: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        role: nuevoUsuario.role,
      },
    };
  }

  private generateToken(usuario: Usuario): string {
    const expiresInSeconds = 86400;
    return jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: expiresInSeconds }
    );
  }

  verifyToken(token: string): { id: number; email: string; role: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
    } catch {
      throw new Error('Token inválido o expirado');
    }
  }
}
