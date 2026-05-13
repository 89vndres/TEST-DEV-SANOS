# 🐾 Sanos y Salvos - API Backend

**API REST** para la plataforma de rescate y adopción de mascotas "Sanos y Salvos". Desarrollada con **Node.js + TypeScript + Express**, conectada a **Supabase** (PostgreSQL), y desplegable en **Vercel**.

## 📋 Tabla de Contenidos
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Patrones de Diseño](#-patrones-de-diseño)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración Local](#-configuración-local)
- [Configuración de Supabase](#-configuración-de-supabase)
- [Deployment en Vercel](#-deployment-en-vercel)
- [API Endpoints](#-api-endpoints)
- [Tests](#-tests)
- [Estrategia de Branching](#-estrategia-de-branching)

---

## 🏗️ Arquitectura

El proyecto implementa una arquitectura **BFF (Backend For Frontend)**:

```
┌──────────┐     ┌─────────────────┐     ┌──────────┐
│ Frontend │────▶│  Express API    │────▶│ Supabase │
│ (React)  │◀────│  (BFF Layer)    │◀────│ (PgSQL)  │
└──────────┘     └─────────────────┘     └──────────┘
                   │ Autenticación JWT
                   │ Validación
                   │ Lógica de negocio
                   │ Patrones de diseño
```

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|-----------|-----|
| **Node.js + TypeScript** | Runtime y lenguaje principal |
| **Express** | Framework HTTP |
| **Supabase** | Base de datos PostgreSQL + Auth |
| **JWT** | Autenticación stateless |
| **bcryptjs** | Hash de contraseñas |
| **Jest** | Testing unitario |
| **Vercel** | Plataforma de deployment |

---

## 🎨 Patrones de Diseño

Se implementaron **4 patrones de diseño**. Documentación detallada en [`PATRONES_DISEÑO.md`](./PATRONES_DISEÑO.md).

| Patrón | Ubicación | Propósito |
|--------|-----------|-----------|
| Repository | `src/repositories/` | Abstracción del acceso a datos |
| Strategy | `src/strategies/` | Notificaciones multi-canal |
| Builder | `src/builders/` | Construcción de reportes complejos |
| Factory | `src/factories/` | Creación centralizada de servicios |

---

## 📂 Estructura del Proyecto

```
sanosysalvos-api/
├── src/
│   ├── __tests__/           # Tests unitarios (Jest)
│   ├── builders/            # Builder Pattern (ReporteBuilder)
│   ├── config/              # Configuración (Supabase Singleton)
│   ├── controllers/         # Controladores REST
│   ├── factories/           # Factory Pattern (ServiceFactory)
│   ├── middleware/           # Auth middleware JWT
│   ├── models/              # Interfaces/modelos de dominio
│   ├── repositories/        # Repository Pattern (acceso a datos)
│   ├── services/            # Lógica de negocio
│   ├── strategies/          # Strategy Pattern (notificaciones)
│   └── server.ts            # Punto de entrada Express
├── supabase/
│   └── migration.sql        # Script de migración SQL
├── vercel.json              # Configuración de Vercel
├── package.json
├── tsconfig.json
└── jest.config.js
```

---

## ⚙️ Configuración Local

### 1. Clonar e instalar

```bash
git clone <url-del-repositorio>
cd sanosysalvos-api
npm install
```

### 2. Variables de entorno

Crear archivo `.env` basándose en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
JWT_SECRET=tu-clave-secreta-de-al-menos-32-caracteres
PORT=8080
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La API estará disponible en `http://localhost:8080`.

---

## 🗄️ Configuración de Supabase

### Paso 1: Crear proyecto en Supabase

1. Ir a [https://supabase.com](https://supabase.com) y crear una cuenta
2. Crear un nuevo proyecto
3. Anotar la **URL** y las **API Keys** (anon key + service_role key)

### Paso 2: Ejecutar migración

1. En el dashboard de Supabase, ir a **SQL Editor**
2. Copiar y pegar el contenido de `supabase/migration.sql`
3. Ejecutar el script

Esto creará:
- ✅ Tablas: `usuarios`, `mascotas`, `reportes`, `mensajes`, `direcciones`, `metodos_pago`, `soporte_tickets`
- ✅ Índices de rendimiento
- ✅ Row Level Security (RLS)
- ✅ Datos de ejemplo

### Paso 3: Configurar variables

Copiar las credenciales al archivo `.env`:
- `SUPABASE_URL` → Settings → API → Project URL
- `SUPABASE_ANON_KEY` → Settings → API → anon public key
- `SUPABASE_SERVICE_ROLE_KEY` → Settings → API → service_role key

---

## 🚀 Deployment en Vercel

### Paso 1: Preparar el repositorio

```bash
git add .
git commit -m "chore: preparar para deployment"
git push origin main
```

### Paso 2: Conectar con Vercel

1. Ir a [https://vercel.com](https://vercel.com)
2. Importar el repositorio de GitHub
3. Seleccionar el framework: **Other**

### Paso 3: Configurar variables de entorno en Vercel

En el dashboard de Vercel → Settings → Environment Variables:

| Variable | Valor |
|----------|-------|
| `SUPABASE_URL` | `https://tu-proyecto.supabase.co` |
| `SUPABASE_ANON_KEY` | Tu anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Tu service_role key |
| `JWT_SECRET` | Una clave secreta segura de 32+ caracteres |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | URL de tu frontend |

### Paso 4: Deploy

Vercel detectará automáticamente el `vercel.json` y desplegará la API como serverless functions.

```
vercel.json ya está configurado:
{
  "builds": [{ "src": "src/server.ts", "use": "@vercel/node" }],
  "routes": [
    { "src": "/api/(.*)", "dest": "src/server.ts" },
    { "src": "/(.*)", "dest": "src/server.ts" }
  ]
}
```

### Paso 5: Verificar

Visitar `https://tu-proyecto.vercel.app/api/health` para confirmar que la API está funcionando.

---

## 📡 API Endpoints

### Auth (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |

### Mascotas (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/mascotas` | Listar todas |
| GET | `/api/mascotas/:id` | Obtener por ID |
| GET | `/api/mascotas/estado/:estado` | Filtrar por estado |
| POST | `/api/mascotas` | Crear mascota |
| PUT | `/api/mascotas/:id` | Actualizar |
| DELETE | `/api/mascotas/:id` | Eliminar |

### Reportes (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reportes` | Listar todos |
| GET | `/api/reportes/:id` | Obtener por ID |
| GET | `/api/reportes/tipo/:tipo` | Filtrar por tipo |
| POST | `/api/reportes` | Crear reporte |
| DELETE | `/api/reportes/:id` | Eliminar |

### Mensajes (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/mensajes` | Listar todos |
| POST | `/api/mensajes` | Crear mensaje |
| DELETE | `/api/mensajes/:id` | Eliminar |

### Soporte (requiere JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/soporte` | Listar tickets |
| GET | `/api/soporte/usuario/:email` | Tickets por usuario |
| POST | `/api/soporte` | Crear ticket |
| PATCH | `/api/soporte/:id/estado` | Actualizar estado |

### Health Check
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado de la API |

---

## 🧪 Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con watch mode
npm run test:watch
```

**47 tests** cubriendo:
- `MascotaService` — CRUD y validaciones
- `AuthService` — Login, registro, JWT
- `ReporteBuilder` — Builder Pattern y validaciones
- `NotificationStrategy` — Strategy Pattern multi-canal
- `ServiceFactory` — Factory Pattern

---

## 🌿 Estrategia de Branching

El proyecto usa **Git Flow** simplificado:

```
main          ─── Producción estable (se despliega en Vercel)
  │
  └── develop ─── Integración de features
       │
       ├── feature/repository-pattern
       ├── feature/strategy-pattern
       ├── feature/builder-pattern
       ├── feature/factory-pattern
       ├── feature/unit-tests
       └── feature/vercel-supabase
```

### Convención de nombres:
- `feature/*` — Nueva funcionalidad
- `fix/*` — Corrección de bugs
- `docs/*` — Documentación

### Flujo de trabajo:
1. Crear rama desde `develop`: `git checkout -b feature/mi-feature develop`
2. Desarrollar y commitear
3. Merge a `develop` via Pull Request
4. Cuando `develop` es estable, merge a `main`

---

## 🐛 Bugs Corregidos del Proyecto Original

| Bug | Archivo Original | Corrección |
|-----|-----------------|------------|
| Spring Boot 4.0.6 no existe | `pom.xml` | Migrado a Node.js/Express (compatible con Vercel) |
| Package case mismatch (`Backend` vs `backend`) | `AuthController.java` | Estructura de módulos consistente |
| Parámetro faltante `@PathVariable String )` | `MascotaController.java` | Parámetros correctos en rutas |
| Import incorrecto `Backend.MensajeRepository` | `MensajeController.java` | Imports correctos via módulos |
| Método `obtenerTodasLasMascotas` no existía | `MascotaService.java` | Nombres de métodos consistentes |
| `@Entity` faltante en Direccion | `Direccion.java` | Modelos correctamente definidos |
| `SecretKey.getBytes()` en vez de `SECRET_KEY` | `JwtService.java` | JWT implementado correctamente con jsonwebtoken |
| `Claims::getSubjet` typo | `JwtService.java` | Corregido |
| `setSigninKey` typo | `JwtService.java` | Corregido |
| `credentials: null` (syntax inválida) | `JwtTokenFilter.java` | Middleware JWT correcto |
| `findByTipReporte` typo | `ReporteRepository.java` | `findByTipoReporte` |
| `server.port=5432` (conflicto con PostgreSQL) | `application.properties` | Puerto 8080 |
| Contraseñas en texto plano | `AuthController.java` | bcrypt hash |
| `UserDTO` vs `UserDto` case mismatch | `LoginResponse.java` | Interfaces TypeScript consistentes |
| Import `java.net.Authenticator` innecesario | `SecurityConfig.java` | Eliminado |

