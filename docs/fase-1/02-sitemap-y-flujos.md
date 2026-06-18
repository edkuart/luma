# Luma Studio - Fase 1: Sitemap y flujos

Fecha: 2026-06-18

## Sitemap publico

```text
/
/proyectos
/proyectos/[slug]
/albumes
/albumes/[slug]
/cortos
/sobre
/contacto
```

## Sitemap admin

```text
/admin/login
/admin
/admin/proyectos
/admin/proyectos/nuevo
/admin/proyectos/[id]
/admin/albumes
/admin/albumes/nuevo
/admin/albumes/[id]
/admin/media
/admin/settings
```

## Navegacion principal publica

Items visibles:

- Inicio
- Proyectos
- Albumes
- Cortos
- Sobre

Acciones secundarias:

- Contacto
- Instagram/Vimeo/YouTube si el cliente los provee

No mostrar acceso admin en la navegacion publica principal. El login admin puede existir en `/admin/login`.

## Estructura de inicio

Objetivo: presentar inmediatamente la obra visual y guiar a las secciones principales.

Secciones:

1. Hero visual con imagen/video destacado.
2. Texto corto de identidad: una frase artistica, no pitch corporativo.
3. Proyectos destacados.
4. Album reciente o serie fotografica principal.
5. Cortometraje destacado.
6. Bloque breve sobre la persona/artista.
7. CTA final: ver archivo o contactar.

Contenido minimo requerido:

- Imagen hero.
- Titulo corto.
- 3 proyectos destacados.
- 1 album destacado.
- 1 corto destacado opcional.

## Estructura de proyectos

`/proyectos`

Funcion:

- Listar obras/proyectos visuales mixtos.
- Permitir filtro por disciplina.

Filtros iniciales:

- Todo
- Fotografia
- Cortometraje
- Editorial
- Experimental
- Direccion

Card de proyecto:

- Imagen portada.
- Titulo.
- Categoria.
- Ano.
- Estado visual hover: acento saturado + CTA.

## Detalle de proyecto

`/proyectos/[slug]`

Secciones:

1. Hero con imagen principal.
2. Titulo, categoria, ano y descripcion breve.
3. Metadata: rol, ubicacion, creditos, formato.
4. Galeria de imagenes.
5. Video embebido si aplica.
6. Proyectos relacionados.

Regla:

Cada proyecto debe poder funcionar aunque solo tenga imagenes, solo video o mezcla de ambos.

## Estructura de albumes

`/albumes`

Funcion:

- Presentar colecciones fotograficas como series.

Card de album:

- Portada.
- Titulo.
- Numero de imagenes.
- Ano o rango.
- Descripcion corta.

## Detalle de album

`/albumes/[slug]`

Secciones:

1. Portada editorial.
2. Titulo y descripcion.
3. Masonry gallery.
4. Lightbox.
5. Navegacion anterior/siguiente.

Reglas:

- Cargar thumbnails optimizados.
- Abrir imagen grande en lightbox.
- Preservar orden manual definido por admin.
- Soportar imagen horizontal, vertical y cuadrada sin recortes destructivos.

## Cortometrajes

`/cortos`

Funcion:

- Separar proyectos audiovisuales para que no se pierdan dentro de una grilla fotografica.

Card de corto:

- Poster.
- Titulo.
- Duracion.
- Ano.
- Sinopsis breve.
- Link a detalle de proyecto o reproductor embebido.

Recomendacion:

- Para primera version, soportar links/embeds de Vimeo o YouTube.
- Para video pesado propio, planear integracion futura con Mux o Cloudinary Video.

## Sobre y contacto

`/sobre`

Contenido:

- Foto del artista/creador.
- Bio breve.
- Statement artistico.
- Lista de disciplinas.
- Contacto directo.
- Redes sociales.

`/contacto`

Puede ser una seccion simple o ruta dedicada:

- Email.
- Redes.
- Formulario opcional.

## Flujo admin: subir imagenes

```text
Login admin
  -> Media
  -> Subir imagenes
  -> Validacion cliente
  -> Upload a Storage
  -> Guardar metadata
  -> Asignar a album/proyecto
  -> Ordenar
  -> Publicar
```

Validaciones:

- Tipo permitido: jpg, jpeg, png, webp, avif.
- Peso maximo configurable.
- Dimensiones minimas recomendadas.
- Alt text requerido antes de publicar.

## Flujo admin: crear proyecto

```text
Login admin
  -> Proyectos
  -> Nuevo proyecto
  -> Datos base
  -> Agregar portada
  -> Agregar galeria o video
  -> Guardar borrador
  -> Vista previa
  -> Publicar
```

Campos:

- Titulo
- Slug
- Descripcion corta
- Descripcion completa opcional
- Categoria
- Ano
- Rol/creditos
- Imagen portada
- Media asociada
- Estado: borrador/publicado
- Destacado: si/no

## Flujo admin: crear album

```text
Login admin
  -> Albumes
  -> Nuevo album
  -> Datos base
  -> Subir/asignar imagenes
  -> Ordenar imagenes
  -> Guardar borrador
  -> Publicar
```

Campos:

- Titulo
- Slug
- Descripcion
- Ano o fecha
- Portada
- Imagenes
- Estado
- Destacado

