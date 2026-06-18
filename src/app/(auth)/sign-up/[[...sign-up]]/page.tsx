import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Crear cuenta",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-surface lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden bg-[radial-gradient(circle_at_30%_20%,rgba(0,224,198,0.26),transparent_28%),linear-gradient(135deg,#171426,#0b0a12)] p-8 lg:flex lg:flex-col lg:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.28em]">
            Luma Studio
          </p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia">
              Primer acceso
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-balance">
              Crea la cuenta administradora inicial.
            </h1>
            <p className="mt-5 text-sm leading-6 text-muted">
              En produccion limitaremos quien puede administrar contenido.
            </p>
          </div>
        </section>
        <section className="flex justify-center p-6 sm:p-10">
          <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </section>
      </div>
    </main>
  );
}
