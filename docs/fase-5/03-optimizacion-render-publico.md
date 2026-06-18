# Luma Studio - Fase 5: Optimizacion y render publico

Fecha: 2026-06-18

## Objetivo

Definir como se entregan las imagenes en el sitio publico para lograr buena calidad visual, carga rapida y estabilidad de layout.

## Regla principal

No renderizar imagenes sin dimensiones. Cada asset debe tener `width` y `height`, y cada componente debe reservar espacio con `aspect-ratio` o dimensiones explicitas.

## Next Image

Uso:

- Home hero.
- Cards de proyecto.
- Cards de album.
- Galerias.
- Posters de cortometraje.
- Imagenes de detalle.

Configuracion requerida:

- `remotePatterns` para Supabase Storage.
- Formatos modernos si el deployment lo soporta.
- Quality allowlist.
- Sizes por componente.

Ejemplo conceptual:

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85, 95],
  },
}
```

Nota:

- Al implementar, ajustar hostname exacto del proyecto Supabase si Next requiere patron mas especifico.

## Componentes de imagen

### HeroImage

Uso:

- Home.
- Detalle de proyecto.
- Detalle de album.

Reglas:

- Usar `priority` solo si esta en primer viewport.
- Usar sizes amplio.
- Overlay controlado.
- No cargar video pesado como hero por defecto.

### ProjectCoverImage

Uso:

- Cards de proyectos.

Reglas:

- Aspect ratio controlado segun layout.
- Crop en card permitido.
- Al abrir detalle, mostrar composicion mas completa.

### AlbumMasonryImage

Uso:

- Galeria de album.

Reglas:

- Usar width/height real para calcular ratio.
- Lazy load por defecto.
- Evitar recorte destructivo en masonry.
- Lightbox muestra imagen completa.

### LightboxImage

Uso:

- Vista ampliada.

Reglas:

- Fit contain.
- Fondo oscuro.
- Mostrar caption/alt opcional.
- Precargar imagen anterior/siguiente solo si no afecta rendimiento.

## `sizes` sugeridos

Hero:

```text
100vw
```

Card desktop:

```text
(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw
```

Album masonry:

```text
(min-width: 1440px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw
```

Detalle ancho:

```text
(min-width: 1024px) 80vw, 100vw
```

## Prioridad de carga

Usar prioridad:

- Hero del home.
- Hero del detalle de proyecto.
- Portada de album si esta arriba del fold.

No usar prioridad:

- Cards fuera del primer viewport.
- Imagenes de masonry.
- Lightbox hasta abrir.

## Lazy loading

Regla:

- Imagenes fuera del primer viewport deben cargar lazy.
- No aplicar lazy a imagen LCP probable.

## Blur placeholder

Primera version:

- Usar fondo con `dominant_color` o skeleton.

Fase futura:

- Guardar `blur_data_url` por asset.
- Generar al subir imagen.

## Calidad y formatos

Recomendacion inicial:

- Cards: quality 75.
- Hero: quality 85.
- Lightbox: quality 90/95 si la obra lo amerita.

Regla:

- Evitar calidad 100 por defecto.
- La obra debe verse bien, pero no a costa de peso excesivo.

## Cortometrajes

Primera version:

- Poster/still optimizado como imagen.
- Embed de Vimeo/YouTube bajo demanda o en detalle.

Reglas:

- No cargar multiples embeds pesados en listados.
- En cards, mostrar poster + boton.
- En detalle, cargar reproductor cuando el usuario interactua si es posible.

## SEO y social

Cada proyecto/album debe poder generar:

- `title`.
- `description`.
- Open Graph image desde portada.
- URL canonica.

Primera version:

- Usar portada como OG image.
- Metadata generada desde proyecto/album.

## Performance checks

Antes de cerrar implementacion:

- La imagen hero no salta layout.
- La grilla no cambia bruscamente al cargar.
- El home no carga todos los embeds de video.
- Galerias grandes no bloquean interaccion.
- Mobile no descarga imagenes innecesariamente enormes.

