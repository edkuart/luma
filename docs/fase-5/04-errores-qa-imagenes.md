# Luma Studio - Fase 5: Errores y QA de imagenes

Fecha: 2026-06-18

## Objetivo

Definir los casos de error y criterios de prueba para que la subida y visualizacion de imagenes sea confiable.

## Errores de upload

### Tipo no permitido

Mensaje:

```text
Archivo no permitido. Usa JPG, PNG, WebP o AVIF.
```

Accion:

- Quitar archivo.
- Seleccionar otro.

### Peso excedido

Mensaje:

```text
El archivo supera el limite permitido.
```

Accion:

- Quitar archivo.
- Subir una version optimizada.

### Error de lectura

Mensaje:

```text
No se pudo leer la imagen.
```

Accion:

- Reintentar.
- Quitar archivo.

### Sesion expirada

Mensaje:

```text
La sesion expiro. Vuelve a iniciar sesion para continuar.
```

Accion:

- Ir a login.
- Preservar archivos locales si el navegador lo permite.

### Upload parcial

Mensaje:

```text
Algunas imagenes no se subieron.
```

Accion:

- Ver detalle por archivo.
- Reintentar fallidas.

### Metadata fallida

Mensaje:

```text
La imagen se subio, pero no se pudo guardar la metadata.
```

Accion:

- Reintentar guardar metadata.
- Reportar en logs.

## Errores de render publico

### Imagen no encontrada

Comportamiento:

- Mostrar fallback visual oscuro.
- Mantener dimensiones.
- No romper grilla.

### Sin alt

Comportamiento:

- En admin, bloquear publicacion.
- En publico no deberia ocurrir.

### URL externa no permitida

Comportamiento:

- Next.js fallara si remotePatterns no incluye dominio.
- Debe detectarse en QA al configurar Supabase.

## QA funcional

### Upload individual

Casos:

- Subir JPG valido.
- Subir PNG valido.
- Subir WebP valido.
- Subir AVIF valido.
- Rechazar PDF.
- Rechazar archivo demasiado grande.

### Upload multiple

Casos:

- Subir lote de 5 imagenes.
- Subir lote con una imagen invalida.
- Subir lote que excede max batch.
- Simular fallo de red si es posible.

### Metadata

Casos:

- Guardar alt.
- Guardar caption.
- Detectar width/height.
- Asociar a proyecto.
- Asociar a album.
- Quitar de album sin borrar asset.

### Publicacion

Casos:

- No publicar proyecto sin portada.
- No publicar album sin imagenes.
- No publicar contenido con imagen sin alt.
- Publicar contenido valido.
- Despublicar contenido y confirmar que desaparece del publico.

## QA visual

Home:

- Hero ocupa el primer viewport correctamente.
- Texto no tapa el centro visual de la imagen.
- Imagen carga sin salto grande.

Proyectos:

- Cards mantienen aspecto.
- Hover no oculta titulo.
- Mobile muestra cards completas.

Album:

- Masonry acepta verticales y horizontales.
- Lightbox muestra imagen completa.
- Controles funcionan en mobile.

Cortos:

- Posters cargan rapido.
- Embeds no cargan todos al inicio.

## QA responsive

Breakpoints:

- 390px mobile.
- 768px tablet.
- 1024px desktop.
- 1440px wide.

Validar:

- No hay overflow horizontal.
- Filtros scrollean en mobile.
- Lightbox no queda cortado.
- Botones tienen tamano tactil suficiente.
- Imagenes no se pixelan de forma evidente.

## QA performance

Revisar:

- LCP de home.
- Peso inicial.
- Numero de imagenes cargadas al inicio.
- Imagen hero priorizada.
- Galerias lazy.
- No hay layout shift fuerte.

## Checklist antes de implementar

- Bucket definido.
- RLS definida.
- Tabla `media_assets` lista.
- Constantes de limite definidas.
- Uploader elegido.
- Config de Next Image lista.
- Estados de error definidos.
- Validaciones de publicacion definidas.

