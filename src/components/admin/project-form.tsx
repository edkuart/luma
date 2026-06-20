import Link from "next/link";
import { saveProjectAction } from "@/app/admin/proyectos/actions";
import { MediaLibraryPicker } from "@/components/admin/media-library-picker";
import { kindLabels } from "@/lib/content/types";
import type { AdminMediaRow, getAdminProjectById } from "@/lib/data/content";

type ProjectRow = NonNullable<Awaited<ReturnType<typeof getAdminProjectById>>>;

const fieldClass =
  "rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-cyan";
const labelClass = "grid gap-2 text-sm font-medium";

function galleryToText(media: ProjectRow["media"]) {
  return [...media]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) =>
      [
        m.media.publicUrl ?? m.media.externalUrl ?? "",
        m.media.alt ?? "",
        m.media.caption ?? "",
      ]
        .join(" | ")
        .replace(/(\s\|\s)+$/, ""),
    )
    .join("\n");
}

export function ProjectForm({
  project,
  media = [],
}: {
  project?: ProjectRow;
  media?: AdminMediaRow[];
}) {
  const cover = project?.coverMedia;
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,760px)_minmax(320px,420px)]">
      <form action={saveProjectAction} className="grid gap-5">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}

        <label className={labelClass}>
          Titulo
          <input
            name="title"
            required
            defaultValue={project?.title ?? ""}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Slug (opcional, se genera del titulo)
          <input
            name="slug"
            defaultValue={project?.slug ?? ""}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Resumen
          <textarea
            name="summary"
            rows={2}
            defaultValue={project?.summary ?? ""}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Descripcion
          <textarea
            name="description"
            rows={4}
            defaultValue={project?.description ?? ""}
            className={fieldClass}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Tipo
            <select
              name="kind"
              defaultValue={project?.kind ?? "photography"}
              className={fieldClass}
            >
              {Object.entries(kindLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Año
            <input
              name="year"
              type="number"
              defaultValue={project?.year ?? currentYear}
              className={fieldClass}
            />
          </label>

          <label className={labelClass}>
            Rol
            <input
              name="role"
              defaultValue={project?.role ?? ""}
              className={fieldClass}
            />
          </label>

          <label className={labelClass}>
            Ubicacion
            <input
              name="location"
              defaultValue={project?.location ?? ""}
              className={fieldClass}
            />
          </label>
        </div>

        <label className={labelClass}>
          Creditos
          <input
            name="credits"
            defaultValue={project?.credits ?? ""}
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

        <label className={labelClass}>
          Tags (separados por coma)
          <input
            name="tags"
            defaultValue={project?.tags.map((t) => t.tag.name).join(", ") ?? ""}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Galeria (una por linea: url | alt | caption)
          <textarea
            id="gallery"
            name="gallery"
            rows={5}
            defaultValue={project ? galleryToText(project.media) : ""}
            className={`${fieldClass} font-mono text-xs`}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className={labelClass}>
            Estado
            <select
              name="status"
              defaultValue={project?.status ?? "draft"}
              className={fieldClass}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </label>
          <label className={labelClass}>
            Orden
            <input
              name="sortOrder"
              type="number"
              defaultValue={project?.sortOrder ?? 0}
              className={fieldClass}
            />
          </label>
          <label className="flex items-end gap-2 text-sm font-medium">
            <input
              name="isFeatured"
              type="checkbox"
              defaultChecked={project?.isFeatured ?? false}
              className="size-4 rounded border-border"
            />
            Destacado
          </label>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-fuchsia px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {project ? "Guardar cambios" : "Crear proyecto"}
          </button>
          <Link
            href="/admin/proyectos"
            className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-muted transition hover:text-foreground"
          >
            Cancelar
          </Link>
        </div>
      </form>

      <MediaLibraryPicker media={media} />
    </div>
  );
}
