# Luma Studio - Fase 3: Storage y uploads

Fecha: 2026-06-18

## Objetivo

Definir como se subiran, guardaran, serviran y organizaran las imagenes y videos del proyecto.

## Buckets recomendados

### `media-originals`

Uso:

- Archivos originales subidos por admin.
- Puede ser privado.
- No necesariamente se sirve directo al publico.

Politica:

- Admin puede insertar, leer, actualizar y borrar.
- Publico no puede listar.

### `media-public`

Uso:

- Versiones publicables/optimizadas.
- Puede ser publico o controlado por RLS segun implementacion.

Politica:

- Publico puede leer archivos publicados.
- Admin puede insertar/actualizar/borrar.

Primera version practica:

- Usar `media-public` para imagenes visibles del sitio.
- Mantener rutas unicas y no sobrescribir.
- Guardar metadata completa en `media_assets`.

## Rutas de archivos

Formato recomendado:

```text
media-public/
  images/
    yyyy/
      mm/
        uuid-original-name.webp
  posters/
    yyyy/
      mm/
        uuid-poster.webp
  originals/
    yyyy/
      mm/
        uuid-original-name.ext
```

Regla:

- Nunca usar solo el nombre original del archivo.
- Siempre incluir UUID o hash.
- Evitar `upsert` salvo reemplazo controlado.

Motivo:

Sobrescribir archivos puede provocar contenido viejo por cache/CDN. La ruta nueva evita propagacion stale y facilita auditoria.

## Tipos permitidos

Imagenes:

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/avif`

Videos primera version:

- No subir video pesado propio inicialmente.
- Usar embed externo de Vimeo/YouTube.
- Guardar poster/still como imagen.

Videos fase futura:

- Mux o Cloudinary Video para streaming/adaptive bitrate.

## Limites iniciales

Recomendacion:

- Imagen individual: maximo configurable entre 10 MB y 25 MB.
- Para archivos mayores a 6 MB, preferir TUS/resumable upload.
- Lote inicial: maximo 30 imagenes por carga para no romper UX.

Nota tecnica:

Supabase indica que el upload estandar es ideal para archivos de hasta 6 MB y recomienda TUS para archivos mayores por confiabilidad.

## Metadata obligatoria

Al subir imagen:

- `kind = image`
- `bucket`
- `path`
- `public_url`
- `mime_type`
- `file_size`
- `width`
- `height`
- `alt`
- `caption` opcional
- `dominant_color` opcional
- `blur_data_url` opcional
- `created_by`

Antes de publicar:

- `alt` requerido.
- Debe estar asociada a proyecto o album.

## Flujo de upload admin

```text
Admin autenticado
  -> selecciona imagenes
  -> validacion cliente
  -> generar metadata preliminar
  -> upload a Supabase Storage
  -> obtener path/url
  -> guardar registro en media_assets
  -> mostrar en Media Library
  -> asignar a proyecto/album
```

## Validacion cliente

Antes de subir:

- Tipo MIME permitido.
- Peso menor al limite.
- Imagen legible.
- Dimensiones minimas.
- Preview local.

Dimensiones minimas recomendadas:

- Portada hero: 1800 px de ancho minimo.
- Cards/grillas: 1200 px de ancho recomendado.
- Albumes: aceptar vertical/horizontal sin recorte destructivo.

## Validacion servidor

Antes de guardar metadata:

- Usuario autenticado.
- Usuario con rol admin.
- Bucket permitido.
- Path con prefijo permitido.
- Tipo MIME permitido.
- Metadata tecnica presente.

## Optimizacion de imagenes

Primera version:

- Usar `next/image` para entregar tamanos responsive.
- Configurar `remotePatterns` para dominio de Supabase Storage.
- Guardar ancho/alto para layout estable.
- Usar `priority` solo en imagen hero.
- Lazy-load en galerias y cards fuera del primer viewport.

Fase posterior:

- Generar thumbnails persistentes.
- Extraer color dominante.
- Generar blur placeholder.
- Evaluar Cloudinary si se necesita transformacion avanzada.

## Media Library

La biblioteca admin debe permitir:

- Ver imagenes subidas.
- Buscar por titulo/alt.
- Filtrar por tipo y estado.
- Seleccionar varias imagenes.
- Asignar a album/proyecto.
- Editar alt/caption.
- Marcar como archivada.

## Borrado

Regla conservadora:

- No borrar archivo fisico automaticamente al quitarlo de un proyecto.
- Primero retirar asociacion.
- Borrar asset solo desde Media Library con confirmacion.

Motivo:

Una misma imagen puede estar en varios proyectos/albumes.

## Estados de upload

- `queued`
- `uploading`
- `processing`
- `ready`
- `failed`

Estos estados pueden vivir inicialmente solo en UI. Si luego hay procesamiento asincrono, se agregan a base de datos.

## Errores esperados

- Archivo demasiado grande.
- Tipo no permitido.
- Sesion expirada.
- Fallo de red.
- Ruta ya existente.
- Error guardando metadata.
- Upload parcial en carga multiple.

Cada error debe mostrar accion:

- Reintentar.
- Quitar archivo.
- Editar datos.
- Volver a iniciar sesion.

