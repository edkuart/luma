# Luma Studio - Fase 8: Contenido demo y pruebas

Fecha: 2026-06-18

## Objetivo

Preparar contenido semilla y pruebas funcionales para validar la experiencia completa antes de cargar obra real del cliente.

## Contenido demo necesario

Proyectos:

- 6 proyectos.
- 2 fotograficos.
- 1 cortometraje.
- 1 editorial.
- 1 experimental.
- 1 mixto.

Albumes:

- 3 albumes.
- Cada album con 8 a 16 imagenes demo.
- Mezclar verticales, horizontales y cuadradas.

Cortos:

- 2 cortometrajes demo.
- Poster.
- Sinopsis.
- Duracion.
- Embed placeholder.

Settings:

- Tagline.
- Bio corta.
- Bio completa.
- Email.
- Redes placeholder.
- Proyecto hero.
- Album destacado.
- Corto destacado.

## Datos demo

Crear archivos seed:

```text
src/lib/demo/projects.ts
src/lib/demo/albums.ts
src/lib/demo/media.ts
src/lib/demo/settings.ts
```

Uso:

- Permitir construir UI antes de conectar Supabase.
- Migrar a queries reales despues.

Regla:

- Dejar claro que son datos demo.
- No mezclar demo con datos productivos.

## Imagenes demo

Opciones:

- Usar placeholders remotos temporalmente.
- Generar assets locales simples.
- Usar imagenes con licencia adecuada.

Regla:

- Para prototipo, deben parecer obra visual real, no tarjetas grises.
- Para produccion, reemplazar por contenido del cliente.

## Pruebas funcionales

Publico:

- Home renderiza.
- Proyectos listan y filtran.
- Detalle por slug funciona.
- Album abre galeria.
- Lightbox abre/cierra.
- Cortos muestran poster.
- Sobre/contacto cargan.

Admin:

- Login.
- Dashboard.
- Crear proyecto draft.
- Publicar proyecto.
- Crear album.
- Subir imagen.
- Asociar media.
- Editar settings.

## Testing recomendado

- TypeScript: `npm run typecheck`.
- Build: `npm run build`.
- E2E: Playwright para flujos criticos.
- Manual QA responsive con screenshots.

Fuente:

- Next.js Playwright guide: https://nextjs.org/docs/app/guides/testing/playwright

