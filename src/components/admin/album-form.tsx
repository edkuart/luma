import Link from "next/link";
import { saveAlbumAction } from "@/app/admin/(dashboard)/albumes/actions";
import { adminButton } from "@/components/admin/admin-button";
import { CoverUpload } from "@/components/admin/cover-upload";
import { fieldClass, labelClass } from "@/components/admin/form-fields";
import { GalleryEditor } from "@/components/admin/gallery-editor";
import type { getAdminAlbumById } from "@/lib/data/content";
import { galleryToText } from "@/lib/admin/gallery-text";

type AlbumRow = NonNullable<Awaited<ReturnType<typeof getAdminAlbumById>>>;

export function AlbumForm({ album }: { album?: AlbumRow }) {
  const cover = album?.coverMedia;
  const currentYear = new Date().getFullYear();

  return (
    <form action={saveAlbumAction} className="mt-8 grid max-w-3xl gap-5">
      {album ? <input type="hidden" name="id" value={album.id} /> : null}

      <label className={labelClass}>
        Titulo
        <input
          name="title"
          required
          defaultValue={album?.title ?? ""}
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Slug (opcional, se genera del titulo)
        <input
          name="slug"
          defaultValue={album?.slug ?? ""}
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Resumen
        <textarea
          name="summary"
          rows={2}
          defaultValue={album?.summary ?? ""}
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Descripcion
        <textarea
          name="description"
          rows={4}
          defaultValue={album?.description ?? ""}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          URL de portada
          <input
            id="coverUrl"
            name="coverUrl"
            type="url"
            defaultValue={cover?.publicUrl ?? cover?.externalUrl ?? ""}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          Texto alternativo de portada
          <input
            id="coverAlt"
            name="coverAlt"
            defaultValue={cover?.alt ?? ""}
            className={fieldClass}
          />
        </label>
      </div>
      <CoverUpload />

      <label className={labelClass}>
        Tags (separados por coma)
        <input
          name="tags"
          defaultValue={album?.tags.map((t) => t.tag.name).join(", ") ?? ""}
          className={fieldClass}
        />
      </label>

      <GalleryEditor initialValue={album ? galleryToText(album.media) : ""} />

      <div className="grid gap-5 sm:grid-cols-3">
        <label className={labelClass}>
          Estado
          <select
            name="status"
            defaultValue={album?.status ?? "draft"}
            className={fieldClass}
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </label>
        <label className={labelClass}>
          Año
          <input
            name="year"
            type="number"
            defaultValue={album?.year ?? currentYear}
            className={fieldClass}
          />
        </label>
        <label className="flex items-end gap-2 text-sm font-medium">
          <input
            name="isFeatured"
            type="checkbox"
            defaultChecked={album?.isFeatured ?? false}
            className="size-4 rounded border-border"
          />
          Destacado
        </label>
      </div>

      <label className={labelClass}>
        Orden
        <input
          name="sortOrder"
          type="number"
          defaultValue={album?.sortOrder ?? 0}
          className={`${fieldClass} max-w-[160px]`}
        />
      </label>

      <div className="mt-2 flex items-center gap-3">
        <button type="submit" className={adminButton("primary", { shape: "square" })}>
          {album ? "Guardar cambios" : "Crear album"}
        </button>
        <Link href="/admin/albumes" className={adminButton("ghost", { shape: "square" })}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
