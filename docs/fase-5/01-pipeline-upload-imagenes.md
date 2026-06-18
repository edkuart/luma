# Luma Studio - Fase 5: Pipeline de upload de imagenes

Fecha: 2026-06-18

## Objetivo

Definir el flujo tecnico y de experiencia para subir imagenes desde el panel admin, guardarlas en Supabase Storage, registrar metadata en Postgres y dejarlas disponibles para proyectos, albumes y portada del sitio.

## Principio central

La imagen no es solo un archivo. Para Luma Studio, cada imagen debe guardarse como un asset con metadata tecnica, texto alternativo, estado, relacion con contenido y ruta estable.

## Decision tecnica

Primera version:

- Supabase Storage para imagenes.
- Tabla `media_assets` para metadata.
- Upload estandar para archivos pequenos.
- TUS/resumable upload para archivos mayores a 6 MB.
- `next/image` para entrega optimizada en el sitio publico.

Justificacion:

- Supabase recomienda upload estandar para archivos hasta 6 MB y TUS para archivos mayores por confiabilidad.
- Supabase recomienda no sobrescribir archivos porque el CDN puede servir contenido viejo durante propagacion.
- Next.js Image permite optimizar imagenes remotas si se configuran patrones permitidos.

## Buckets

### `media-public`

Uso inicial:

- Imagenes visibles del sitio publico.
- Portadas.
- Galerias.
- Posters/stills de cortometrajes.

### `media-originals`

Uso futuro/recomendado:

- Originales sin procesar.
- Respaldo privado.
- No se sirve directamente al publico.

Primera implementacion:

- Puede iniciar solo con `media-public` para simplificar.
- Si se requiere guardar originales privados, agregar `media-originals`.

## Flujo de usuario admin

```text
Admin entra a /admin/media
  -> pulsa Subir imagenes
  -> arrastra o selecciona archivos
  -> ve previews locales
  -> sistema valida tipo/peso/dimensiones
  -> admin confirma subida
  -> cada archivo sube a Supabase Storage
  -> se crea fila en media_assets
  -> aparece en Media Library
  -> admin edita alt/caption si falta
  -> admin asigna imagen a proyecto/album
```

## Flujo tecnico

```text
File selected
  -> client validation
  -> read dimensions with browser image APIs
  -> generate unique storage path
  -> upload to Supabase Storage
  -> get public URL/path
  -> insert media_assets row
  -> update UI state
```

## Generacion de path

Formato:

```text
images/yyyy/mm/{uuid}-{safe-original-name}.{ext}
```

Ejemplo:

```text
images/2026/06/4f2d9f01-retratos-nocturnos.webp
```

Reglas:

- Convertir nombre original a slug seguro.
- Agregar UUID.
- Mantener extension real.
- No usar `upsert` por defecto.
- Si hay reemplazo de portada, subir nuevo archivo y actualizar referencia.

## Seleccion de uploader

Opciones viables:

### Uppy

Ventajas:

- Buen Dashboard.
- Progreso por archivo.
- Soporta plugins y flujos avanzados.
- Encaja mejor si luego se agrega TUS/resumable.

### FilePond

Ventajas:

- Muy buena preview de imagen.
- Validaciones de tipo/peso.
- UI elegante y rapida para imagenes.

Recomendacion:

- Usar **Uppy** si priorizamos uploads grandes, progreso robusto y crecimiento tecnico.
- Usar **FilePond** si priorizamos experiencia visual rapida para imagenes en panel.

Decision propuesta para Luma:

- **Uppy** para la implementacion principal, por su crecimiento hacia TUS y uploads por lote.
- Complementar con preview custom si la UI necesita verse mas editorial.

## Tipos permitidos

```text
image/jpeg
image/png
image/webp
image/avif
```

Regla:

- SVG no se acepta como fotografia/obra visual por defecto.
- GIF no se acepta inicialmente para evitar problemas de peso y reproduccion.

## Limites iniciales

```text
max file size: 25 MB
recommended standard upload: <= 6 MB
resumable upload: > 6 MB
max batch: 30 files
```

Estos limites deben vivir en una constante compartida:

```ts
export const MEDIA_UPLOAD_LIMITS = {
  maxFileSizeMb: 25,
  standardUploadThresholdMb: 6,
  maxBatchSize: 30,
}
```

## Estados del upload

Por archivo:

- `queued`
- `validating`
- `ready`
- `uploading`
- `saving_metadata`
- `complete`
- `failed`

Por lote:

- `idle`
- `validating`
- `uploading`
- `partial_success`
- `complete`
- `failed`

## Resultado esperado por archivo

Al finalizar, cada archivo debe tener:

- ID en `media_assets`.
- Bucket.
- Path.
- URL publica o ruta resoluble.
- Dimensiones.
- Peso.
- MIME type.
- Estado inicial `draft`.

## Reintentos

Regla:

- Si falla upload antes de Storage, reintentar mismo archivo con nuevo path.
- Si falla metadata despues de upload, mostrar estado `uploaded_without_metadata` en UI y permitir reintentar insercion.
- No duplicar filas si el usuario reintenta metadata.

Primera version:

- Manejar el caso con UI y logs.
- Fase futura: job de reconciliacion de archivos sin metadata.

## Fuentes tecnicas

- Supabase standard uploads: https://supabase.com/docs/guides/storage/uploads/standard-uploads
- Next.js Image: https://nextjs.org/docs/app/api-reference/components/image
- Uppy Dashboard: https://uppy.io/docs/dashboard/
- FilePond image preview: https://pqina.nl/filepond/docs/api/plugins/image-preview/

