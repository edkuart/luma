# Luma Studio - Fase 9: Deploy y produccion

Fecha: 2026-06-18

## Objetivo

Definir como se publicara Luma Studio en produccion con Vercel y Supabase.

## Servicios

- Vercel: hosting Next.js.
- Supabase: Postgres, Auth, Storage.
- Dominio: pendiente del cliente.

## Entornos

```text
development
preview
production
```

Variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
NEXT_PUBLIC_SITE_URL
```

Reglas:

- Variables publicas usan `NEXT_PUBLIC_`.
- Secret key solo server.
- Configurar variables en Vercel por entorno.

## Pasos deploy

1. Crear proyecto Supabase.
2. Ejecutar migraciones SQL.
3. Crear buckets Storage.
4. Configurar RLS.
5. Crear usuario admin.
6. Configurar variables locales.
7. Build local.
8. Subir a GitHub.
9. Conectar Vercel.
10. Configurar variables Vercel.
11. Deploy preview.
12. QA preview.
13. Deploy production.
14. Configurar dominio.

## Validaciones predeploy

- `npm run typecheck`.
- `npm run build`.
- Variables presentes.
- RLS probado.
- Admin creado.
- Imagen remota permitida en Next config.
- Sitemap/metadata listos.

## Rollback

Si falla:

- Revertir deploy en Vercel.
- No tocar DB sin backup.
- Mantener migraciones versionadas.

## Fuentes

- Vercel environment variables: https://vercel.com/docs/environment-variables
- Next.js deploying: https://nextjs.org/docs/app/getting-started/deploying

