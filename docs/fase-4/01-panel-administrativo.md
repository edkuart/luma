# Luma Studio - Fase 4: Panel administrativo

Fecha: 2026-06-18

## Objetivo de fase 4

Definir el panel privado que permitira al administrador gestionar proyectos, albumes, imagenes, cortometrajes y configuracion global del sitio. El admin debe ser funcional, seguro y claro; no necesita tener la misma expresividad visual que el sitio publico.

## Principio central

El administrador debe poder publicar obra visual sin depender de un desarrollador. El panel debe reducir errores: validar datos, mostrar estados claros, permitir borradores y separar subida de media de publicacion.

## Rutas admin

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

## Layout admin global

### AdminShell

Estructura:

- Sidebar desktop.
- Header superior mobile.
- Area principal.
- Estado de sesion.
- Accion de cerrar sesion.

Navegacion:

- Dashboard
- Proyectos
- Albumes
- Media
- Settings

Estilo:

- Fondo base `#0B0A12`.
- Paneles `#171426`.
- Bordes `#342C49`.
- Texto principal `#F6F1E8`.
- Acento activo `#00E0C6`.

Regla:

- El admin debe ser mas denso y escaneable que el sitio publico.
- Evitar efectos visuales pesados; priorizar edicion rapida.

## Login

Ruta: `/admin/login`

Contenido:

- Logo/nombre `Luma Studio`.
- Email.
- Password.
- Boton `Entrar`.
- Mensaje de error.

Comportamiento:

- Si ya hay sesion valida, redirigir a `/admin`.
- Si falla login, mostrar error claro.
- No revelar si email existe o no.

Estados:

- Idle.
- Loading.
- Error.
- Session expired.

## Dashboard

Ruta: `/admin`

Objetivo:

Dar vista rapida del estado del contenido y accesos a acciones frecuentes.

Bloques:

- Total de proyectos.
- Proyectos publicados.
- Proyectos en borrador.
- Albumes publicados.
- Imagenes en biblioteca.
- Ultimos cambios.
- Acciones rapidas:
  - Nuevo proyecto
  - Nuevo album
  - Subir imagenes

Contenido recomendado:

```text
Dashboard
  Estadisticas principales
  Acciones rapidas
  Contenido reciente
  Pendientes de publicar
```

## Proyectos

Ruta: `/admin/proyectos`

Objetivo:

Listar, buscar, filtrar y administrar proyectos.

Tabla/listado:

- Portada miniatura.
- Titulo.
- Categoria.
- Estado.
- Destacado.
- Ano.
- Ultima actualizacion.
- Acciones.

Filtros:

- Estado: todos, borrador, publicado, archivado.
- Categoria.
- Destacado.

Acciones:

- Nuevo proyecto.
- Editar.
- Vista previa.
- Publicar/despublicar.
- Archivar.

## Nuevo/editar proyecto

Rutas:

```text
/admin/proyectos/nuevo
/admin/proyectos/[id]
```

Secciones del formulario:

1. Informacion basica.
2. Portada.
3. Galeria/media.
4. Video/embed opcional.
5. Metadata y creditos.
6. SEO/social basico futuro.
7. Estado y publicacion.

Campos:

- Titulo.
- Slug.
- Resumen.
- Descripcion.
- Categoria.
- Ano.
- Rol.
- Ubicacion.
- Creditos.
- Tags.
- Portada.
- Media asociada.
- Estado.
- Destacado.

Acciones:

- Guardar borrador.
- Vista previa.
- Publicar.
- Despublicar.
- Archivar.

Regla:

- Publicar requiere datos minimos completos.
- Guardar borrador debe permitir contenido incompleto.

## Albumes

Ruta: `/admin/albumes`

Objetivo:

Gestionar series fotograficas.

Tabla/listado:

- Portada miniatura.
- Titulo.
- Numero de imagenes.
- Estado.
- Destacado.
- Ano.
- Ultima actualizacion.
- Acciones.

Filtros:

- Estado.
- Destacado.
- Ano.

Acciones:

- Nuevo album.
- Editar.
- Vista previa.
- Publicar/despublicar.
- Archivar.

## Nuevo/editar album

Rutas:

```text
/admin/albumes/nuevo
/admin/albumes/[id]
```

Secciones:

1. Informacion basica.
2. Portada.
3. Imagenes del album.
4. Orden manual.
5. Estado y publicacion.

Campos:

- Titulo.
- Slug.
- Resumen.
- Descripcion.
- Ano.
- Tags.
- Portada.
- Imagenes.
- Estado.
- Destacado.

Funciones clave:

- Seleccionar imagenes desde Media Library.
- Subir nuevas imagenes desde el formulario.
- Reordenar imagenes.
- Quitar imagen del album sin borrar asset.
- Definir portada.

## Media Library

Ruta: `/admin/media`

Objetivo:

Gestionar todos los assets subidos.

Vista principal:

- Grid de imagenes.
- Busqueda.
- Filtros.
- Accion de subir.

Filtros:

- Tipo: imagen, video, embed.
- Estado.
- Sin alt.
- No asignadas.
- Fecha.

Detalle de media:

- Preview.
- Titulo.
- Alt.
- Caption.
- Tipo MIME.
- Peso.
- Dimensiones.
- URL/path.
- Estado.
- Asociaciones: proyectos/albumes donde se usa.

Acciones:

- Editar metadata.
- Copiar URL.
- Asignar a proyecto/album.
- Archivar.
- Borrar con confirmacion si no esta en uso.

## Settings

Ruta: `/admin/settings`

Objetivo:

Editar contenido global del sitio.

Campos:

- Nombre del sitio.
- Tagline.
- Bio corta.
- Bio completa.
- Email de contacto.
- Instagram.
- Vimeo.
- YouTube.
- Proyecto hero.
- Album destacado.
- Corto destacado.

Acciones:

- Guardar cambios.
- Vista previa del home.

## Diferencia admin/publico

Admin:

- Puede ver borradores.
- Puede ver contenido incompleto.
- Puede subir/editar media.
- Puede publicar/despublicar.

Publico:

- Solo ve contenido publicado.
- No ve datos internos ni errores tecnicos.
- No puede listar media privada.

## Criterio de cierre de fase 4

La fase 4 queda cerrada cuando existen:

- Rutas admin definidas.
- Pantallas admin definidas.
- Formularios principales definidos.
- Estados de login y contenido definidos.
- Media Library definida.
- Settings definidos.
- Acciones de publicacion claras.

