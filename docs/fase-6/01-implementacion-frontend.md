# Luma Studio - Fase 6: Implementacion frontend

Fecha: 2026-06-18

## Objetivo

Convertir el diseno publico y admin en una estructura frontend implementable con Next.js App Router, TypeScript, Tailwind CSS y componentes reutilizables.

## Stack frontend

- Next.js App Router.
- React Server Components por defecto.
- Client Components solo para interaccion real.
- TypeScript estricto.
- Tailwind CSS con variables de tema.
- `next/image` para imagenes.
- `next/link` para navegacion.
- Formularios admin con validacion compartida.

## Estructura recomendada

```text
src/
  app/
    (public)/
      layout.tsx
      page.tsx
      proyectos/
        page.tsx
        [slug]/page.tsx
      albumes/
        page.tsx
        [slug]/page.tsx
      cortos/page.tsx
      sobre/page.tsx
      contacto/page.tsx
    admin/
      layout.tsx
      login/page.tsx
      page.tsx
      proyectos/
      albumes/
      media/
      settings/
    api/
  components/
    public/
    admin/
    media/
    ui/
  lib/
    data/
    supabase/
    storage/
    validation/
    utils/
  types/
```

## Route groups

Usar:

- `(public)` para sitio publico sin afectar URL.
- `admin` para panel privado.

Motivo:

- Permite layouts separados.
- Mantiene rutas limpias.
- Evita mezclar UI publica con admin.

## Server vs Client Components

Server Components:

- Listados publicos.
- Detalles por slug.
- Home.
- Lectura de settings.
- Tablas admin si no requieren interaccion compleja.

Client Components:

- Menu mobile.
- Filtros interactivos.
- Lightbox.
- Drag-and-drop upload.
- Reordenamiento de albumes.
- Formularios con feedback inmediato.

Regla:

- No usar `"use client"` en layouts o paginas completas si solo una parte necesita interaccion.

## Componentes publicos

```text
PublicHeader
PublicFooter
HeroFeature
ProjectGrid
ProjectCard
ProjectDetailHero
AlbumGrid
AlbumCard
MasonryGallery
Lightbox
ShortFilmCard
AboutIntro
ContactBlock
```

## Componentes admin

```text
AdminShell
AdminSidebar
AdminTopbar
StatCard
ContentTable
StatusBadge
ProjectForm
AlbumForm
MediaUploader
MediaLibrary
MediaPicker
SortableMediaList
SettingsForm
ConfirmDialog
Toast
```

## Componentes UI base

```text
Button
Input
Textarea
Select
Checkbox
Badge
Card
Dialog
Dropdown
Tabs
Skeleton
EmptyState
ErrorState
```

## Data access

Crear funciones en `lib/data`:

```text
getHomeContent()
getPublishedProjects()
getProjectBySlug(slug)
getPublishedAlbums()
getAlbumBySlug(slug)
getPublishedShorts()
getSiteSettings()
```

Admin:

```text
getAdminProjects()
getAdminAlbums()
getAdminMedia()
getAdminSettings()
```

Regla:

- Las paginas llaman funciones de data, no queries sueltas repetidas.
- Las funciones publicas siempre filtran `status = published`.

## Loading y error files

Usar convenciones de Next:

```text
loading.tsx
error.tsx
not-found.tsx
```

Rutas prioritarias:

- `/proyectos`
- `/proyectos/[slug]`
- `/albumes`
- `/albumes/[slug]`
- `/admin`
- `/admin/media`

## Metadata

Implementar:

- Metadata global.
- Metadata por proyecto.
- Metadata por album.
- Open Graph image desde portada.
- Sitemap.

## Criterio de cierre

La fase 6 queda lista cuando:

- Estructura de carpetas definida.
- Componentes publicos/admin definidos.
- Reglas Server/Client claras.
- Data access separado.
- Loading/error/not-found previstos.
- Metadata y sitemap considerados.

## Fuentes tecnicas

- Next.js project structure: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js generateMetadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js sitemap: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

