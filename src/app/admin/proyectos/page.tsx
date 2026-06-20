import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { kindLabels } from "@/lib/content/types";
import { getAdminProjects } from "@/lib/data/content";
import {
  deleteProjectAction,
  toggleProjectFeaturedAction,
  toggleProjectPublishedAction,
} from "./actions";

export const metadata = {
  title: "Proyectos admin",
};

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="Contenido"
        title="Proyectos"
        description="Series fotograficas, piezas audiovisuales y experimentos del archivo."
        action={{ label: "Nuevo proyecto", href: "/admin/proyectos/nuevo" }}
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.18em] text-muted">
              <th className="px-5 py-4 font-medium">Titulo</th>
              <th className="px-5 py-4 font-medium">Tipo</th>
              <th className="px-5 py-4 font-medium">Año</th>
              <th className="px-5 py-4 font-medium">Estado</th>
              <th className="px-5 py-4 font-medium">Destacado</th>
              <th className="px-5 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/proyectos/${project.id}`}
                    className="font-medium text-foreground transition hover:text-cyan"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">/{project.slug}</p>
                </td>
                <td className="px-5 py-4 text-muted">
                  {kindLabels[project.kind]}
                </td>
                <td className="px-5 py-4 text-muted">{project.year}</td>
                <td className="px-5 py-4">
                  {project.status === "published" ? (
                    <StatusBadge variant="published">Publicado</StatusBadge>
                  ) : project.status === "draft" ? (
                    <StatusBadge variant="draft">Borrador</StatusBadge>
                  ) : (
                    <StatusBadge variant="archived">Archivado</StatusBadge>
                  )}
                </td>
                <td className="px-5 py-4">
                  <form action={toggleProjectFeaturedAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <input
                      type="hidden"
                      name="featured"
                      value={String(project.isFeatured)}
                    />
                    <button
                      type="submit"
                      className="text-xs font-medium text-muted transition hover:text-fuchsia"
                    >
                      {project.isFeatured ? "★ Destacado" : "☆ Destacar"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <Link
                      href={`/admin/proyectos/${project.id}`}
                      className="text-cyan transition hover:brightness-110"
                    >
                      Editar
                    </Link>
                    <form action={toggleProjectPublishedAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={project.status}
                      />
                      <button
                        type="submit"
                        className="text-amber transition hover:brightness-110"
                      >
                        {project.status === "published"
                          ? "Despublicar"
                          : "Publicar"}
                      </button>
                    </form>
                    <form action={deleteProjectAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <button
                        type="submit"
                        className="text-muted transition hover:text-fuchsia"
                      >
                        Borrar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  Aun no hay proyectos. Crea el primero.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-muted">
        {projects.length} proyectos en total.
      </p>
    </section>
  );
}
