# Luma Studio - Fase 7: QA de seguridad

Fecha: 2026-06-18

## Objetivo

Definir pruebas para confirmar que permisos, sesiones, borradores y Storage funcionan como se espera.

## Pruebas de auth

- Entrar a `/admin` sin sesion redirige a login.
- Login correcto redirige a dashboard.
- Login incorrecto muestra error.
- Sesion expirada vuelve a login.
- Usuario sin rol admin queda bloqueado.

## Pruebas de contenido publico

- Proyecto draft no aparece en `/proyectos`.
- Proyecto draft no abre por slug.
- Album draft no aparece en `/albumes`.
- Media draft no aparece si no esta publicada.
- Contenido publicado si aparece.

## Pruebas de mutacion

- Anonimo no puede crear proyecto.
- Anonimo no puede editar album.
- Anonimo no puede subir imagen.
- Admin puede crear/editar/publicar.
- Admin puede despublicar.

## Pruebas de Storage

- Upload anonimo falla.
- Upload admin funciona.
- Path duplicado no se usa por defecto.
- URL publica carga si asset es publico.
- Archivo borrado/archivado no rompe grilla publica.

## Pruebas de secretos

- Buscar `SUPABASE_SECRET_KEY` en bundle cliente.
- Verificar que archivos con secret key no tengan `"use client"`.
- Confirmar variables en Vercel por entorno.

## Criterio de cierre

No se puede pasar a produccion si:

- Un borrador se ve publicamente.
- Un anonimo puede escribir.
- El admin se valida solo en cliente.
- Secret key aparece en codigo cliente.

