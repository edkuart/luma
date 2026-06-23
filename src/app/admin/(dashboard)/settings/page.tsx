import { fieldClass, labelClass } from "@/components/admin/form-fields";
import { getSiteSettings } from "@/lib/data/content";
import { saveSiteSettingsAction } from "./actions";

export const metadata = {
  title: "Settings admin",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <section className="px-5 py-8 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
        Configuracion del sitio
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Settings</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Textos del home, curaduria, contacto y redes. Los cambios se reflejan en
        el sitio publico.
      </p>

      <form action={saveSiteSettingsAction} className="mt-8 grid max-w-3xl gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Nombre del sitio
            <input
              name="siteName"
              defaultValue={settings.siteName}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Tagline
            <input
              name="tagline"
              defaultValue={settings.tagline}
              className={fieldClass}
            />
          </label>
        </div>

        <label className={labelClass}>
          Titulo del home
          <input
            name="homeTitle"
            defaultValue={settings.homeTitle}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Intro del home
          <textarea
            name="homeIntro"
            rows={3}
            defaultValue={settings.homeIntro}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Modo de curaduria
          <select
            name="homeCurationMode"
            defaultValue={settings.homeCurationMode}
            className={`${fieldClass} max-w-xs`}
          >
            <option value="automatic">Automatica</option>
            <option value="manual">Manual</option>
          </select>
        </label>

        <fieldset className="grid gap-4 rounded-lg border border-border p-5">
          <legend className="px-2 text-sm font-semibold text-muted">
            Seleccion manual (slugs, se usa en modo manual)
          </legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              Hero (slug proyecto)
              <input
                name="heroProjectSlug"
                defaultValue={settings.manualSelection.heroProjectSlug ?? ""}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              Album destacado (slug)
              <input
                name="featuredAlbumSlug"
                defaultValue={settings.manualSelection.featuredAlbumSlug ?? ""}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              Corto destacado (slug)
              <input
                name="featuredShortSlug"
                defaultValue={settings.manualSelection.featuredShortSlug ?? ""}
                className={fieldClass}
              />
            </label>
          </div>
          <label className={labelClass}>
            Proyectos destacados (slugs separados por coma)
            <input
              name="highlightedProjectSlugs"
              defaultValue={(
                settings.manualSelection.highlightedProjectSlugs ?? []
              ).join(", ")}
              className={fieldClass}
            />
          </label>
        </fieldset>

        <fieldset className="grid gap-3 rounded-lg border border-border p-5">
          <legend className="px-2 text-sm font-semibold text-muted">
            Secciones visibles del home
          </legend>
          {settings.homeSections.map((section) => (
            <label
              key={section.key}
              className="flex items-center gap-3 text-sm"
            >
              <input
                name={`visible_${section.key}`}
                type="checkbox"
                defaultChecked={section.visible}
                className="size-4 rounded border-border"
              />
              {section.title}
            </label>
          ))}
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Email de contacto
            <input
              name="contactEmail"
              type="email"
              defaultValue={settings.contactEmail}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Instagram
            <input
              name="instagramUrl"
              defaultValue={settings.instagramUrl ?? ""}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Vimeo
            <input
              name="vimeoUrl"
              defaultValue={settings.vimeoUrl ?? ""}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            YouTube
            <input
              name="youtubeUrl"
              defaultValue={settings.youtubeUrl ?? ""}
              className={fieldClass}
            />
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="rounded-md bg-fuchsia px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Guardar settings
          </button>
        </div>
      </form>
    </section>
  );
}
