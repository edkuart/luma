# Luma - investigacion inicial

Fecha: 2026-06-18

## Objetivo

Crear una plataforma web para una persona creativa que necesita mostrar trabajos artisticos, fotografia, albumes, proyectos visuales y cortometrajes. El proyecto debe incluir sitio publico y panel privado de administracion, con carga de imagenes hacia nube y persistencia de metadatos en backend.

Nombre operativo de carpeta: `luma`.

Motivo: corto, general, facil de recordar, conectado con luz, imagen, fotografia y cine, sin encerrar todavia el proyecto en una marca final.

## Investigacion de referencias

### Portafolios artisticos y visuales

Patrones vistos en portafolios creativos actuales:

- La pagina inicial debe mostrar obra visual desde el primer viewport, no una landing corporativa generica.
- Los mejores portafolios combinan personalidad visual con navegacion simple: thumbnails potentes, proyectos claros, casos o albumes detallados y una pagina breve de biografia/contacto.
- Para trabajos mixtos, como fotografia, cortometraje, direccion de arte e imagen experimental, conviene una estructura por colecciones y proyectos, no solo una galeria infinita.
- Los proyectos destacados deben poder tener narrativa: titulo, ano, disciplina, descripcion breve, imagen hero, galeria, video embebido y creditos.
- La grilla puede ser editorial, tipo zine o masonry, pero debe conservar filtros y rutas limpias para no perder navegacion.

Referencias:

- Creative Bloq, "15 brilliant design portfolio examples, and why they work" (2026): destaca portafolios con collage, grillas tipo zine, thumbnails ricos, animacion moderada y personalidad visual sin sacrificar claridad.
- LensCulture: referente de fotografia contemporanea con enfasis en series, editorializacion y exploracion por colecciones.

### Experiencia para imagenes y albumes

Recomendaciones tecnicas y UX:

- Guardar siempre dimensiones, `alt`, orientacion, ratio, peso, tipo MIME, color dominante y orden de cada imagen.
- No sobrescribir archivos existentes; usar rutas unicas/versionadas para evitar cache viejo en CDN.
- Eager-load para imagenes visibles al inicio y lazy-load para imagenes fuera del primer viewport.
- Reservar espacio con dimensiones o aspect-ratio para evitar saltos visuales.
- Usar miniaturas optimizadas para grillas y abrir una version mayor en vista detalle/lightbox.
- Mantener albumes como entidades editables: titulo, slug, descripcion, portada, visibilidad, orden y lista de imagenes.

Referencias:

- web.dev Learn Images: cubre formatos raster, WebP, AVIF, responsive images, compresion automatizada e image CDNs.
- web.dev lazy loading: recomienda dimensiones explicitas, lazy solo fuera del primer viewport y carga normal para imagenes criticas/LCP.
- Next.js Image docs: soporta optimizacion, formatos WebP/AVIF, remotePatterns, quality allowlist y configuracion para imagenes remotas.

## Backend y nube

### Recomendacion principal

Stack recomendado para primera version:

- Frontend/backend: Next.js App Router + TypeScript.
- Base de datos: Supabase Postgres.
- Autenticacion admin: Supabase Auth.
- Storage: Supabase Storage para originales y versiones publicas.
- Optimizacion visual: Next Image para entrega inicial; evaluar Cloudinary si el cliente necesita transformaciones avanzadas, DAM, video pesado o automatizacion de media.
- Upload UI: FilePond o Uppy para drag-and-drop, preview, validacion de tipo/peso y progreso.

Razon:

Supabase permite resolver auth, base de datos, storage y reglas RLS en una sola plataforma. Para un portafolio administrable pequeno/mediano, reduce infraestructura y mantiene backend real. Cloudinary es muy fuerte para transformaciones y media management, pero puede ser sobrecosto inicial si solo necesitamos subir y servir albumes.

### Alternativa avanzada

Si el cliente tendra mucho video, cortos pesados o necesita streaming/adaptive bitrate:

- Mantener Next.js + Supabase para app, auth y metadatos.
- Usar Mux o Cloudinary Video para videos.
- Guardar en base de datos solo `provider`, `assetId`, `playbackUrl`, `posterUrl`, `duration` y `status`.

### Reglas de backend necesarias

Entidades minimas:

- `profiles`: usuario admin y datos de autor.
- `projects`: proyectos artisticos generales.
- `albums`: colecciones fotograficas.
- `media_assets`: imagenes/videos con metadata tecnica.
- `project_media`: relacion ordenada entre proyectos y media.
- `tags`: categorias como fotografia, corto, direccion, editorial, experimental.
- `settings`: contenido global del sitio.

Permisos:

- Publico puede leer solo contenido publicado.
- Admin autenticado puede crear/editar/borrar proyectos, albumes y media.
- Storage debe usar RLS: buckets privados para uploads originales y bucket publico/controlado para assets publicados.
- No exponer secretos de Cloudinary/Supabase service role en cliente.

Referencias:

- Supabase Storage: subida estandar con SDK, recomendacion de TUS para archivos mayores a 6MB y evitar sobrescritura por cache CDN.
- Supabase Storage Access Control: Storage se integra con RLS y no permite uploads sin politicas.
- Cloudinary Upload API: API de upload con SDKs backend, metadata y gestion avanzada; advierte no exponer API secret en cliente.
- tus.io: protocolo abierto para uploads resumibles por HTTP.

## Paleta visual

El cliente pidio algo saturado, artistico y menos corporativo. La recomendacion no es usar todos los colores fuertes a la vez, sino una base oscura o neutra con acentos saturados para que la obra siga siendo protagonista.

### Paleta recomendada: Galeria Nocturna

- Fondo principal: `#0B0A12` negro tinta
- Superficie: `#171426` violeta carbon
- Texto: `#F6F1E8` marfil calido
- Acento 1: `#FF4D8D` rosa/fucsia
- Acento 2: `#00E0C6` cian jade
- Acento 3: `#FFB000` ambar
- Acento 4: `#7CFF4B` verde acido

Uso:

- Fondo oscuro para elevar fotos/video.
- Fucsia y cian para hover, botones, filtros y estados activos.
- Ambar o verde acido solo como microacento.
- Mantener tarjetas sin bordes pesados; usar grillas y separadores finos.

### Paleta alternativa: Tierra Electrica

- Fondo: `#140F0B`
- Superficie: `#241911`
- Texto: `#FFF4E0`
- Terracota: `#E85D35`
- Ocre: `#D9A21B`
- Oliva: `#708D23`
- Plum: `#5A1A55`

Uso:

- Mas calida y artesanal.
- Buena si la obra tiene fotografia documental, retrato, naturaleza o tonos analogicos.

Referencias:

- Tendencias 2026 reportadas por Pinterest/medios de diseno: Cool Blue, Jade, Plum Noir, Wasabi y Persimmon apuntan a colores expresivos y saturados.
- "Earthy vibrancy" aparece como tendencia de tonos tierra con energia: ocres, olivas, azules profundos y plums.

## Arquitectura de la primera version

Rutas publicas:

- `/`: obra destacada, frase corta, proyectos recientes.
- `/proyectos`: grilla filtrable.
- `/proyectos/[slug]`: detalle con hero, galeria, video, creditos.
- `/albumes`: colecciones fotograficas.
- `/albumes/[slug]`: album con masonry/lightbox.
- `/cortos`: listado de cortometrajes.
- `/sobre`: biografia, foto, statement artistico, contacto.

Rutas admin:

- `/admin/login`
- `/admin`
- `/admin/proyectos`
- `/admin/proyectos/nuevo`
- `/admin/proyectos/[id]`
- `/admin/albumes`
- `/admin/media`
- `/admin/settings`

Flujo de upload:

1. Admin entra con Supabase Auth.
2. Selecciona o arrastra imagenes.
3. Cliente valida tipo, peso y dimensiones.
4. Backend genera ruta unica.
5. Archivo sube a Storage.
6. Se guarda metadata en Postgres.
7. Admin asigna imagenes a proyecto/album.
8. Sitio publico lee solo contenido publicado.

## Decisiones iniciales

- Crear un proyecto full-stack, no solo frontend.
- Usar contenido administrable desde el dia uno.
- Priorizar imagenes optimizadas, dimensiones guardadas y rutas unicas.
- Evitar una estetica corporativa; usar una direccion visual editorial, saturada y artistica.
- Mantener nombre `luma` como nombre de carpeta, no como marca final obligatoria.

## Fuentes consultadas

- https://www.creativebloq.com/portfolios/examples-712368
- https://www.lensculture.com/
- https://web.dev/learn/images/
- https://web.dev/articles/browser-level-image-lazy-loading
- https://nextjs.org/docs/app/api-reference/components/image
- https://supabase.com/docs/guides/storage/uploads/standard-uploads
- https://supabase.com/docs/guides/storage/security/access-control
- https://cloudinary.com/documentation/image_upload_api_reference
- https://tus.io/protocols/resumable-upload
- https://uppy.io/docs/
- https://pqina.nl/filepond/docs/
