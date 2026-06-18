# Luma Studio - Fase 2: Interacciones y responsive

Fecha: 2026-06-18

## Interacciones publicas

### Header

- Transparente al inicio si hay hero visual.
- Cambia a fondo oscuro con blur al hacer scroll.
- Link activo con acento cian.
- Menu mobile ocupa pantalla completa o panel lateral oscuro.

### Cards de proyecto

Default:

- Imagen visible sin overlay pesado.
- Metadata pequena.

Hover desktop:

- Overlay sutil.
- Titulo sube ligeramente.
- Aparece CTA `Ver proyecto`.
- Borde/acento fucsia o cian segun categoria.

Mobile:

- Sin hover dependiente.
- CTA visible o card completa clickeable con buen feedback tactil.

### Cards de album

Hover:

- Zoom muy leve de imagen.
- Aparece conteo de imagenes.
- CTA `Explorar album`.

### Filtros

Comportamiento:

- Cambio instantaneo.
- Mantener scroll position.
- Estado activo visible con color y forma.
- En mobile, fila horizontal con overflow.

### Lightbox

Entrada:

- Fade corto.
- Fondo `rgba(11, 10, 18, 0.94)`.

Controles:

- Cerrar.
- Anterior.
- Siguiente.
- Contador.
- Texto alt/caption opcional.

Teclado:

- Escape cierra.
- Flecha izquierda/anterior.
- Flecha derecha/siguiente.

Mobile:

- Swipe horizontal si se implementa.
- Botones grandes.

### Video

Reglas:

- No autoplay con audio.
- Poster siempre visible antes de reproducir.
- Si hay video preview, debe ser muted y pausable.
- Embeds externos deben cargarse con cuidado para no afectar performance inicial.

## Responsive

### Breakpoints sugeridos

```text
mobile: 0 - 639px
tablet: 640px - 1023px
desktop: 1024px - 1439px
wide: 1440px+
```

### Mobile

Reglas:

- Header compacto.
- Hero minimo 78vh, no necesariamente 100vh.
- Botones full width si hay dos CTAs apilados.
- Grillas a una columna.
- Filtros con scroll horizontal.
- Espaciado vertical generoso, horizontal contenido.
- Lightbox con controles tactiles grandes.

### Tablet

Reglas:

- Grillas de 2 columnas.
- Hero conserva imagen dominante.
- Proyectos destacados pueden usar 2 columnas.
- Albumes a 2 columnas.

### Desktop

Reglas:

- Hero full-bleed.
- Proyectos destacados con grilla editorial.
- Grillas principales a 3 columnas.
- Cortometrajes en filas amplias.
- Sobre con imagen y texto en dos columnas.

### Wide

Reglas:

- Limitar ancho de texto.
- Permitir imagenes mas grandes, no estirar copy.
- Grillas pueden crecer a 4 columnas solo si las imagenes lo soportan.

## Performance visual

Imagenes:

- Usar dimensiones explicitas.
- Definir aspect-ratio en contenedores.
- Priorizar imagen hero.
- Lazy-load en imagenes fuera del primer viewport.
- Thumbnails para grillas.
- Imagen completa solo en detalle/lightbox.

Video:

- Poster obligatorio.
- Embeds diferidos donde sea posible.
- No cargar multiples reproductores pesados en home.

Animacion:

- Duracion recomendada: 160ms a 260ms.
- Easing suave.
- Respetar `prefers-reduced-motion`.
- Evitar animaciones que bloqueen lectura o navegacion.

## Accesibilidad

Minimo obligatorio:

- `alt` en toda imagen publicada.
- Focus visible en links, botones y filtros.
- Contraste suficiente.
- Navegacion por teclado en lightbox.
- Botones icon-only con `aria-label`.
- No depender solo del color para filtros activos.

## Estados publicos

### Sin proyectos

Mensaje:

`Todavia no hay proyectos publicados.`

Accion:

`Volver al inicio`

### Sin albumes

Mensaje:

`Todavia no hay albumes publicados.`

Accion:

`Ver proyectos`

### Proyecto no encontrado

Mensaje:

`Este proyecto no esta disponible.`

Accion:

`Volver a proyectos`

### Error de carga

Mensaje:

`No pudimos cargar este contenido.`

Accion:

`Intentar de nuevo`

## Criterio de cierre de fase 2

La fase 2 queda cerrada cuando existen:

- Especificacion de todas las pantallas publicas.
- Wireframes estructurales.
- Reglas responsive.
- Reglas de interaccion.
- Estados publicos definidos.
- Criterios de performance visual para imagenes/video.

