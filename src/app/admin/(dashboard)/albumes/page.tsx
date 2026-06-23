import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentCard } from "@/components/admin/content-card";
import { ContentStatusBadge } from "@/components/admin/content-status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { FeaturedToggle, RowActions } from "@/components/admin/row-actions";
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
    <section className="px-4 py-7 sm:px-8 sm:py-8">
      <AdminPageHeader
        eyebrow="Contenido"
        title="Albumes"
        description="Colecciones fotograficas organizadas como recorridos visuales."
        action={{ label: "Nuevo album", href: "/admin/albumes/nuevo" }}
      />

      {albums.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Aun no hay albumes"
            description="Crea el primero para que aparezca en el sitio publico."
            action={{ label: "Nuevo album", href: "/admin/albumes/nuevo" }}
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
                      <p className="mt-1 font-mono text-xs text-muted">
                        /{album.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-muted">{album.year}</td>
                    <td className="px-5 py-4">
                      <ContentStatusBadge status={album.status} />
                    </td>
                    <td className="px-5 py-4">
                      <FeaturedToggle
                        id={album.id}
                        isFeatured={album.isFeatured}
                        action={toggleAlbumFeaturedAction}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <RowActions
                        editHref={`/admin/albumes/${album.id}`}
                        id={album.id}
                        status={album.status}
                        publishedAction={toggleAlbumPublishedAction}
                        deleteAction={deleteAlbumAction}
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
              {albums.length} album{albums.length === 1 ? "" : "es"}
            </p>
            {albums.map((album) => (
              <ContentCard
                key={album.id}
                id={album.id}
                title={album.title}
                slug={album.slug}
                editHref={`/admin/albumes/${album.id}`}
                status={album.status}
                isFeatured={album.isFeatured}
                meta={[String(album.year)]}
                featuredAction={toggleAlbumFeaturedAction}
                publishedAction={toggleAlbumPublishedAction}
                deleteAction={deleteAlbumAction}
              />
            ))}
          </div>

          <p className="mt-4 hidden text-sm text-muted lg:block">
            {albums.length} albumes en total.
          </p>
        </>
      )}
    </section>
  );
}
