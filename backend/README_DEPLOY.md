# Guia de Despliegue en Vercel - Sanos y Salvos API

## Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [GitHub](https://github.com) con acceso al repositorio
- Proyecto de [Supabase](https://supabase.com) ya configurado con la migracion ejecutada

---

## Paso 1: Conectar el Repositorio con Vercel

1. Inicia sesion en [vercel.com](https://vercel.com)
2. Haz clic en **"Add New..."** > **"Project"**
3. En la seccion **"Import Git Repository"**, busca y selecciona el repositorio:
   ```
   bemirandav-web/sanos-y-salvos
   ```
4. Si no aparece, haz clic en **"Adjust GitHub App Permissions"** y otorga acceso al repositorio
5. Vercel detectara automaticamente la configuracion desde `vercel.json`

---

## Paso 2: Configurar Variables de Entorno

Antes de hacer deploy, configura las variables de entorno en Vercel:

1. En la pantalla de configuracion del proyecto, busca la seccion **"Environment Variables"**
2. Agrega las siguientes variables:

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Clave anonima de Supabase | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio de Supabase | `eyJhbGciOiJIUzI1NiIs...` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT (min 32 caracteres) | `mi-clave-secreta-segura-de-32-chars` |
| `JWT_EXPIRATION` | Tiempo de expiracion del token | `24h` |
| `PORT` | Puerto del servidor | `8080` |
| `NODE_ENV` | Entorno de ejecucion | `production` |
| `CORS_ORIGIN` | Origen permitido para CORS | `https://tu-frontend.vercel.app` |

### Donde encontrar las claves de Supabase

1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

---

## Paso 3: Desplegar

1. Haz clic en **"Deploy"**
2. Vercel ejecutara automaticamente:
   - Instalacion de dependencias (`npm install`)
   - Compilacion de TypeScript (`vercel-build: tsc`)
   - Configuracion de la funcion serverless desde `src/server.ts`
3. El despliegue toma aproximadamente 1-2 minutos

---

## Paso 4: Verificar el Despliegue

Una vez desplegado, Vercel asignara una URL como:
```
https://sanos-y-salvos-xxxx.vercel.app
```

### Pruebas de verificacion

1. **Health Check** - Verifica que la API este funcionando:
   ```
   GET https://tu-url.vercel.app/api/health
   ```
   Respuesta esperada:
   ```json
   {
     "status": "ok",
     "service": "Sanos y Salvos API",
     "version": "1.0.0",
     "timestamp": "...",
     "environment": "production"
   }
   ```

2. **Endpoint raiz** - Lista de endpoints disponibles:
   ```
   GET https://tu-url.vercel.app/
   ```

3. **Probar autenticacion** - Login con usuario de prueba:
   ```bash
   curl -X POST https://tu-url.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@sanosysalvos.com", "password": "admin123"}'
   ```

---

## Endpoints Disponibles

### Publicos (sin autenticacion)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/` | Bienvenida y lista de endpoints |
| `GET` | `/api/health` | Estado de la API |
| `POST` | `/api/auth/login` | Iniciar sesion |
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `GET` | `/api/mascotas` | Listar todas las mascotas |
| `GET` | `/api/mascotas/:id` | Obtener mascota por ID |
| `GET` | `/api/mascotas/estado/:estado` | Filtrar mascotas por estado |
| `POST` | `/api/mascotas` | Registrar nueva mascota |
| `PUT` | `/api/mascotas/:id` | Actualizar mascota |
| `DELETE` | `/api/mascotas/:id` | Eliminar mascota |
| `GET` | `/api/reportes` | Listar todos los reportes |
| `GET` | `/api/reportes/:id` | Obtener reporte por ID |
| `GET` | `/api/reportes/tipo/:tipo` | Filtrar reportes por tipo |
| `POST` | `/api/reportes` | Crear nuevo reporte |
| `DELETE` | `/api/reportes/:id` | Eliminar reporte |
| `GET` | `/api/mensajes` | Listar mensajes de contacto |
| `POST` | `/api/mensajes` | Enviar mensaje de contacto |
| `DELETE` | `/api/mensajes/:id` | Eliminar mensaje |

### Protegidos (requieren JWT en header `Authorization: Bearer <token>`)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/api/soporte` | Listar tickets de soporte |
| `GET` | `/api/soporte/usuario/:email` | Tickets por email de usuario |
| `POST` | `/api/soporte` | Crear ticket de soporte |
| `PATCH` | `/api/soporte/:id/estado` | Actualizar estado del ticket |

---

## Redespliegues Automaticos

Vercel esta configurado para redesplegar automaticamente con cada `push` a la rama `main`. Para forzar un redespliegue manual:

1. Ve al dashboard de tu proyecto en Vercel
2. Haz clic en **"Deployments"**
3. En el despliegue mas reciente, haz clic en los tres puntos (**...**) > **"Redeploy"**

---

## Solucion de Problemas

| Problema | Solucion |
|---|---|
| Error 500 en todos los endpoints | Verificar las variables de entorno en Vercel (especialmente `SUPABASE_URL` y claves) |
| `FUNCTION_INVOCATION_TIMEOUT` | La funcion tarda mucho; verificar conexion a Supabase |
| Error de CORS | Ajustar `CORS_ORIGIN` al dominio correcto del frontend |
| Login no funciona | Verificar que `JWT_SECRET` esta configurado y que la migracion SQL se ejecuto en Supabase |
| 404 en endpoints | Verificar que `vercel.json` tiene las rutas correctamente configuradas |

---

## Arquitectura de Despliegue

```
GitHub (main)
    |
    v  (push automatico)
Vercel (Serverless Functions)
    |
    v  (conexion via SUPABASE_URL)
Supabase (PostgreSQL)
```

Cada push a `main` dispara un nuevo despliegue en Vercel. La API se ejecuta como funcion serverless y se conecta a la base de datos PostgreSQL alojada en Supabase.
