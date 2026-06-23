import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentCard } from "@/components/admin/content-card";
import { ContentStatusBadge } from "@/components/admin/content-status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { FeaturedToggle, RowActions } from "@/components/admin/row-actions";
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
    <section className="px-4 py-7 sm:px-8 sm:py-8">
      <AdminPageHeader
        eyebrow="Contenido"
        title="Proyectos"
        description="Series fotograficas, piezas audiovisuales y experimentos del archivo."
        action={{ label: "Nuevo proyecto", href: "/admin/proyectos/nuevo" }}
      />

      {projects.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Aun no hay proyectos"
            description="Crea el primero para que aparezca en el sitio publico."
            action={{ label: "Nuevo proyecto", href: "/admin/proyectos/nuevo" }}
          />
        </div>
      ) : (
        <>
          {/* Desktop: tabla densa */}
          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-border bg-surface lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted">
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
                      <p className="mt-1 font-mono text-xs text-muted">
                        /{project.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {kindLabels[project.kind]}
                    </td>
                    <td className="px-5 py-4 text-muted">{project.year}</td>
                    <td className="px-5 py-4">
                      <ContentStatusBadge status={project.status} />
                    </td>
                    <td className="px-5 py-4">
                      <FeaturedToggle
                        id={project.id}
                        isFeatured={project.isFeatured}
                        action={toggleProjectFeaturedAction}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <RowActions
                        editHref={`/admin/proyectos/${project.id}`}
                        id={project.id}
                        status={project.status}
                        publishedAction={toggleProjectPublishedAction}
                        deleteAction={deleteProjectAction}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Movil: cards apiladas */}
          <div className="mt-6 grid gap-3 lg:hidden">
            <p className="text-xs text-muted">
              {projects.length} proyecto{projects.length === 1 ? "" : "s"}
            </p>
            {projects.map((project) => (
              <ContentCard
                key={project.id}
                id={project.id}
                title={project.title}
                slug={project.slug}
                editHref={`/admin/proyectos/${project.id}`}
                status={project.status}
                isFeatured={project.isFeatured}
                meta={[kindLabels[project.kind], String(project.year)]}
                featuredAction={toggleProjectFeaturedAction}
                publishedAction={toggleProjectPublishedAction}
                deleteAction={deleteProjectAction}
              />
            ))}
          </div>

          <p className="mt-4 hidden text-sm text-muted lg:block">
            {projects.length} proyectos en total.
          </p>
        </>
      )}
    </section>
  );
}
