# Luma Studio

Portafolio artistico administrable para fotografia, albumes visuales, proyectos y cortometrajes.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres y Storage en fases posteriores

## Fase actual

Fase 3 de implementacion:

- Scaffold Next.js listo.
- Tokens visuales base.
- Home publica con datos demo.
- Layout publico.
- Layout admin inicial.
- Datos demo tipados.
- Configuracion inicial de imagenes remotas.
- Rutas publicas completas con datos demo.
- Paginas de proyectos, albumes, cortos, sobre y contacto.
- Detalles estaticos por slug para proyectos y albumes.
- Galerias demo tipo masonry.
- Sistema flexible de curaduria del home.
- Settings demo editables para textos, modo automatico/manual y secciones.
- Resolver `buildHomeCuration()` para separar UI de decision de contenido.
- Vista admin demo en `/admin/settings`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Siguiente fase

Fase 4: backend con Supabase:

- Configurar Supabase Auth, Postgres y Storage.
- Crear clientes server/browser.
- Preparar schema SQL y politicas RLS.
- Cambiar data demo por capa preparada para datos reales.
