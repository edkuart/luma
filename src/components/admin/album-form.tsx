import Link from "next/link";
import { saveAlbumAction } from "@/app/admin/albumes/actions";
import type { getAdminAlbumById } from "@/lib/data/content";

type AlbumRow = NonNullable<Awaited<ReturnType<typeof getAdminAlbumById>>>;

const fieldClass =
  "rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-cyan";
const labelClass = "grid gap-2 text-sm font-medium";

function galleryToText(media: AlbumRow["media"]) {
  return [...media]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) =>
      [
        m.media.publicUrl ?? m.media.externalUrl ?? "",
        m.media.alt ?? "",
        m.media.caption ?? "",
      ].join(" | "),
    )
    .join("\n");
}

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
            name="coverUrl"
            type="url"
            defaultValue={cover?.publicUrl ?? cover?.externalUrl ?? ""}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          Texto alternativo de portada
          <input
            name="coverAlt"
            defaultValue={cover?.alt ?? ""}
            className={fieldClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Tags (separados por coma)
        <input
          name="tags"
          defaultValue={album?.tags.map((t) => t.tag.name).join(", ") ?? ""}
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Galeria (una por linea: url | alt | caption)
        <textarea
          name="gallery"
          rows={6}
          defaultValue={album ? galleryToText(album.media) : ""}
          className={`${fieldClass} font-mono text-xs`}
        />
      </label>

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
        <button
          type="submit"
          className="rounded-md bg-fuchsia px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {album ? "Guardar cambios" : "Crear album"}
        </button>
        <Link
          href="/admin/albumes"
          className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-muted transition hover:text-foreground"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
