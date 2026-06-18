# Luma Studio - Fase 6: Design system y tokens

Fecha: 2026-06-18

## Objetivo

Convertir la direccion visual de Luma Studio en tokens de diseno reutilizables para Tailwind/CSS.

## Paleta oficial

```css
:root {
  --color-ink: #0b0a12;
  --color-surface: #171426;
  --color-surface-raised: #221b36;
  --color-border: #342c49;
  --color-text: #f6f1e8;
  --color-muted: #afa7bd;
  --color-fuchsia: #ff4d8d;
  --color-cyan: #00e0c6;
  --color-amber: #ffb000;
  --color-acid: #7cff4b;
}
```

## Uso de colores

- Fondo general: `ink`.
- Paneles admin: `surface`.
- Hover/admin active: `surface-raised`.
- Texto principal: `text`.
- Metadata: `muted`.
- CTA principal publico: `fuchsia`.
- Estados activos/filtros: `cyan`.
- Highlights: `amber`.
- Microacento experimental: `acid`.

## Tipografia

Recomendacion:

- `Geist Sans` o `Inter` para UI.
- `Space Grotesk` o `Sora` para titulos.

Reglas:

- Titulos grandes y compactos.
- Texto publico max-width controlado.
- Admin denso y legible.
- Letter spacing normal, no negativo.

## Escala de espacios

```text
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 72px
4xl: 96px
```

## Radios

Regla general:

- Cards y controles: 8px o menos.
- Modales/lightbox: 12px maximo si necesita suavidad.
- Imagenes de obra: radio pequeno o sin radio segun composicion.

## Sombras

Usar poco.

Preferir:

- Bordes sutiles.
- Overlays.
- Contraste de superficies.

## Motion

Duraciones:

```text
fast: 120ms
base: 180ms
slow: 260ms
```

Easing:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

Reglas:

- Respetar `prefers-reduced-motion`.
- Animar transform/opacity, no layout pesado.
- Admin usa motion minima.

## Component variants

Button:

- primary: fuchsia.
- secondary: surface + border.
- ghost: transparente.
- danger: rojo controlado.

Badge:

- draft: amber.
- published: cyan.
- archived: muted.

Card:

- public media card.
- admin table card.
- stat card.

## Tailwind

Tailwind permite definir variables de tema. En implementacion, mapear tokens a CSS variables y utilidades.

Fuente:

- Tailwind theme variables: https://tailwindcss.com/docs/theme

