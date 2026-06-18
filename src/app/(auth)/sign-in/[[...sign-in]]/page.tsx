import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Ingresar",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-surface lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,77,141,0.28),transparent_28%),linear-gradient(135deg,#171426,#0b0a12)] p-8 lg:flex lg:flex-col lg:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.28em]">
            Luma Studio
          </p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
              Panel privado
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-balance">
              Gestiona proyectos, albumes e imagenes.
            </h1>
            <p className="mt-5 text-sm leading-6 text-muted">
              Acceso solo para la artista y administradores autorizados.
            </p>
          </div>
        </section>
        <section className="flex justify-center p-6 sm:p-10">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </section>
      </div>
    </main>
  );
}
