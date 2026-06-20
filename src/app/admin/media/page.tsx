import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaStudio } from "@/components/admin/media-studio";
import { getAdminMedia } from "@/lib/data/content";
import {
  createMediaAction,
  deleteMediaAction,
  updateMediaEditSettingsAction,
} from "./actions";

export const metadata = {
  title: "Media admin",
};

export default async function AdminMediaPage() {
  const media = await getAdminMedia();

  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="Biblioteca"
        title="Media"
        description="Studio para preparar imagenes, exportar versiones editadas y conservar ajustes editoriales del archivo."
      />

      <MediaStudio
        media={media}
        createAction={createMediaAction}
        updateAction={updateMediaEditSettingsAction}
        deleteAction={deleteMediaAction}
      />
    </section>
  );
}
