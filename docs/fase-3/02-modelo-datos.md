# Luma Studio - Fase 3: Modelo de datos

Fecha: 2026-06-18

## Objetivo

Definir las tablas necesarias para gestionar proyectos, albumes, imagenes, cortometrajes, tags, settings y perfil de administrador.

## Convenciones

- Primary keys: `uuid`.
- Timestamps: `created_at`, `updated_at`, `published_at`.
- Estados: `draft`, `published`, `archived`.
- Slugs unicos para rutas publicas.
- No borrar archivos fisicos automaticamente sin confirmacion.
- Usar soft archive para contenido importante.

## Enums sugeridos

```sql
create type content_status as enum ('draft', 'published', 'archived');
create type media_kind as enum ('image', 'video', 'embed');
create type project_kind as enum ('photography', 'short_film', 'editorial', 'experimental', 'direction', 'mixed');
```

## Tabla: profiles

Representa usuarios internos con rol.

Campos:

- `id uuid primary key references auth.users(id)`
- `display_name text`
- `role text default 'admin'`
- `avatar_url text`
- `created_at timestamptz`
- `updated_at timestamptz`

Uso:

- Autorizar acceso admin.
- Mostrar identidad en panel.

## Tabla: projects

Representa proyectos artisticos, fotograficos o audiovisuales.

Campos:

- `id uuid primary key`
- `title text not null`
- `slug text unique not null`
- `summary text`
- `description text`
- `kind project_kind not null`
- `year integer`
- `role text`
- `location text`
- `credits text`
- `cover_media_id uuid references media_assets(id)`
- `status content_status default 'draft'`
- `is_featured boolean default false`
- `sort_order integer default 0`
- `published_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

Reglas:

- Para publicar, debe tener `title`, `slug`, `summary`, `kind` y portada.
- Si es corto, puede tener video asociado.

## Tabla: albums

Representa series fotograficas o colecciones.

Campos:

- `id uuid primary key`
- `title text not null`
- `slug text unique not null`
- `summary text`
- `description text`
- `year integer`
- `cover_media_id uuid references media_assets(id)`
- `status content_status default 'draft'`
- `is_featured boolean default false`
- `sort_order integer default 0`
- `published_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

Reglas:

- Para publicar, debe tener portada y al menos una imagen asociada.
- El orden de imagenes se controla en `album_media`.

## Tabla: media_assets

Representa imagenes, videos externos y embeds.

Campos:

- `id uuid primary key`
- `kind media_kind not null`
- `bucket text`
- `path text`
- `public_url text`
- `external_url text`
- `title text`
- `alt text`
- `caption text`
- `mime_type text`
- `file_size integer`
- `width integer`
- `height integer`
- `duration_seconds integer`
- `dominant_color text`
- `blur_data_url text`
- `status content_status default 'draft'`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`

Reglas:

- `alt` sera obligatorio antes de publicar imagenes.
- `external_url` se usa para Vimeo/YouTube/Mux/Cloudinary si aplica.
- `path` debe ser unico por archivo subido.

## Tabla: project_media

Relaciona proyectos con media en orden.

Campos:

- `id uuid primary key`
- `project_id uuid references projects(id) on delete cascade`
- `media_id uuid references media_assets(id) on delete restrict`
- `sort_order integer default 0`
- `display_role text`
- `created_at timestamptz`

Indice unico recomendado:

- `(project_id, media_id)`

## Tabla: album_media

Relaciona albumes con imagenes en orden.

Campos:

- `id uuid primary key`
- `album_id uuid references albums(id) on delete cascade`
- `media_id uuid references media_assets(id) on delete restrict`
- `sort_order integer default 0`
- `created_at timestamptz`

Indice unico recomendado:

- `(album_id, media_id)`

## Tabla: tags

Campos:

- `id uuid primary key`
- `name text not null`
- `slug text unique not null`
- `color text`
- `created_at timestamptz`

## Tablas puente de tags

```sql
project_tags(project_id uuid, tag_id uuid)
album_tags(album_id uuid, tag_id uuid)
media_tags(media_id uuid, tag_id uuid)
```

Uso:

- Filtrado publico.
- Relaciones de proyectos relacionados.
- Organizacion admin.

## Tabla: site_settings

Contenido global editable.

Campos:

- `id uuid primary key`
- `site_name text default 'Luma Studio'`
- `tagline text`
- `bio_short text`
- `bio_full text`
- `contact_email text`
- `instagram_url text`
- `vimeo_url text`
- `youtube_url text`
- `hero_project_id uuid references projects(id)`
- `featured_album_id uuid references albums(id)`
- `featured_short_id uuid references projects(id)`
- `updated_at timestamptz`

Regla:

- Puede existir una sola fila activa para settings globales.

## SQL base orientativo

Este SQL es una base de implementacion; en fase de codigo se convertira en migraciones revisadas.

```sql
create extension if not exists "pgcrypto";

create type content_status as enum ('draft', 'published', 'archived');
create type media_kind as enum ('image', 'video', 'embed');
create type project_kind as enum ('photography', 'short_film', 'editorial', 'experimental', 'direction', 'mixed');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'admin',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  kind media_kind not null,
  bucket text,
  path text,
  public_url text,
  external_url text,
  title text,
  alt text,
  caption text,
  mime_type text,
  file_size integer,
  width integer,
  height integer,
  duration_seconds integer,
  dominant_color text,
  blur_data_url text,
  status content_status not null default 'draft',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  kind project_kind not null,
  year integer,
  role text,
  location text,
  credits text,
  cover_media_id uuid references media_assets(id),
  status content_status not null default 'draft',
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  year integer,
  cover_media_id uuid references media_assets(id),
  status content_status not null default 'draft',
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  media_id uuid not null references media_assets(id) on delete restrict,
  sort_order integer not null default 0,
  display_role text,
  created_at timestamptz not null default now(),
  unique (project_id, media_id)
);

create table album_media (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  media_id uuid not null references media_assets(id) on delete restrict,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (album_id, media_id)
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color text,
  created_at timestamptz not null default now()
);

create table project_tags (
  project_id uuid not null references projects(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (project_id, tag_id)
);

create table album_tags (
  album_id uuid not null references albums(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (album_id, tag_id)
);

create table media_tags (
  media_id uuid not null references media_assets(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (media_id, tag_id)
);

create table site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Luma Studio',
  tagline text,
  bio_short text,
  bio_full text,
  contact_email text,
  instagram_url text,
  vimeo_url text,
  youtube_url text,
  hero_project_id uuid references projects(id),
  featured_album_id uuid references albums(id),
  featured_short_id uuid references projects(id),
  updated_at timestamptz not null default now()
);
```

## Indices recomendados

```sql
create index projects_status_idx on projects(status);
create index projects_kind_idx on projects(kind);
create index projects_published_at_idx on projects(published_at desc);
create index albums_status_idx on albums(status);
create index albums_published_at_idx on albums(published_at desc);
create index media_assets_status_idx on media_assets(status);
create index project_media_order_idx on project_media(project_id, sort_order);
create index album_media_order_idx on album_media(album_id, sort_order);
```

## Validaciones de publicacion

Proyecto:

- `title` requerido.
- `slug` unico.
- `summary` requerido.
- `cover_media_id` requerido.
- `status = published` asigna `published_at` si no existe.

Album:

- `title` requerido.
- `slug` unico.
- `cover_media_id` requerido.
- Debe tener al menos una fila en `album_media`.

Media:

- Imagen publicada requiere `alt`.
- Imagen subida requiere `bucket`, `path`, `mime_type`, `width`, `height`.
- Embed/video requiere `external_url` o proveedor futuro.

