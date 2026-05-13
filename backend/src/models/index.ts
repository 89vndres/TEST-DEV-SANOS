export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  role: string;
  created_at?: string;
}

export interface Mascota {
  id?: number;
  nombre: string;
  especie: string;
  raza: string;
  color: string;
  caracteristicas_distintivas: string;
  estado: string; // 'perdido' | 'encontrado' | 'en_adopcion' | 'adoptado'
  foto_url: string;
  ubicacion: string;
  edad: string;
  tamano: string;
  created_at?: string;
}

export interface Reporte {
  id?: number;
  fecha_reporte?: string;
  ubicacion_aproximada: string;
  descripcion: string;
  tipo_reporte: string;
  mascota_id?: number;
  usuario_id?: number;
  created_at?: string;
}

export interface Mensaje {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
  fecha?: string;
  created_at?: string;
}

export interface Direccion {
  id?: number;
  usuario_email: string;
  alias: string;
  direccion: string;
  ciudad: string;
  predeterminada: boolean;
}

export interface MetodoPago {
  id?: number;
  usuario_email: string;
  tipo: string;
  numero_tarjeta: string;
  fecha_expiracion: string;
}

export interface SoporteTicket {
  id?: number;
  usuario_email: string;
  tipo_problema: string;
  detalle: string;
  fecha?: string;
  estado: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
    nombre: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
}
