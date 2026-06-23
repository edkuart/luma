import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { fieldClass, labelClass } from "@/components/admin/form-fields";
import {
  getAdminAlbums,
  getAdminProjects,
  getSiteSettings,
} from "@/lib/data/content";
import { saveHomeSettingsAction } from "./actions";

export const metadata = {
  title: "Home admin",
};

function SelectOption({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return <option value={value}>{label}</option>;
}

export default async function AdminHomePage() {
  const [settings, projects, albums] = await Promise.all([
    getSiteSettings(),
    getAdminProjects(),
    getAdminAlbums(),
  ]);
  const shorts = projects.filter((project) => project.kind === "short_film");
  const highlighted = new Set(
    settings.manualSelection.highlightedProjectSlugs ?? [],
  );

  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="CMS publico"
        title="Home"
        description="Controla el primer impacto del sitio publico: textos, curaduria automatica o manual y secciones visibles."
      />

      <form action={saveHomeSettingsAction} className="mt-8 grid gap-8">
        <div className="grid max-w-4xl gap-5 rounded-lg border border-border bg-surface p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia">
              Hero
            </p>
            <p className="mt-2 text-sm text-muted">
              Estos textos aparecen en la entrada principal del sitio.
            </p>
          </div>

          <label className={labelClass}>
            Titulo del home
            <input
              name="homeTitle"
              defaultValue={settings.homeTitle}
              className={fieldClass}
              required
            />
          </label>

          <label className={labelClass}>
            Intro del home
            <textarea
              name="homeIntro"
              rows={4}
              defaultValue={settings.homeIntro}
              className={fieldClass}
              required
            />
          </label>
        </div>

        <div className="grid max-w-4xl gap-5 rounded-lg border border-border bg-surface p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
              Curaduria
            </p>
            <p className="mt-2 text-sm text-muted">
              En automatico el sitio propone contenido publicado. En manual,
              eliges exactamente que piezas aparecen.
            </p>
          </div>

          <label className={`${labelClass} max-w-sm`}>
            Modo
            <select
              name="homeCurationMode"
              defaultValue={settings.homeCurationMode}
              className={fieldClass}
            >
              <option value="automatic">Automatica</option>
              <option value="manual">Manual</option>
            </select>
          </label>

          <div className="grid gap-5 lg:grid-cols-3">
            <label className={labelClass}>
              Proyecto hero
              <select
                name="heroProjectSlug"
                defaultValue={settings.manualSelection.heroProjectSlug ?? ""}
                className={fieldClass}
              >
                <SelectOption value="" label="Usar propuesta automatica" />
                {projects.map((project) => (
                  <SelectOption
                    key={project.id}
                    value={project.slug}
                    label={project.title}
                  />
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Album destacado
              <select
                name="featuredAlbumSlug"
                defaultValue={settings.manualSelection.featuredAlbumSlug ?? ""}
                className={fieldClass}
              >
                <SelectOption value="" label="Usar propuesta automatica" />
                {albums.map((album) => (
                  <SelectOption
                    key={album.id}
                    value={album.slug}
                    label={album.title}
                  />
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Corto destacado
              <select
                name="featuredShortSlug"
                defaultValue={settings.manualSelection.featuredShortSlug ?? ""}
                className={fieldClass}
              >
                <SelectOption value="" label="Usar propuesta automatica" />
                {shorts.map((short) => (
                  <SelectOption
                    key={short.id}
                    value={short.slug}
                    label={short.title}
                  />
                ))}
              </select>
            </label>
          </div>

          <fieldset className="grid gap-3 rounded-md border border-border p-4">
            <legend className="px-2 text-sm font-semibold text-muted">
              Proyectos destacados manuales
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {projects.map((project) => (
                <label
                  key={project.id}
                  className="flex items-start gap-3 rounded-md border border-border/60 p-3 text-sm"
                >
                  <input
                    name="highlightedProjectSlugs"
                    type="checkbox"
                    value={project.slug}
                    defaultChecked={highlighted.has(project.slug)}
                    className="mt-1 size-4 rounded border-border"
                  />
                  <span>
                    <span className="block font-medium">{project.title}</span>
                    <span className="mt-1 block text-xs text-muted">
                      /{project.slug}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid max-w-4xl gap-5 rounded-lg border border-border bg-surface p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber">
              Secciones
            </p>
            <p className="mt-2 text-sm text-muted">
              Activa, nombra y ordena los bloques visibles del home.
            </p>
          </div>

          <div className="grid gap-4">
            {[...settings.homeSections]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((section) => (
                <div
                  key={section.key}
                  className="grid gap-4 rounded-md border border-border/70 p-4 lg:grid-cols-[90px_1fr_1fr_110px]"
                >
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      name={`visible_${section.key}`}
                      type="checkbox"
                      defaultChecked={section.visible}
                      className="size-4 rounded border-border"
                    />
                    Visible
                  </label>

                  <label className={labelClass}>
                    Titulo
                    <input
                      name={`title_${section.key}`}
                      defaultValue={section.title}
                      className={fieldClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Eyebrow
                    <input
                      name={`eyebrow_${section.key}`}
                      defaultValue={section.eyebrow}
                      className={fieldClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Orden
                    <input
                      name={`sortOrder_${section.key}`}
                      type="number"
                      defaultValue={section.sortOrder}
                      className={fieldClass}
                    />
                  </label>
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-fuchsia px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Guardar home
          </button>
          <Link
            href="/"
            className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-muted transition hover:text-foreground"
          >
            Ver sitio publico
          </Link>
        </div>
      </form>
    </section>
  );
}
