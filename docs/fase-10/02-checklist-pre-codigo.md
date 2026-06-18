# Luma Studio - Fase 10: Checklist antes de codigo

Fecha: 2026-06-18

## Objetivo

Confirmar que la documentacion esta lista para comenzar implementacion.

## Decisiones cerradas

- Nombre provisional: Luma Studio.
- Carpeta: `luma`.
- Stack: Next.js + TypeScript + Supabase + Tailwind.
- Storage: Supabase Storage.
- Admin: privado con Supabase Auth.
- Imagenes: metadata completa + Next Image.
- Video: embed externo en primera version.
- Deploy: Vercel + Supabase.

## Orden de implementacion recomendado

1. Scaffold Next.js.
2. Tailwind y tokens visuales.
3. Datos demo.
4. Layout publico.
5. Paginas publicas.
6. Componentes de imagen/galeria/lightbox.
7. Supabase client/server.
8. Schema SQL y RLS.
9. Admin auth.
10. Admin CRUD proyectos/albumes.
11. Media Library/upload.
12. Publicacion y queries reales.
13. Testing/QA.
14. Deploy.

## No iniciar codigo sin

- Confirmar si se usara npm, pnpm o bun.
- Confirmar si crearemos repo git desde el inicio.
- Confirmar si Supabase ya existe o se creara luego.

Recomendacion:

- Usar npm si el entorno local ya lo tiene estable.
- Crear git desde el scaffold inicial.
- Implementar primero con datos demo y conectar Supabase despues de tener UI base.

