# Luma Studio - Fase 7: Seguridad y permisos de implementacion

Fecha: 2026-06-18

## Objetivo

Traducir la arquitectura de seguridad a reglas concretas de implementacion en Next.js y Supabase.

## Areas protegidas

- Rutas `/admin/*`.
- Server Actions admin.
- Route Handlers admin/upload.
- Mutaciones de base de datos.
- Uploads a Storage.
- Borradores.

## Auth en Next

Usar Supabase SSR:

- Cliente browser.
- Cliente server.
- Proxy/middleware para actualizar sesion.
- Validacion server-side para admin.

Reglas:

- `/admin/login` accesible sin sesion.
- `/admin/*` requiere sesion.
- Mutaciones requieren rol admin.
- No confiar en ocultar botones en UI.

## Politicas RLS

Tablas con RLS:

- `profiles`
- `projects`
- `albums`
- `media_assets`
- `project_media`
- `album_media`
- `tags`
- `site_settings`

Regla publica:

- Select solo sobre publicado o settings publicos.

Regla admin:

- All para usuarios con `profiles.role = admin`.

## Storage

Reglas:

- Publico puede leer assets publicos.
- Admin puede subir a `media-public`.
- Admin puede gestionar objetos de Storage.
- Nadie anonimo puede subir.

## Validacion de inputs

Usar schemas compartidos:

- Project schema.
- Album schema.
- Media metadata schema.
- Settings schema.

Recomendado:

- Zod para validacion TypeScript.

## Rate limits y abuso

Primera version:

- Admin privado reduce exposicion.
- Contacto puede ser mailto inicialmente.

Si se agrega formulario publico:

- Honeypot.
- Rate limit.
- Validacion server-side.
- Proteccion anti-spam.

## Checklist seguridad

- RLS activado.
- Politicas revisadas.
- Admin no accesible sin sesion.
- Role admin verificado en servidor.
- No secrets en cliente.
- Upload anonimo bloqueado.
- Borradores no visibles publicamente.
- Errores publicos sin detalles tecnicos.
- Variables env configuradas por entorno.

## Fuente tecnica

- Supabase SSR Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase Storage access control: https://supabase.com/docs/guides/storage/security/access-control

