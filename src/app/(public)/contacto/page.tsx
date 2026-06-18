import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";

export const metadata = {
  title: "Contacto",
  description: "Contacto para colaboraciones, exhibiciones y proyectos visuales.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contacto"
        title="Colaboraciones, exhibiciones y proyectos visuales."
        description="Primera version de contacto con canales directos. El formulario real puede entrar cuando conectemos backend y proteccion anti-spam."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-8 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-6 lg:col-span-2">
          <p className="text-sm uppercase tracking-[0.28em] text-fuchsia">
            Escribenos
          </p>
          <h2 className="mt-4 text-4xl font-semibold">
            Hablemos de una pieza, una serie o una proyeccion.
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-muted">
            Este bloque sera editable desde settings. Por ahora queda como
            estructura visual para email, redes y futuros formularios.
          </p>
          <Link
            href="mailto:hola@lumastudio.demo"
            className="mt-8 inline-flex rounded-full bg-fuchsia px-6 py-3 text-sm font-semibold text-background"
          >
            hola@lumastudio.demo
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan">Redes</p>
          <div className="mt-6 grid gap-4 text-muted">
            <span>Instagram</span>
            <span>Vimeo</span>
            <span>YouTube</span>
          </div>
        </div>
      </section>
    </main>
  );
}
