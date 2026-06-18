# Luma Studio - Fase 4: Flujos admin

Fecha: 2026-06-18

## Objetivo

Definir los flujos operativos que seguira el administrador para crear, editar, subir, ordenar y publicar contenido.

## Flujo 1: login admin

```text
Admin visita /admin
  -> si no hay sesion, redirige a /admin/login
  -> ingresa email/password
  -> Supabase Auth valida credenciales
  -> backend valida profile.role = admin
  -> redirige a /admin
```

Errores:

- Credenciales invalidas.
- Sesion expirada.
- Usuario autenticado sin rol admin.
- Error de red.

## Flujo 2: crear proyecto

```text
Dashboard
  -> Nuevo proyecto
  -> Completar informacion basica
  -> Guardar borrador
  -> Seleccionar/subir portada
  -> Agregar galeria o video
  -> Completar metadata
  -> Vista previa
  -> Publicar
```

Validaciones para guardar borrador:

- Titulo requerido.
- Slug generado o editable.
- Categoria requerida.

Validaciones para publicar:

- Titulo.
- Slug unico.
- Resumen.
- Categoria.
- Portada.
- Al menos una media asociada o video/embed si es cortometraje.
- Alt completo en imagenes publicadas.

Estados:

- Draft.
- Saving.
- Saved.
- Ready to publish.
- Published.
- Validation error.

## Flujo 3: editar proyecto publicado

```text
Proyectos
  -> seleccionar proyecto publicado
  -> editar contenido
  -> guardar cambios
  -> revalidar rutas publicas
  -> mostrar confirmacion
```

Decision inicial:

- Editar un publicado actualiza directamente el contenido visible.
- En fase futura se podria agregar revision previa o versiones.

Acciones:

- Guardar cambios.
- Despublicar.
- Archivar.
- Vista previa.

## Flujo 4: crear album

```text
Dashboard
  -> Nuevo album
  -> Completar titulo/resumen
  -> Guardar borrador
  -> Subir o seleccionar imagenes
  -> Ordenar imagenes
  -> Elegir portada
  -> Vista previa
  -> Publicar
```

Validaciones para publicar:

- Titulo.
- Slug unico.
- Resumen o descripcion corta.
- Portada.
- Minimo una imagen.
- Todas las imagenes publicadas tienen alt.

## Flujo 5: subir imagenes desde Media Library

```text
Media
  -> Subir imagenes
  -> Drag-and-drop o selector
  -> Validacion local
  -> Upload a Supabase Storage
  -> Guardar metadata en media_assets
  -> Mostrar resultado por archivo
```

Validacion local:

- Tipo MIME permitido.
- Peso dentro del limite.
- Imagen legible.
- Dimensiones disponibles.

Resultado por archivo:

- Exito.
- Error.
- Reintentar.
- Quitar de cola.

## Flujo 6: asociar media a proyecto o album

```text
Editar proyecto/album
  -> Abrir selector de media
  -> Buscar/filtrar imagenes
  -> Seleccionar una o varias
  -> Confirmar seleccion
  -> Guardar relacion
  -> Reordenar si aplica
```

Reglas:

- Una misma imagen puede pertenecer a varios proyectos/albumes.
- Quitar de un proyecto no borra el asset.
- Borrar asset requiere confirmacion y validar si esta en uso.

## Flujo 7: ordenar imagenes de album

```text
Editar album
  -> Lista de imagenes actual
  -> Drag-and-drop
  -> Guardar orden
  -> Actualizar sort_order en album_media
```

Reglas:

- Orden manual manda sobre fecha de subida.
- Cambios no publicados pueden guardarse en borrador si el album no esta publicado.

## Flujo 8: publicar/despublicar

Publicar:

```text
Admin pulsa Publicar
  -> validar campos requeridos
  -> status = published
  -> published_at = now() si no existe
  -> revalidar rutas publicas
  -> mostrar confirmacion
```

Despublicar:

```text
Admin pulsa Despublicar
  -> confirmar accion
  -> status = draft
  -> revalidar rutas publicas
  -> mostrar confirmacion
```

Archivar:

```text
Admin pulsa Archivar
  -> confirmar accion
  -> status = archived
  -> ocultar del publico
  -> mantener registro y media
```

## Flujo 9: editar settings del home

```text
Settings
  -> editar tagline/bio/contacto
  -> seleccionar proyecto hero
  -> seleccionar album destacado
  -> seleccionar corto destacado
  -> guardar
  -> revalidar home
```

Validaciones:

- Email valido si se provee.
- URLs validas si se proveen.
- Contenido destacado debe estar publicado para aparecer en publico.

## Flujo 10: recuperacion ante errores

Casos:

- Upload parcial.
- Sesion expirada durante edicion.
- Error guardando metadata.
- Imagen subida pero registro no guardado.

Comportamiento esperado:

- Mostrar error por accion, no bloquear todo el panel.
- Preservar datos del formulario si es posible.
- Permitir reintentar upload.
- Registrar en consola/server logs en desarrollo.
- Evitar duplicar registros al reintentar.

## Checklist operativo del admin

Antes de publicar un proyecto:

- Titulo claro.
- Slug correcto.
- Portada definida.
- Resumen completo.
- Categoria correcta.
- Imagenes con alt.
- Vista previa revisada.

Antes de publicar un album:

- Portada definida.
- Orden revisado.
- Imagenes con alt.
- Descripcion breve.
- Vista previa revisada.

