# Luma Studio - Fase 1: Componentes y estados

Fecha: 2026-06-18

## Componentes publicos principales

### PublicHeader

Uso:

- Navegacion global del sitio publico.

Contenido:

- Logo/nombre.
- Links principales.
- Link de contacto.
- Menu movil.

Comportamiento:

- Transparente o semitransparente sobre hero.
- Fondo solido oscuro al hacer scroll.
- Estado activo por ruta.

### HeroFeature

Uso:

- Primer bloque del home.

Contenido:

- Imagen o video destacado.
- Titulo corto.
- Frase de apoyo.
- CTA primario.

Reglas:

- Debe ocupar el primer viewport.
- La imagen debe ser clara, no abstracta.
- El texto no debe tapar el punto visual principal de la imagen.

### ProjectCard

Contenido:

- Portada.
- Titulo.
- Categoria.
- Ano.

Estados:

- Default: portada dominante.
- Hover: overlay oscuro + acento saturado + CTA.
- Sin imagen: fallback visual sobrio con color dominante.

### AlbumCard

Contenido:

- Portada.
- Titulo.
- Numero de imagenes.
- Descripcion corta.

Estado hover:

- Zoom suave o desplazamiento leve.
- Mostrar `Explorar album`.

### MasonryGallery

Uso:

- Albumes y galerias de proyecto.

Reglas:

- Soportar formatos verticales, horizontales y cuadrados.
- Lazy-load fuera del primer viewport.
- Conservar orden manual.
- Abrir Lightbox.

### Lightbox

Contenido:

- Imagen grande.
- Titulo/alt opcional.
- Contador.
- Controles anterior/siguiente.
- Cerrar con boton visible y tecla Escape.

### VideoCard

Contenido:

- Poster.
- Titulo.
- Duracion.
- Ano.
- CTA para ver.

Regla:

- Nunca autoplay con audio.
- Usar poster optimizado.

## Componentes admin principales

### AdminLayout

Contenido:

- Sidebar o nav superior.
- Identidad discreta.
- Estado de sesion.
- Area principal.

Estilo:

- Mas sobrio que el sitio publico.
- Fondo oscuro, alto contraste, buena legibilidad.

### MediaUploader

Funciones:

- Drag-and-drop.
- Selector de archivos.
- Preview.
- Validacion de tipo y peso.
- Progreso por archivo.
- Resultado: exito/error.

Estados:

- Empty
- Drag active
- Uploading
- Success
- Error
- Partial success

### MediaLibrary

Funciones:

- Buscar por titulo/alt.
- Filtrar por tipo.
- Ver detalles.
- Seleccionar multiples imagenes.
- Asignar a proyecto/album.

### ProjectForm

Campos:

- Titulo
- Slug
- Categoria
- Ano
- Descripcion corta
- Descripcion larga
- Portada
- Media
- Estado
- Destacado

Estados:

- Draft
- Saving
- Saved
- Validation error
- Published

### AlbumForm

Campos:

- Titulo
- Slug
- Descripcion
- Portada
- Imagenes ordenables
- Estado
- Destacado

Estados:

- Empty album
- Reordering
- Saving
- Published

## Estados globales obligatorios

### Loading

- Skeletons para grillas.
- Spinner solo en acciones pequenas.
- No bloquear toda la pantalla salvo login/upload.

### Empty

Ejemplos:

- Sin proyectos publicados.
- Sin albumes.
- Sin imagenes en biblioteca.
- Album creado pero sin imagenes.

Cada empty state debe tener una accion clara.

### Error

Debe mostrar:

- Mensaje claro.
- Accion de reintentar.
- Detalle tecnico solo en admin/desarrollo.

### Borrador vs publicado

Admin:

- Mostrar estado visible.
- Permitir guardar borrador.
- Publicar solo si hay datos minimos completos.

Publico:

- Solo mostrar contenido publicado.

## Reglas responsive

Mobile:

- Header compacto.
- Grillas a 1 columna o masonry controlado.
- Tap targets minimos de 44px.
- Lightbox con controles grandes.

Tablet:

- Grillas de 2 columnas.
- Filtros horizontales scrolleables.

Desktop:

- Grillas de 3 a 4 columnas segun seccion.
- Layout editorial con variacion de tamanos.
- Hero con imagen full-bleed.

## Accesibilidad minima

- Todas las imagenes publicadas deben tener `alt`.
- Botones icon-only deben tener labels.
- Contraste suficiente entre texto y fondo.
- Navegacion por teclado en lightbox.
- Estados focus visibles.
- No depender solo del color para estados.

## Criterio de cierre de fase 1

La fase 1 queda cerrada cuando existen:

- Identidad visual definida.
- Paleta principal y alternativa.
- Tipografia propuesta.
- Sitemap publico y admin.
- Flujos de contenido.
- Componentes clave.
- Estados UI obligatorios.

