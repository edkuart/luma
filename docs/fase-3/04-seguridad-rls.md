# Luma Studio - Fase 3: Seguridad y RLS

Fecha: 2026-06-18

## Objetivo

Definir permisos para proteger admin, base de datos y Storage. La regla principal es simple: el publico solo lee contenido publicado; el administrador autenticado gestiona todo.

## Principios

- RLS activado en tablas de contenido.
- Admin autenticado requerido para mutaciones.
- Publico no puede leer borradores.
- Publico no puede listar Storage privado.
- Secret keys nunca van al navegador.
- Validar rol admin en servidor.

## Roles

### Publico anonimo

Puede:

- Leer proyectos publicados.
- Leer albumes publicados.
- Leer media publicada relacionada.
- Leer settings publicos.

No puede:

- Crear contenido.
- Ver borradores.
- Subir archivos.
- Listar buckets privados.

### Admin autenticado

Puede:

- Leer todo.
- Crear/editar/archivar proyectos.
- Crear/editar/archivar albumes.
- Subir media.
- Editar metadata.
- Publicar/despublicar.
- Editar settings.

## Helper recomendado

Funcion SQL conceptual:

```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;
```

Nota:

La funcion debe revisarse al implementar para evitar problemas de permisos o search_path.

## Politicas publicas conceptuales

Proyectos:

```sql
alter table projects enable row level security;

create policy "Public can read published projects"
on projects for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage projects"
on projects for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
```

Albumes:

```sql
alter table albums enable row level security;

create policy "Public can read published albums"
on albums for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage albums"
on albums for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
```

Media:

```sql
alter table media_assets enable row level security;

create policy "Public can read published media"
on media_assets for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage media"
on media_assets for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
```

Settings:

```sql
alter table site_settings enable row level security;

create policy "Public can read site settings"
on site_settings for select
to anon, authenticated
using (true);

create policy "Admins can manage site settings"
on site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
```

## Politicas para tablas puente

Lectura publica:

- Permitir leer relacion si el proyecto/album/media relacionado esta publicado.

Admin:

- Admin puede crear/editar/borrar relaciones.

Implementacion:

- Puede iniciarse con lectura publica restringida por joins/queries del backend.
- Para RLS estricta, crear politicas `exists` que verifiquen contenido publicado relacionado.

## Storage RLS

Supabase Storage usa RLS sobre `storage.objects`. Por defecto no permite uploads sin politicas.

### Politica conceptual: admin sube a bucket publico

```sql
create policy "Admins can upload public media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media-public'
  and public.is_admin()
);
```

### Politica conceptual: admin gestiona media

```sql
create policy "Admins can manage public media"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'media-public'
  and public.is_admin()
)
with check (
  bucket_id = 'media-public'
  and public.is_admin()
);
```

### Lectura publica

Si `media-public` es bucket publico:

- No se necesita politica de lectura especifica para archivos publicos.

Si es bucket privado/controlado:

- Crear politica `select` para objetos publicados o servir con signed URLs.
- Para primera version, bucket publico con paths no sensibles es suficiente.

## Proteccion de rutas admin

En Next.js:

- Proteger `/admin/*` con Supabase SSR.
- Validar usuario con claims en servidor.
- Consultar `profiles.role`.
- Redirigir a `/admin/login` si no hay sesion.

Regla:

- No confiar solo en UI escondida.
- Todas las mutaciones deben validar admin.

## Sesiones

Supabase SSR para Next usa cookies y requiere clientes server/browser.

Buenas practicas:

- Browser client solo para componentes cliente.
- Server client para Server Components, Server Actions y Route Handlers.
- En servidor, preferir validacion robusta de claims.
- No cachear respuestas que escriben cookies de sesion para otros usuarios.

## Secretos

Permitido en cliente:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Solo servidor:

- `SUPABASE_SECRET_KEY`
- cualquier service/secret key

Regla:

- Si un archivo usa secret key, no debe importarse desde componentes cliente.

## Auditoria minima

Primera version:

- `created_at`
- `updated_at`
- `created_by` en media
- `published_at`

Fase futura:

- Tabla `audit_events` para registrar acciones admin:
  - create
  - update
  - publish
  - unpublish
  - delete/archive
  - upload

## Checklist de seguridad antes de produccion

- RLS activado en tablas.
- Politicas publicas revisadas.
- Politicas admin revisadas.
- Storage sin uploads anonimos.
- Admin protegido server-side.
- Secret key fuera del cliente.
- Variables de entorno en Vercel.
- Contenido borrador no aparece en publico.
- Upload valida tipo/peso/ruta.
- No se puede publicar media sin alt.

