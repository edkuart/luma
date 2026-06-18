# Luma Studio - Fase 4: Estados y validaciones admin

Fecha: 2026-06-18

## Objetivo

Definir estados visuales, validaciones y reglas de error para que el panel administrativo sea robusto y usable.

## Estados de autenticacion

### No autenticado

Comportamiento:

- Redirigir de `/admin/*` a `/admin/login`.
- Mantener redirect destino si aplica.

### Autenticado sin rol admin

Comportamiento:

- Bloquear acceso.
- Mostrar mensaje: `No tienes permisos para acceder a este panel.`
- Opcion de cerrar sesion.

### Sesion expirada

Comportamiento:

- Mostrar mensaje en admin.
- Redirigir a login.
- Preservar ruta intentada.

## Estados de datos

### Loading inicial

Uso:

- Carga de tablas.
- Carga de formulario existente.
- Carga de Media Library.

UI:

- Skeletons.
- Evitar spinner unico de pantalla completa salvo login.

### Empty state

Proyectos:

`Todavia no hay proyectos. Crea el primero para comenzar el archivo visual.`

Albumes:

`Todavia no hay albumes. Crea una serie fotografica para organizar imagenes.`

Media:

`No hay imagenes en la biblioteca. Sube archivos para usarlos en proyectos y albumes.`

### Error state

Debe incluir:

- Mensaje entendible.
- Boton de reintentar.
- Accion secundaria para volver.
- Detalle tecnico solo en desarrollo.

## Estados de contenido

### Draft

Uso:

- Contenido incompleto o no visible publicamente.

UI:

- Badge `Borrador`.
- Acciones: editar, publicar si cumple requisitos, archivar.

### Published

Uso:

- Visible publicamente.

UI:

- Badge `Publicado`.
- Acciones: editar, ver publico, despublicar, archivar.

### Archived

Uso:

- Oculto del publico y fuera del flujo normal.

UI:

- Badge `Archivado`.
- Acciones: restaurar a borrador, borrar futuro si se habilita.

## Validaciones de proyecto

Guardar borrador:

- `title`: requerido.
- `slug`: requerido y con formato valido.
- `kind`: requerido.

Publicar:

- `title`: requerido.
- `slug`: requerido, unico y estable.
- `summary`: requerido.
- `kind`: requerido.
- `cover_media_id`: requerido.
- Si `kind = short_film`, requiere video/embed o media asociada.
- Imagenes asociadas deben tener `alt`.

Formato de slug:

```text
solo minusculas, numeros y guiones
ejemplo: retratos-nocturnos-2026
```

## Validaciones de album

Guardar borrador:

- `title`: requerido.
- `slug`: requerido.

Publicar:

- `title`: requerido.
- `slug`: unico.
- `summary` o `description`: requerido.
- `cover_media_id`: requerido.
- Minimo una imagen en `album_media`.
- Imagenes publicadas deben tener `alt`.

## Validaciones de media

Upload:

- Tipo MIME permitido.
- Peso dentro del limite.
- Dimensiones detectables.
- Usuario admin.
- Path unico.

Editar metadata:

- `alt` requerido antes de publicar o asociar a contenido publicado.
- `caption` opcional.
- `title` opcional pero recomendado.

Errores de media:

- `Archivo no permitido. Usa JPG, PNG, WebP o AVIF.`
- `El archivo supera el limite permitido.`
- `No se pudo leer la imagen.`
- `La sesion expiro. Vuelve a iniciar sesion.`
- `La imagen se subio, pero no se pudo guardar la metadata.`

## Validaciones de settings

Campos:

- `site_name`: requerido.
- `contact_email`: formato email si existe.
- URLs sociales: URL valida.
- Featured project/album/short: debe existir.

Reglas:

- Si un item destacado no esta publicado, puede guardarse en admin, pero no debe mostrarse en publico.

## Confirmaciones destructivas

Acciones con confirmacion:

- Despublicar contenido.
- Archivar contenido publicado.
- Quitar muchas imagenes de un album.
- Borrar asset de Media Library.
- Cerrar sesion si hay formulario con cambios sin guardar.

Copy recomendado:

`Esta accion ocultara el contenido del sitio publico. Puedes volver a publicarlo despues.`

## Cambios sin guardar

Comportamiento:

- Si el usuario intenta salir de un formulario con cambios, mostrar confirmacion.
- Mostrar estado `Cambios sin guardar`.
- Deshabilitar publicar mientras se guarda.

## Toasts y feedback

Exito:

- `Proyecto guardado.`
- `Album publicado.`
- `Imagenes subidas.`
- `Settings actualizados.`

Error:

- `No se pudo guardar. Intenta de nuevo.`
- `No se pudo publicar porque faltan datos.`
- `Algunas imagenes no se subieron.`

Regla:

- Toasts deben ser breves.
- Errores de validacion deben aparecer junto al campo afectado.

## Accesibilidad admin

- Formularios con labels reales.
- Mensajes de error asociados a campos.
- Focus visible.
- Navegacion por teclado.
- Tablas con encabezados claros.
- Botones destructivos diferenciados por texto y estilo.

## Criterio de cierre

La fase queda cerrada cuando:

- Estados de auth definidos.
- Estados de datos definidos.
- Estados de contenido definidos.
- Validaciones de proyecto/album/media/settings definidas.
- Confirmaciones destructivas definidas.
- Feedback admin definido.

