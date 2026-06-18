import { buildHomeCuration } from "@/lib/content/home-curation";
import { demoSiteSettings } from "@/lib/demo/site-settings";

export const metadata = {
  title: "Settings admin",
};

export default function AdminSettingsPage() {
  const curation = buildHomeCuration(demoSiteSettings);

  return (
    <section className="px-5 py-8 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
        Configuracion editable
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Settings del home</h1>
      <p className="mt-3 max-w-3xl text-muted">
        Esta pantalla es una maqueta funcional de datos. En fases posteriores se
        convertira en formulario conectado a Supabase.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Modo de curaduria</p>
          <p className="mt-3 text-3xl font-semibold">{curation.modeLabel}</p>
          <p className="mt-4 text-sm leading-6 text-muted">
            Automatico propone hero, proyectos, album y corto usando destacados
            y recencia. Manual permite fijar slugs concretos.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Texto del home</p>
          <h2 className="mt-3 text-3xl font-semibold">
            {demoSiteSettings.homeTitle}
          </h2>
          <p className="mt-4 leading-7 text-muted">
            {demoSiteSettings.homeIntro}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm font-semibold text-foreground">
            Seleccion resuelta
          </p>
          <dl className="mt-5 grid gap-4 text-sm">
            <div>
              <dt className="text-muted">Hero</dt>
              <dd className="mt-1 text-foreground">
                {curation.heroProject.title}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Album destacado</dt>
              <dd className="mt-1 text-foreground">
                {curation.featuredAlbum.title}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Corto destacado</dt>
              <dd className="mt-1 text-foreground">
                {curation.featuredShort.title}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm font-semibold text-foreground">
            Secciones visibles
          </p>
          <div className="mt-5 grid gap-3">
            {curation.visibleSections.map((section) => (
              <div
                key={section.key}
                className="rounded-md border border-white/10 bg-surface-raised p-4"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-cyan">
                  {section.eyebrow}
                </p>
                <p className="mt-2 font-semibold">{section.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
