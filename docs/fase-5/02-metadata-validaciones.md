# Luma Studio - Fase 5: Metadata y validaciones

Fecha: 2026-06-18

## Objetivo

Definir que informacion se guarda por imagen y que validaciones se aplican antes de subir, antes de guardar metadata y antes de publicar contenido.

## Metadata tecnica obligatoria

Cada imagen subida debe guardar:

```text
id
kind = image
bucket
path
public_url
mime_type
file_size
width
height
status
created_by
created_at
updated_at
```

## Metadata editorial

Campos editables por admin:

```text
title
alt
caption
tags
dominant_color
```

Regla:

- `alt` es obligatorio para publicar.
- `caption` es opcional.
- `title` es opcional pero recomendado en Media Library.
- `dominant_color` puede calcularse luego; no bloquea publicacion.

## Validacion cliente

Antes del upload:

- Tipo MIME permitido.
- Peso <= limite.
- Lote <= limite.
- Imagen legible.
- Dimensiones detectables.
- Extension congruente con MIME si es posible.

Errores:

```text
Archivo no permitido. Usa JPG, PNG, WebP o AVIF.
El archivo supera el limite permitido.
No se pudo leer la imagen.
Seleccionaste demasiados archivos.
```

## Validacion servidor

Antes de insertar metadata:

- Usuario autenticado.
- Usuario admin.
- Bucket permitido.
- Path dentro de prefijo permitido.
- MIME permitido.
- Metadata tecnica presente.
- No duplicar `(bucket, path)`.

## Dimensiones recomendadas

### Hero home/proyecto

```text
min width: 1800px
ideal: 2400px+
```

### Portadas de cards

```text
min width: 1200px
ideal: 1600px
```

### Galerias/albumes

```text
min width: 1200px
vertical/horizontal permitido
```

Regla:

- No bloquear automaticamente imagenes mas pequenas en borrador.
- Mostrar advertencia si una imagen pequena se usa como hero o portada.

## Alt text

Reglas:

- Obligatorio antes de publicar.
- Debe describir la imagen, no repetir solo el titulo del proyecto.
- No usar `imagen de...` si no aporta.
- Para imagen decorativa en UI, alt vacio; para obra fotografica, alt descriptivo.

Ejemplos:

```text
Retrato nocturno de una persona bajo luz roja y azul.
Fotograma de cortometraje con una figura caminando frente a una pared iluminada.
Serie de fotografias urbanas con sombras largas al atardecer.
```

## Caption

Uso:

- Texto visible opcional en lightbox o detalle.
- Puede incluir contexto, tecnica, locacion o nota artistica.

Regla:

- Caption no reemplaza alt.

## Estado de media

### draft

- Recién subida.
- Puede estar incompleta.
- No visible directamente en publico salvo asociacion con contenido publicado si se decide publicarla.

### published

- Lista para aparecer en publico.
- Tiene alt.
- Esta asociada a contenido publicado o fue marcada como reusable.

### archived

- Oculta del selector principal.
- No borrar archivo automaticamente.

## Publicacion de media

Al publicar proyecto/album:

- Verificar que las imagenes asociadas tengan alt.
- Marcar media asociada como `published` si estaba en draft.
- Mantener media no asociada como draft.

Decision:

- El estado final publico lo controla el contenido padre y la media asociada.
- Una imagen no debe aparecer navegable por si sola en publico.

## Imagenes duplicadas

Primera version:

- Permitir subir duplicados si tienen path distinto.
- Mostrar nombre original y fecha para identificar.

Fase futura:

- Calcular hash del archivo.
- Advertir posible duplicado.

## Derivados futuros

Campos previstos:

- `blur_data_url`
- `dominant_color`
- `thumbnail_path`
- `optimized_path`
- `original_asset_id`

No son obligatorios para primera version, pero el modelo debe permitir agregarlos sin romper contenido.

