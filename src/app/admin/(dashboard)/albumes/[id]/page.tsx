import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AlbumForm } from "@/components/admin/album-form";
import { getAdminAlbumById } from "@/lib/data/content";

export const metadata = {
  title: "Editar album",
};

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await getAdminAlbumById(id);

  if (!album) {
    notFound();
  }

  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="Albumes"
        title="Editar album"
        description={album.title}
      />
      <AlbumForm album={album} />
    </section>
  );
}
