# Luma Studio - Fase 2: Pantallas publicas

Fecha: 2026-06-18

## Objetivo de fase 2

Definir el diseno completo del sitio publico antes de comenzar la implementacion. Esta fase cubre estructura visual, jerarquia de contenido, comportamiento de cada pantalla y reglas de presentacion para proyectos, albumes, cortometrajes y perfil artistico.

## Principio central

La obra debe aparecer primero. La pagina no debe sentirse como una landing comercial; debe sentirse como un archivo visual vivo, editorial y curado.

## Rutas publicas

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

## Layout publico global

### Header

Posicion:

- Fixed en desktop y mobile.
- Transparente sobre hero.
- Fondo `#0B0A12` con blur suave al hacer scroll.

Contenido:

- Marca: `Luma Studio`
- Navegacion: Proyectos, Albumes, Cortos, Sobre
- Accion secundaria: Contacto

Comportamiento:

- El link activo usa acento cian `#00E0C6`.
- En mobile, menu compacto con boton de abrir/cerrar.
- No mostrar enlace admin en publico.

### Footer

Contenido:

- Marca
- Texto corto: `Archivo visual, fotografia y piezas audiovisuales.`
- Links publicos
- Redes
- Email
- Ano actual

Estilo:

- Fondo base.
- Borde superior sutil `#342C49`.
- Acentos pequenos, no competir con la obra.

## Home

Ruta: `/`

Objetivo:

Crear impacto visual inmediato y dirigir hacia proyectos, albumes y cortometrajes.

### Seccion 1: Hero editorial

Contenido:

- Imagen o video destacado full-bleed.
- Eyebrow: `Archivo visual`
- H1: `Luz, imagen y memoria en movimiento.`
- Texto corto: `Fotografia, series visuales y cortometrajes reunidos en un archivo vivo.`
- CTA primario: `Explorar proyectos`
- CTA secundario: `Ver albumes`

Reglas:

- El hero debe ocupar entre 88vh y 100vh.
- La imagen no debe quedar opacada por texto excesivo.
- Overlay oscuro lateral o inferior, no bloque completo.

### Seccion 2: Proyectos destacados

Contenido:

- Titulo: `Proyectos destacados`
- 3 a 5 tarjetas.
- Link a `/proyectos`.

Layout:

- Desktop: grilla editorial con una tarjeta grande y varias medianas.
- Mobile: cards verticales de ancho completo.

### Seccion 3: Serie fotografica / album destacado

Contenido:

- Portada grande del album.
- Titulo.
- Descripcion breve.
- Numero de imagenes.
- CTA: `Explorar album`

Estilo:

- Bloque visual amplio, con texto al borde.
- Acento fucsia en CTA.

### Seccion 4: Cortometraje destacado

Contenido:

- Poster o still.
- Titulo.
- Duracion.
- Ano.
- Sinopsis de 2 lineas.
- CTA: `Ver corto`

Reglas:

- No autoplay con audio.
- Si se usa video preview, debe ser silencioso y opcional.

### Seccion 5: Sobre breve

Contenido:

- Retrato o imagen de proceso.
- Bio corta.
- Link a `/sobre`.

Regla:

- No usar texto largo en home; la pagina debe seguir siendo visual.

## Proyectos

Ruta: `/proyectos`

Objetivo:

Mostrar todo el archivo de proyectos visuales con filtros simples.

### Header de pagina

Contenido:

- Eyebrow: `Archivo`
- H1: `Proyectos`
- Texto: `Series fotograficas, piezas audiovisuales y experimentos visuales.`

### Filtros

Filtros iniciales:

- Todo
- Fotografia
- Cortometraje
- Editorial
- Experimental
- Direccion

Comportamiento:

- Filtro activo con acento cian.
- En mobile, scroll horizontal.
- Cambia la grilla sin recargar pagina.

### Grilla

Card:

- Imagen portada.
- Titulo.
- Categoria.
- Ano.

Layout:

- Desktop: 3 columnas con variaciones controladas de alto.
- Tablet: 2 columnas.
- Mobile: 1 columna.

## Detalle de proyecto

Ruta: `/proyectos/[slug]`

Objetivo:

Presentar una pieza o proyecto con narrativa visual y metadata clara.

### Hero de proyecto

Contenido:

- Imagen principal.
- Categoria.
- Titulo.
- Ano.

Regla:

- La imagen principal debe ser la portada definida por admin.

### Intro

Contenido:

- Descripcion corta.
- Metadata:
  - Rol
  - Formato
  - Ubicacion
  - Creditos
  - Tags

### Galeria

Contenido:

- Imagenes asociadas.
- Orden manual.
- Lightbox.

Reglas:

- No recortar destructivamente en lightbox.
- La grilla puede recortar en thumbnails, pero debe abrir imagen completa.

### Video

Opcional:

- Embed de Vimeo/YouTube o reproductor interno futuro.
- Poster optimizado.

### Relacionados

Contenido:

- 2 a 3 proyectos relacionados por categoria/tag.

## Albumes

Ruta: `/albumes`

Objetivo:

Mostrar colecciones fotograficas como series.

### Header de pagina

- Eyebrow: `Series`
- H1: `Albumes`
- Texto: `Colecciones fotograficas organizadas como recorridos visuales.`

### Grilla

Card de album:

- Portada.
- Titulo.
- Numero de imagenes.
- Ano o rango.
- Descripcion corta.

Layout:

- Desktop: 2 o 3 columnas segun cantidad.
- Mobile: 1 columna.

## Detalle de album

Ruta: `/albumes/[slug]`

Objetivo:

Presentar una serie fotografica completa de forma inmersiva.

### Hero de album

Contenido:

- Portada.
- Titulo.
- Descripcion.
- Metadata: ano, numero de imagenes, tags.

### Galeria masonry

Reglas:

- Respetar orientacion de cada imagen.
- Carga lazy.
- Lightbox con teclado.
- Contador visible.

### Navegacion

- Album anterior.
- Album siguiente.
- Volver a albumes.

## Cortometrajes

Ruta: `/cortos`

Objetivo:

Separar audiovisuales para darles peso propio.

### Header

- Eyebrow: `Movimiento`
- H1: `Cortometrajes`
- Texto: `Piezas audiovisuales, exploraciones narrativas y visuales.`

### Listado

Card:

- Poster/still.
- Titulo.
- Duracion.
- Ano.
- Sinopsis corta.
- CTA.

Layout:

- Desktop: listado editorial ancho, no cards pequenas tipo blog.
- Mobile: cards apiladas.

## Sobre

Ruta: `/sobre`

Objetivo:

Presentar a la persona creadora sin quitar foco a su obra.

Contenido:

- Retrato o imagen de proceso.
- Bio.
- Statement artistico.
- Disciplinas.
- Exhibiciones/publicaciones opcionales.
- Contacto.

Estilo:

- Texto legible, max-width controlado.
- Imagen fuerte, no foto corporativa.

## Contacto

Ruta: `/contacto`

Objetivo:

Canal claro para colaboraciones, encargos o exhibiciones.

Contenido:

- Email.
- Redes.
- Formulario simple opcional:
  - Nombre
  - Email
  - Mensaje

Primera version:

- Puede iniciar con mailto/redes.
- Formulario real puede quedar para fase backend si se desea persistencia o envio SMTP.

