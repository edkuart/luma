import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminMedia, getAdminProjectById } from "@/lib/data/content";

export const metadata = {
  title: "Editar proyecto",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, media] = await Promise.all([
    getAdminProjectById(id),
    getAdminMedia(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="Proyectos"
        title="Editar proyecto"
        description={project.title}
      />
      <ProjectForm project={project} media={media} />
    </section>
  );
}
