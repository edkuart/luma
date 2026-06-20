# Revision visual: Admin CMS y sitio publico

Fecha: 2026-06-19

## Capturas generadas

Carpeta:

`review-screenshots/`

Archivos:

- `01-public-home-desktop.png`
- `02-public-projects-desktop.png`
- `03-admin-dashboard-desktop.png`
- `04-admin-home-desktop.png`
- `05-admin-media-desktop.png`
- `06-public-home-mobile.png`
- `07-admin-mobile-menu.png`
- `08-admin-home-mobile.png`

## Resultado tecnico

- Playwright quedo instalado como dependencia de desarrollo para QA visual.
- Se agrego `scripts/luma-review.spec.ts`.
- El flujo de login admin funciona con las variables locales.
- La suite visual pasa: desktop publico/admin y mobile publico/admin.
- Importante: usar `http://localhost:3000`, no `127.0.0.1`, para evitar bloqueo de recursos de desarrollo de Next que puede impedir hidratacion.

## Evaluacion visual

### Admin sidebar

Estado: bien encaminado.

Lo que funciona:

- Ya no es una lista plana.
- Los grupos colapsables dan mejor organizacion.
- El estado activo ayuda a ubicarse.
- Mobile ya tiene menu colapsable.

Mejoras recomendadas:

- Convertir el menu mobile en overlay/drawer para que no empuje tanto el dashboard hacia abajo.
- Persistir grupos abiertos/cerrados en `localStorage`.
- Agregar iconos simples a cada grupo.
- Mostrar estado del sitio: publicado, cambios pendientes, ultima actualizacion.

### Dashboard admin

Estado: funcional, pero todavia poco editorial.

Lo que funciona:

- Muestra conteos de proyectos, albumes, cortos y media.
- Muestra la curaduria actual del home.
- CTA hacia Home.

Mejoras recomendadas:

- Agregar acciones rapidas: subir imagen, nuevo proyecto, editar home.
- Agregar bloque de borradores pendientes.
- Agregar bloque "Control visual" con colores actuales y acceso a tema.
- Agregar preview mini del home actual.

### Admin Home

Estado: funcional como formulario, pero todavia no se siente como control creativo.

Lo que funciona:

- Permite editar titulo e intro.
- Permite modo automatico/manual.
- Permite seleccionar hero, album, corto y proyectos destacados.
- Permite activar/ordenar secciones.

Mejoras recomendadas:

- Dividir en dos columnas: editor a la izquierda, preview a la derecha.
- Agregar "Tema del home": paleta, acento principal, fondo, intensidad de overlay.
- Cambiar orden numerico por botones subir/bajar; drag-and-drop despues.
- Mostrar mini preview de cada seccion.
- Agregar estado de guardado y ultima actualizacion.

### Media library

Estado: visualmente atractiva, pero aun tecnica.

Lo que funciona:

- Grid de imagenes se ve bien.
- Las tarjetas comunican caption/dimensiones.
- Hay base para administrar imagenes.

Mejoras recomendadas:

- Reemplazar URL manual por upload local.
- Permitir editar alt/caption al abrir una imagen.
- Mostrar filtros por tipo/estado.
- Evitar borrar media usada por proyectos o albumes.
- Agregar selector visual para usar imagen en portada/galeria.

### Sitio publico

Estado: la direccion visual es buena, pero hay problemas de impacto.

Hallazgos:

- El home desktop se ve muy atmosferico, pero varias zonas quedan demasiado vacias en captura completa.
- El hero no comunica suficiente texto/CTA en el primer impacto.
- La pagina de proyectos muestra tarjetas muy oscuras; la imagen no se aprecia con claridad en la captura.

Mejoras recomendadas:

- Revisar `Reveal`/animaciones para que el contenido sea visible en capturas, SEO visual y estados sin JS.
- Asegurar que las tarjetas publicas siempre muestren imagen o placeholder estetico.
- Reducir bloques vacios o agregar ritmo visual entre secciones.
- Dar al admin control sobre overlay/intensidad para cada seccion.

## Control creativo recomendado

Para que la artista controle el ambiente sin romper el diseño:

### 1. Tema global

Crear seccion `Admin > Apariencia`:

- Fondo principal.
- Superficie/panel.
- Color acento 1.
- Color acento 2.
- Color CTA.
- Intensidad de overlay de imagen.
- Estilo de bordes: suave, editorial, neon.

Guardar en `site_settings.theme` como JSONB.

### 2. Tema por seccion

Cada seccion del home deberia poder definir:

- Fondo: default, color, imagen, gradiente.
- Acento.
- Layout: grid, editorial, full bleed.
- Densidad: compacto, normal, inmersivo.
- Overlay: 0-80.

Esto encaja mejor con `page_sections.config`.

### 3. Upload local

Siguiente paso para media:

- Boton "Subir imagen".
- Preview local antes de subir.
- Guardar en R2.
- Metadata en `media_assets`.
- Selector visual reusable desde proyectos/albumes/home.

### 4. Mini canvas

Inspiracion desde Flowjuyu:

- No copiar todo el canvas de Flowjuyu.
- Crear un "Mini Canvas" para imagenes del artista:
  - recortar
  - ajustar posicion
  - aplicar overlay
  - preview de portada
  - version para hero, card y galeria
- MVP inicial: crop/position/overlay con CSS y guardar `focalPoint`, `crop`, `overlay`.

## Prioridad sugerida

1. Arreglar impacto visual del sitio publico: hero con texto/CTA y tarjetas con imagen clara.
2. Crear `Admin > Apariencia` para tema global.
3. Evolucionar `Admin > Home` a editor + preview.
4. Implementar upload local en Media.
5. Agregar selector visual de media a proyectos/albumes.
6. Mini canvas para portada/hero.

