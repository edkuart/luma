import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AlbumForm } from "@/components/admin/album-form";

export const metadata = {
  title: "Nuevo album",
};

export default function NewAlbumPage() {
  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="Albumes"
        title="Nuevo album"
        description="Crea un album. Las imagenes se agregan por URL por ahora."
      />
      <AlbumForm />
    </section>
  );
}
