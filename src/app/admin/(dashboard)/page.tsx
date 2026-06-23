import Link from "next/link";
import { adminButton } from "@/components/admin/admin-button";
import { getHomeCuration } from "@/lib/content/home-curation";
import {
  getAdminAlbums,
  getAdminMedia,
  getAdminProjects,
} from "@/lib/data/content";

export default async function AdminPage() {
  const [curation, projects, albums, media] = await Promise.all([
    getHomeCuration(),
    getAdminProjects(),
    getAdminAlbums(),
    getAdminMedia(),
  ]);

  const shortsCount = projects.filter((p) => p.kind === "short_film").length;

  const stats = [
    { label: "Proyectos", value: projects.length, href: "/admin/proyectos" },
    { label: "Albumes", value: albums.length, href: "/admin/albumes" },
    { label: "Cortos", value: shortsCount, href: "/admin/proyectos" },
    { label: "Media", value: media.length, href: "/admin/media" },
  ];

  return (
    <section className="px-5 py-8 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
        Panel privado
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Resumen del contenido. Todo es editable y se refleja en el sitio
        publico.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/proyectos" className={adminButton("cyan")}>
          Ver proyectos
        </Link>
        <Link href="/admin/proyectos/nuevo" className={adminButton("primary")}>
          Nuevo proyecto
        </Link>
        <Link href="/admin/media" className={adminButton("ghost")}>
          Subir media
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-border bg-surface p-5 transition hover:border-cyan/40"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">
          Home actual
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          {curation.modeLabel}
          {curation.heroProject ? `: ${curation.heroProject.title}` : ""}
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          La curaduria del home se controla desde Home (modo automatico o
          seleccion manual de hero, album, corto y secciones visibles).
        </p>
        <Link href="/admin/home" className={`${adminButton("cyan")} mt-6`}>
          Editar home
        </Link>
      </div>
    </section>
  );
}
