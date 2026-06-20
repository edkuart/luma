import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminMedia } from "@/lib/data/content";

export const metadata = {
  title: "Nuevo proyecto",
};

export default async function NewProjectPage() {
  const media = await getAdminMedia();

  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="Proyectos"
        title="Nuevo proyecto"
        description="Crea un proyecto usando URLs o imagenes guardadas en Media."
      />
      <ProjectForm media={media} />
    </section>
  );
}
