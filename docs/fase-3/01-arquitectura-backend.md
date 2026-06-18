# Luma Studio - Fase 3: Arquitectura backend

Fecha: 2026-06-18

## Objetivo de fase 3

Definir la arquitectura backend real del proyecto antes de crear el scaffold de codigo. El sitio necesita contenido administrable, login privado, base de datos, subida de imagenes a nube, permisos y lectura publica de contenido publicado.

## Stack recomendado

- Framework: Next.js App Router + TypeScript.
- UI: React + Tailwind CSS.
- Base de datos: Supabase Postgres.
- Auth: Supabase Auth.
- Storage: Supabase Storage.
- Cliente Supabase SSR: `@supabase/ssr` + `@supabase/supabase-js`.
- Upload UI: Uppy o FilePond en fase de implementacion admin.
- Deploy: Vercel + Supabase.

## Razon tecnica

Supabase cubre base de datos, autenticacion, Storage y reglas RLS en una sola plataforma. Para Luma Studio, eso evita construir un backend separado solo para CRUD y archivos, pero mantiene un backend real y seguro.

Next.js App Router permite:

- Renderizar paginas publicas con datos del backend.
- Proteger rutas admin.
- Usar Server Components para consultas.
- Usar Route Handlers o Server Actions para mutaciones controladas.
- Configurar optimizacion de imagenes remotas.

## Separacion de responsabilidades

### Publico

Lee contenido publicado:

- Proyectos publicados.
- Albumes publicados.
- Media publicada/asociada.
- Settings publicos.

No necesita sesion.

### Admin

Requiere login:

- Crear/editar/borrar proyectos.
- Crear/editar/borrar albumes.
- Subir media.
- Ordenar imagenes.
- Publicar/despublicar contenido.
- Editar settings.

### Backend

Responsabilidades:

- Validar sesion admin.
- Validar datos de formularios.
- Persistir metadata.
- Controlar rutas de Storage.
- Asegurar que publico solo vea contenido publicado.
- Evitar exponer secretos al cliente.

## Estructura tecnica esperada

```text
src/
  app/
    (public)/
      page.tsx
      proyectos/
      albumes/
      cortos/
      sobre/
      contacto/
    admin/
      login/
      page.tsx
      proyectos/
      albumes/
      media/
      settings/
    api/
      upload/
      revalidate/
  components/
    public/
    admin/
    media/
    ui/
  lib/
    supabase/
      client.ts
      server.ts
      proxy.ts
    data/
      projects.ts
      albums.ts
      media.ts
    validation/
    storage/
  types/
  styles/
```

## Clientes Supabase

Se requieren dos clientes:

- Browser client: para componentes cliente que necesiten sesion, uploads o estado interactivo.
- Server client: para Server Components, Server Actions y Route Handlers.

Regla:

- No usar service/secret key en el navegador.
- La publishable key puede estar en `NEXT_PUBLIC_*`.
- La secret key solo debe usarse en servidor si hace falta una operacion privilegiada.

## Variables de entorno

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=
```

Notas:

- `SUPABASE_SECRET_KEY` no debe importarse en componentes cliente.
- Para la primera version, se puede evitar usar secret key si las politicas RLS estan bien configuradas.

## Lectura de datos publica

Patron:

- Consultar tablas con filtros `status = 'published'`.
- Ordenar por `published_at`, `sort_order` o `created_at`.
- Resolver relaciones con media portada y galerias.

Ejemplos de queries conceptuales:

- Home: proyectos destacados + album destacado + corto destacado.
- Proyectos: todos los proyectos publicados, filtrables por categoria.
- Detalle: proyecto por slug si esta publicado.
- Album: album por slug si esta publicado + media ordenada.

## Mutaciones admin

Patron:

- Validar usuario autenticado.
- Confirmar que el usuario tiene rol admin.
- Validar payload.
- Escribir tabla.
- Registrar timestamp.
- Devolver resultado tipado.

Mutaciones principales:

- Crear proyecto.
- Actualizar proyecto.
- Publicar/despublicar proyecto.
- Crear album.
- Actualizar album.
- Publicar/despublicar album.
- Crear media asset.
- Asociar media a proyecto/album.
- Reordenar media.
- Actualizar settings.

## Route Handlers vs Server Actions

Recomendacion:

- Server Actions para formularios admin simples.
- Route Handlers para upload, webhooks, revalidacion o endpoints que necesiten HTTP explicito.

Razon:

Next.js App Router soporta Route Handlers dentro de `app`, con metodos HTTP como `GET`, `POST`, `PUT`, `PATCH` y `DELETE`. Para formularios internos, Server Actions reducen boilerplate; para uploads y endpoints externos, Route Handlers son mas claros.

## Cache y revalidacion

Primera version:

- Publico puede renderizar dinamicamente o con cache corta.
- Admin siempre dinamico.
- Al publicar/despublicar, revalidar rutas afectadas.

Rutas a revalidar:

- `/`
- `/proyectos`
- `/proyectos/[slug]`
- `/albumes`
- `/albumes/[slug]`
- `/cortos`

## Criterio de cierre de backend

La arquitectura se considera lista para implementar cuando existan:

- Modelo de datos definido.
- Buckets de Storage definidos.
- Politicas RLS previstas.
- Flujo de upload definido.
- Rutas admin protegidas.
- Variables de entorno claras.
- Estrategia publica/admin separada.

## Fuentes tecnicas consultadas

- Supabase SSR con Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase Storage uploads: https://supabase.com/docs/guides/storage/uploads/standard-uploads
- Supabase Storage access control: https://supabase.com/docs/guides/storage/security/access-control
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers

