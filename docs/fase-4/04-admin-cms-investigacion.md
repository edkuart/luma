# Investigacion: Admin CMS para Luma Studio

Fecha: 2026-06-19

## Objetivo

Convertir el admin en un CMS propio para que la artista pueda modificar la web publica sin tocar codigo: textos, imagenes, proyectos, albumes, cortos, home, secciones visibles, orden, estados y datos de contacto.

## Estado actual del proyecto

Ya existe una base util:

- Auth admin propia en `/admin/login`, con sesion por cookie firmada.
- Dashboard privado en `/admin`.
- CRUD inicial de proyectos y albumes.
- Media library basica en `/admin/media`, por ahora agregando imagenes por URL.
- Settings en `/admin/settings` para textos del home, modo automatico/manual y secciones visibles.
- Neon + Drizzle con tablas `projects`, `albums`, `media_assets`, relaciones de media/tags y `site_settings`.
- Estados de contenido: `draft`, `published`, `archived`.
- Seed inicial para cargar contenido demo en la base.

Gaps principales:

- Las Server Actions deben validar la sesion admin por dentro, no solo depender del proxy.
- La media library todavia no sube archivos reales a cloud storage.
- El editor de home aun es muy basico: muestra/oculta secciones, pero no permite crear secciones nuevas ni reordenarlas visualmente.
- Proyectos y albumes usan textarea tipo `url | alt | caption`; esto debe pasar a selector visual de media.
- No hay preview formal para ver cambios antes de publicar.
- No hay auditoria, historial ni confirmaciones fuertes para borrado.
- No hay notificaciones por correo, pero ya existe `ADMIN_NOTIFICATION_EMAIL` reservado.

## Hallazgos de investigacion

### 1. Server Actions como base del admin

Next.js recomienda usar Server Actions para formularios, pero tambien indica verificar autenticacion y autorizacion dentro de cada accion, incluso si el formulario se renderiza en una pagina autenticada.

Aplicacion para Luma:

- Mantener formularios con Server Actions.
- Crear un helper `requireAdmin()` reutilizable.
- Llamar `await requireAdmin()` al inicio de cada accion admin: proyectos, albumes, media, settings, uploads y logout.
- Despues de mutar contenido, usar `revalidatePath()` para refrescar las rutas publicas afectadas.

Fuente: https://nextjs.org/docs/app/guides/forms

### 2. Home editable como sistema de bloques

CMS maduros usan un modelo de bloques/secciones para paginas flexibles:

- Wagtail StreamField permite mezclar bloques como heading, parrafo, imagen y galeria.
- Payload Blocks guarda bloques con `slug`/`blockType` y campos definidos por bloque.
- Sanity Portable Text usa contenido estructurado en JSON y se renderiza con componentes.

Aplicacion para Luma:

- No conviene dar libertad absoluta tipo constructor visual desde el primer dia.
- Conviene un set curado de secciones artisticas:
  - `hero_project`
  - `featured_projects`
  - `featured_album`
  - `featured_short`
  - `artist_note`
  - `image_grid`
  - `contact_cta`
  - `text_statement`
- Cada seccion debe tener `visible`, `sortOrder`, `title`, `eyebrow`, `body`, `mediaId` o referencias a proyectos/albumes.

Fuentes:

- https://docs.wagtail.org/en/stable/topics/streamfield.html
- https://payloadcms.com/docs/fields/blocks
- https://www.sanity.io/docs/developer-guides/presenting-block-text

### 3. Media library real

Una media library buena no es solo subir imagenes. Debe centralizar assets, permitir busqueda, filtros, metadata, alt text, captions, dimensiones, folders/colecciones y reutilizacion en contenido.

Strapi documenta media library con busqueda, filtros, organizacion, limites de archivo, tipos permitidos, responsive images y metadata. Cloudflare R2 permite subir con presigned URLs compatibles con S3, restringiendo `Content-Type` y usando CORS para cargas desde navegador.

Aplicacion para Luma:

- Paso MVP: upload directo a R2 con presigned `PUT`.
- Guardar en `media_assets`: `bucket`, `path`, `publicUrl`, `mimeType`, `fileSize`, `width`, `height`, `alt`, `caption`, `status`.
- Validar solo imagenes al principio: `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
- Mantener videos como `externalUrl`/embed al inicio para Vimeo/YouTube.
- Agregar selector visual de media para portadas y galerias.

Fuentes:

- https://docs.strapi.io/cms/features/media-library
- https://developers.cloudflare.com/r2/api/s3/presigned-urls/

### 4. Imagenes publicas y accesibilidad

Next Image necesita dominios remotos configurados y cada imagen debe tener `alt`. La documentacion de Next indica que el `alt` debe reemplazar el significado de la imagen para lectores de pantalla y busqueda, no repetir captions.

Aplicacion para Luma:

- `alt` obligatorio para media publicada.
- `caption` opcional.
- `dominantColor` y `blurDataUrl` son mejoras posteriores para carga visual elegante.
- Configurar `next.config.ts` para el dominio final de R2 o CDN.

Fuente: https://nextjs.org/docs/app/api-reference/components/image

### 5. Drafts, preview y publicacion

Next Draft Mode permite previsualizar contenido borrador sin reconstruir el sitio completo. Para una artista, esto es muy valioso: puede revisar una pagina antes de publicarla.

Aplicacion para Luma:

- Mantener estados `draft`, `published`, `archived`.
- Agregar boton "Preview" en proyectos, albumes y home.
- Crear `/api/draft` protegido por admin para activar draft mode.
- Las lecturas publicas siguen mostrando solo `published`.
- Las lecturas en preview pueden incluir `draft`.

Fuente: https://nextjs.org/docs/app/guides/draft-mode

### 6. Cache y revalidacion

Cuando el admin actualiza contenido, las rutas publicas deben refrescar. Next permite revalidacion bajo demanda con `revalidatePath()` o `revalidateTag()` desde Server Actions o Route Handlers.

Aplicacion para Luma:

- Al guardar settings: revalidar `/`, `/contacto`, `/sobre`.
- Al guardar proyecto: revalidar `/`, `/proyectos`, `/proyectos/[slug]` y `/cortos` si es `short_film`.
- Al guardar album: revalidar `/`, `/albumes`, `/albumes/[slug]`.
- Al guardar media usada por contenido: revalidar rutas vinculadas.

Fuente: https://nextjs.org/docs/app/guides/caching

## Modelo recomendado

### Mantener ahora

- `projects`
- `albums`
- `media_assets`
- `tags`
- relaciones `project_media`, `album_media`
- `site_settings`

### Agregar para CMS flexible

Tabla `page_sections`:

- `id`
- `pageKey`: `home`, `sobre`, `contacto`
- `sectionType`: `hero_project`, `image_grid`, `featured_projects`, `artist_note`, etc.
- `title`
- `eyebrow`
- `body`
- `mediaId`
- `linkedProjectId`
- `linkedAlbumId`
- `config` JSONB
- `visible`
- `sortOrder`
- `status`
- `createdAt`
- `updatedAt`

Ventaja: permite crear/reordenar secciones sin alterar `site_settings` cada vez.

### Agregar mas adelante

Tabla `audit_log`:

- `id`
- `actorEmail`
- `action`
- `entityType`
- `entityId`
- `summary`
- `createdAt`

Tabla `notifications` o integracion directa con proveedor email:

- notificar nuevo mensaje de contacto
- notificar publicacion
- notificar error de upload

## UX recomendada para el admin

### Navegacion

- Dashboard
- Home
- Proyectos
- Albumes
- Cortos
- Media
- Paginas
- Ajustes

### Dashboard

Debe mostrar:

- Conteo de proyectos, albumes, cortos, media.
- Estado del home actual.
- Borradores pendientes.
- Acciones rapidas: nuevo proyecto, subir imagen, editar home.

### Home builder

Primera version:

- Lista vertical de secciones.
- Toggle visible/oculto.
- Campo de orden numerico o botones subir/bajar.
- Editor por tipo de seccion.
- Preview link.

No meter drag-and-drop en la primera pasada si retrasa. Podemos agregarlo despues.

### Media

Primera version real:

- Upload de archivo.
- Grid con preview.
- Editar alt/caption.
- Copiar URL.
- Borrar si no esta en uso.
- Filtros: imagen/video/embed, publicado/borrador.

### Proyectos y albumes

Cambiar de textareas de URLs a:

- selector de portada desde media library
- galeria visual con items seleccionados
- orden de galeria
- campos SEO basicos
- estado: borrador/publicado/archivado
- preview

## Fases de implementacion sugeridas

### Fase Admin 1: Seguridad interna de acciones

- Crear `requireAdmin()`.
- Proteger todas las Server Actions admin.
- Agregar confirmaciones para borrar.
- Validar inputs minimos.

### Fase Admin 2: Home CMS

- Crear `page_sections`.
- Migrar home sections desde `site_settings` a `page_sections`.
- Crear `/admin/home`.
- Renderizar home publico desde DB.

### Fase Admin 3: Media uploads reales

- Instalar cliente S3 compatible.
- Crear endpoint/action para presigned URL.
- Subir a R2.
- Guardar metadata en `media_assets`.
- Configurar dominio en `next.config.ts`.

### Fase Admin 4: Selectores visuales

- Portada de proyecto desde media library.
- Galeria de proyecto desde media library.
- Portada/galeria de album desde media library.
- Evitar borrar media usada por contenido.

### Fase Admin 5: Preview y publicacion

- Draft mode.
- Boton preview.
- Revalidacion por rutas.
- Publicar/despublicar desde editor.

### Fase Admin 6: Paginas publicas editables

- `/sobre` editable desde admin.
- `/contacto` editable desde admin.
- SEO basico por pagina.

### Fase Admin 7: Notificaciones por correo

- Elegir proveedor: Resend es buena opcion simple para Next.
- Enviar correos de contacto a `ADMIN_NOTIFICATION_EMAIL`.
- Guardar mensajes en DB opcionalmente.

## Decision tecnica recomendada

Construir CMS propio ligero, no instalar un CMS completo externo por ahora.

Razon:

- Ya tenemos Neon, Drizzle, auth propia, admin routes y contenido inicial.
- El sitio es para una artista, no para una empresa con equipo editorial grande.
- Necesitamos libertad visual en el frontend publico.
- Un sistema de secciones tipadas da control suficiente sin volver el admin confuso.

La prioridad inmediata debe ser:

1. Seguridad interna de Server Actions.
2. `/admin/home` con secciones editables.
3. Upload real de imagenes.

