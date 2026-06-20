import { loginAction } from "../actions";

export const metadata = {
  title: "Login admin",
};

type AdminLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const error = firstValue(params?.error);
  const nextPath = firstValue(params?.next) ?? "/admin";
  const adminEmail = process.env.ADMIN_EMAIL ?? "demo@lumastudio.app";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-surface lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,77,141,0.28),transparent_28%),linear-gradient(135deg,#171426,#0b0a12)] p-8 lg:flex lg:flex-col lg:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.28em]">
            Luma Studio
          </p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
              Acceso privado
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-balance">
              Login separado del sitio publico y del panel.
            </h1>
            <p className="mt-5 text-sm leading-6 text-muted">
              Desde aqui la artista entra a gestionar proyectos, albumes e
              imagenes sin mezclar el acceso con la experiencia publica.
            </p>
          </div>
        </section>
        <section className="p-6 sm:p-10">
          <div className="mx-auto w-full max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia">
              Admin
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Entrar al panel</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Usa el usuario administrador definido en el archivo local de
              variables.
            </p>

            <form action={loginAction} className="mt-8 grid gap-5">
              <input type="hidden" name="next" value={nextPath} />

              <label className="grid gap-2 text-sm font-medium">
                Correo admin
                <input
                  className="rounded-md border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-cyan"
                  defaultValue={adminEmail}
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Contrasena
                <input
                  className="rounded-md border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-cyan"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>

              {error === "invalid" ? (
                <p className="rounded-md border border-fuchsia/35 bg-fuchsia/10 px-3 py-2 text-sm text-fuchsia">
                  El correo o la contrasena no coinciden con el admin.
                </p>
              ) : null}

              {error === "config" ? (
                <p className="rounded-md border border-fuchsia/35 bg-fuchsia/10 px-3 py-2 text-sm text-fuchsia">
                  Faltan ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_SESSION_SECRET en
                  .env.local.
                </p>
              ) : null}

              <button
                className="rounded-md bg-fuchsia px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                type="submit"
              >
                Entrar
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
