import Link from "next/link";
import { albums, projects, shorts } from "@/lib/demo/content";
import { buildHomeCuration } from "@/lib/content/home-curation";

export default function AdminPage() {
  const curation = buildHomeCuration();

  return (
    <section className="px-5 py-8 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
        Panel privado
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Base visual del administrador. En las siguientes fases conectaremos
        autenticacion, proyectos, albumes, Media Library y settings.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-muted">Proyectos</p>
          <p className="mt-4 text-3xl font-semibold">{projects.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-muted">Albumes</p>
          <p className="mt-4 text-3xl font-semibold">{albums.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-muted">Cortos</p>
          <p className="mt-4 text-3xl font-semibold">{shorts.length}</p>
        </div>
      </div>
      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">
          Home actual
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          {curation.modeLabel}: {curation.heroProject.title}
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          La fase 3 ya separa la configuracion del home de la UI. En backend,
          estos valores vendran de settings editables por la artista.
        </p>
        <Link
          href="/admin/settings"
          className="mt-6 inline-flex rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-background"
        >
          Ver settings demo
        </Link>
      </div>
    </section>
  );
}
