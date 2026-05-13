-- ============================================================
-- MIGRACIÓN SUPABASE - Sanos y Salvos API
-- ============================================================
-- Ejecutar este script en el SQL Editor de Supabase
-- Panel: https://supabase.com/dashboard → SQL Editor
-- ============================================================

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    especie VARCHAR(100) NOT NULL,
    raza VARCHAR(100),
    color VARCHAR(100),
    caracteristicas_distintivas TEXT,
    estado VARCHAR(50) DEFAULT 'perdido',
    foto_url TEXT,
    ubicacion VARCHAR(500),
    edad VARCHAR(50),
    tamano VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Reportes
CREATE TABLE IF NOT EXISTS reportes (
    id BIGSERIAL PRIMARY KEY,
    fecha_reporte TIMESTAMPTZ DEFAULT NOW(),
    ubicacion_aproximada VARCHAR(500),
    descripcion TEXT NOT NULL,
    tipo_reporte VARCHAR(100) NOT NULL,
    mascota_id BIGINT REFERENCES mascotas(id) ON DELETE SET NULL,
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Mensajes de Contacto
CREATE TABLE IF NOT EXISTS mensajes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    asunto VARCHAR(500),
    mensaje TEXT NOT NULL,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Direcciones
CREATE TABLE IF NOT EXISTS direcciones (
    id BIGSERIAL PRIMARY KEY,
    usuario_email VARCHAR(255) NOT NULL,
    alias VARCHAR(100),
    direccion VARCHAR(500),
    ciudad VARCHAR(100),
    predeterminada BOOLEAN DEFAULT FALSE
);

-- Tabla de Métodos de Pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    id BIGSERIAL PRIMARY KEY,
    usuario_email VARCHAR(255) NOT NULL,
    tipo VARCHAR(50),
    numero_tarjeta VARCHAR(20),
    fecha_expiracion VARCHAR(10)
);

-- Tabla de Tickets de Soporte
CREATE TABLE IF NOT EXISTS soporte_tickets (
    id BIGSERIAL PRIMARY KEY,
    usuario_email VARCHAR(255) NOT NULL,
    tipo_problema VARCHAR(200),
    detalle TEXT,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'abierto'
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_mascotas_estado ON mascotas(estado);
CREATE INDEX IF NOT EXISTS idx_reportes_tipo ON reportes(tipo_reporte);
CREATE INDEX IF NOT EXISTS idx_reportes_mascota ON reportes(mascota_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON soporte_tickets(usuario_email);

-- Habilitar Row Level Security (RLS) - configuración básica
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE mascotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE soporte_tickets ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público para lectura de mascotas y reportes
CREATE POLICY "Mascotas visibles para todos" ON mascotas FOR SELECT USING (true);
CREATE POLICY "Reportes visibles para todos" ON reportes FOR SELECT USING (true);
CREATE POLICY "Mensajes acceso completo service_role" ON mensajes FOR ALL USING (true);
CREATE POLICY "Usuarios acceso completo service_role" ON usuarios FOR ALL USING (true);
CREATE POLICY "Mascotas acceso completo service_role" ON mascotas FOR ALL USING (true);
CREATE POLICY "Reportes acceso completo service_role" ON reportes FOR ALL USING (true);
CREATE POLICY "Tickets acceso completo service_role" ON soporte_tickets FOR ALL USING (true);

-- Datos de ejemplo
INSERT INTO usuarios (nombre, email, password, role) VALUES
    ('Admin', 'admin@sanosysalvos.cl', '$2a$10$X7UrE5P8Q9K2N1M3J4H5GOKxH2L3P4Q5R6S7T8U9V0W1X2Y3Z4A5B', 'admin'),
    ('Usuario Test', 'test@sanosysalvos.cl', '$2a$10$X7UrE5P8Q9K2N1M3J4H5GOKxH2L3P4Q5R6S7T8U9V0W1X2Y3Z4A5B', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO mascotas (nombre, especie, raza, color, estado, ubicacion, edad, tamano) VALUES
    ('Firulais', 'Perro', 'Labrador', 'Dorado', 'perdido', 'Santiago Centro', '3 años', 'Grande'),
    ('Michi', 'Gato', 'Siamés', 'Blanco', 'encontrado', 'Providencia', '2 años', 'Pequeño'),
    ('Rocky', 'Perro', 'Bulldog', 'Marrón', 'en_adopcion', 'Las Condes', '5 años', 'Mediano')
ON CONFLICT DO NOTHING;
-- Supabase migration v1.0
