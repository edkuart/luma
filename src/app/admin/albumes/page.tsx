import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { getAdminAlbums } from "@/lib/data/content";
import {
  deleteAlbumAction,
  toggleAlbumFeaturedAction,
  toggleAlbumPublishedAction,
} from "./actions";

export const metadata = {
  title: "Albumes admin",
};

export default async function AdminAlbumsPage() {
  const albums = await getAdminAlbums();

  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="Contenido"
        title="Albumes"
        description="Colecciones fotograficas organizadas como recorridos visuales."
        action={{ label: "Nuevo album", href: "/admin/albumes/nuevo" }}
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.18em] text-muted">
              <th className="px-5 py-4 font-medium">Titulo</th>
              <th className="px-5 py-4 font-medium">Año</th>
              <th className="px-5 py-4 font-medium">Estado</th>
              <th className="px-5 py-4 font-medium">Destacado</th>
              <th className="px-5 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => (
              <tr
                key={album.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/albumes/${album.id}`}
                    className="font-medium text-foreground transition hover:text-cyan"
                  >
                    {album.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">/{album.slug}</p>
                </td>
                <td className="px-5 py-4 text-muted">{album.year}</td>
                <td className="px-5 py-4">
                  {album.status === "published" ? (
                    <StatusBadge variant="published">Publicado</StatusBadge>
                  ) : album.status === "draft" ? (
                    <StatusBadge variant="draft">Borrador</StatusBadge>
                  ) : (
                    <StatusBadge variant="archived">Archivado</StatusBadge>
                  )}
                </td>
                <td className="px-5 py-4">
                  <form action={toggleAlbumFeaturedAction}>
                    <input type="hidden" name="id" value={album.id} />
                    <input
                      type="hidden"
                      name="featured"
                      value={String(album.isFeatured)}
                    />
                    <button
                      type="submit"
                      className="text-xs font-medium text-muted transition hover:text-fuchsia"
                    >
                      {album.isFeatured ? "★ Destacado" : "☆ Destacar"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <Link
                      href={`/admin/albumes/${album.id}`}
                      className="text-cyan transition hover:brightness-110"
                    >
                      Editar
                    </Link>
                    <form action={toggleAlbumPublishedAction}>
                      <input type="hidden" name="id" value={album.id} />
                      <input type="hidden" name="status" value={album.status} />
                      <button
                        type="submit"
                        className="text-amber transition hover:brightness-110"
                      >
                        {album.status === "published"
                          ? "Despublicar"
                          : "Publicar"}
                      </button>
                    </form>
                    <form action={deleteAlbumAction}>
                      <input type="hidden" name="id" value={album.id} />
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
            {albums.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                  Aun no hay albumes. Crea el primero.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-muted">{albums.length} albumes en total.</p>
    </section>
  );
}
