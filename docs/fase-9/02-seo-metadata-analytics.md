# Luma Studio - Fase 9: SEO, metadata y analytics

Fecha: 2026-06-18

## Objetivo

Definir la base SEO sin convertir el sitio en una landing corporativa.

## Metadata global

- Title base: `Luma Studio`.
- Description: portafolio artistico de fotografia, albumes y cortometrajes.
- Open Graph image default.
- Favicon.
- Robots.
- Sitemap.

## Metadata por contenido

Proyecto:

- Title: titulo del proyecto.
- Description: summary.
- OG image: portada.

Album:

- Title: titulo del album.
- Description: summary.
- OG image: portada.

Cortometraje:

- Title.
- Description.
- Poster como OG image.

## Sitemap

Incluir:

- Home.
- Proyectos publicados.
- Albumes publicados.
- Cortos publicados.
- Sobre.
- Contacto.

No incluir:

- Admin.
- Borradores.
- Media directa.

## Analytics

Primera version:

- Vercel Analytics si se desea algo simple.
- Evitar scripts pesados al inicio.

Eventos utiles:

- Ver proyecto.
- Abrir album.
- Abrir lightbox.
- Click contacto.
- Click red social.

## Fuentes

- Next.js generateMetadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js sitemap: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

