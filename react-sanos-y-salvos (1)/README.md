# 🐾 Sanos y Salvos

Plataforma inteligente para la localización y recuperación de mascotas perdidas.

## 🚀 Instrucciones para ejecutar el proyecto completo

### Requisitos previos
- **Node.js** v16 o superior
- **npm** v8 o superior
- **Supabase** proyecto configurado (ver backend `.env.example`)

---

### 1. Backend (Express + TypeScript + Supabase)

```bash
cd sanosysalvos-api-main

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase:
#   SUPABASE_URL=https://tu-proyecto.supabase.co
#   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
#   JWT_SECRET=tu-clave-secreta-segura
#   PORT=8080
#   CORS_ORIGIN=http://localhost:3000

# Ejecutar la migración SQL en Supabase Dashboard → SQL Editor
# (archivo: supabase/migration.sql)

# Iniciar en modo desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:8080`.

### 2. Frontend (React)

```bash
cd react-sanos-y-salvos

# Instalar dependencias
npm install

# (Opcional) Cambiar URL del backend si no es localhost:8080
# Editar: src/services/api.js → API_BASE_URL
# O usar variable de entorno: REACT_APP_API_URL=http://tu-api.com

# Iniciar en modo desarrollo
npm start
```

El frontend estará disponible en `http://localhost:3000`.

La aplicación se abrirá en **http://localhost:3000**

### Build para producción

```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```
src/
├── styles/
│   └── theme.js              # Sistema de diseño (colores, sombras, radios)
├── context/
│   ├── AuthContext.js         # Autenticación y sesión de usuario
│   └── AppContext.js          # Estado global (carrito/reportes)
├── components/
│   ├── NavBar.jsx             # Barra de navegación principal
│   └── products/
│       ├── MascotaCard.jsx    # Tarjeta de mascota
│       └── MascotaGrid.jsx   # Grid responsive de mascotas
├── pages/
│   ├── Home.jsx               # Página principal con formulario de reporte
│   ├── Products.jsx           # Mural de mascotas con filtros
│   ├── Login.jsx              # Inicio de sesión
│   ├── Contact.jsx            # Formulario de contacto
│   ├── MyOrders.jsx           # Mis reportes
│   ├── UserProfile.jsx        # Perfil de usuario
│   └── AdminPanel.jsx         # Panel de administración completo
├── services/
│   └── api.js                 # Utilidades de API con JWT
├── App.js                     # Rutas principales con animaciones
└── index.js                   # Punto de entrada con Providers
```

---

## 🛡️ Panel de Administración (`/admin`)

El panel incluye 5 secciones completas:

| Sección | Funcionalidad |
|---------|---------------|
| **Dashboard** | Estadísticas generales, distribución de estados, reportes recientes |
| **Mascotas** | CRUD completo de reportes de mascotas con búsqueda y filtros |
| **Usuarios** | CRUD completo de usuarios con cambio de roles |
| **Mensajes** | Lectura y eliminación de mensajes de contacto |
| **Configuración** | Ajustes del sitio, datos de contacto, toggles de funcionalidades |

### Acceso al panel
- Solo usuarios con rol `admin` pueden acceder
- Iniciar sesión en `/login` con credenciales de admin
- El enlace "Admin" aparece automáticamente en el navbar

---

## 🎨 Sistema de Diseño

Paleta de colores unificada basada en tonos verdes:

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#1b4332` | Textos principales, botones, navbar |
| Primary Light | `#2d6a4f` | Hover states |
| Accent | `#52b788` | Elementos interactivos |
| Accent Pale | `#d8f3dc` | Fondos suaves, badges |
| Background | `#f9fcf9` | Fondo general |
| Danger | `#e74c3c` | Estado "Perdido", errores |
| Success | `#2ecc71` | Estado "Encontrado", confirmaciones |

---

## 🔌 Endpoints del Backend Esperados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Autenticación (devuelve JWT) |
| `GET/POST` | `/api/mascotas` | Listar/crear mascotas |
| `PUT/DELETE` | `/api/mascotas/:id` | Editar/eliminar mascota |
| `GET/POST/PUT/DELETE` | `/api/admin/usuarios` | CRUD de usuarios |
| `GET/POST` | `/mensajes` | Mensajes de contacto |
| `DELETE` | `/mensajes/:id` | Eliminar mensaje |
| `GET/POST/DELETE` | `/api/profile/direcciones` | Direcciones del usuario |
| `GET/POST` | `/api/profile/soporte` | Tickets de soporte |

---

## 🧪 Tests

```bash
npm test
```

---

## 📦 Tecnologías

- **React 19** + React Router DOM v7
- **React Bootstrap** + Bootstrap 5
- **Framer Motion** para animaciones
- **React Hook Form** para formularios
- Sistema de estilos propio con theme.js
