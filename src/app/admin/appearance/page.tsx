import { ColorField } from "@/components/admin/color-field";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getSiteSettings } from "@/lib/data/content";
import { mergeTheme } from "@/lib/theme";
import { saveAppearanceAction } from "./actions";

export const metadata = {
  title: "Apariencia admin",
};

const colorFields = [
  {
    key: "background",
    label: "Fondo",
    helper: "Base oscura o clara del sitio.",
  },
  {
    key: "foreground",
    label: "Texto principal",
    helper: "Titulos y textos fuertes.",
  },
  {
    key: "surface",
    label: "Paneles",
    helper: "Cards y bloques editoriales.",
  },
  {
    key: "surfaceRaised",
    label: "Panel elevado",
    helper: "Estados activos y cajas destacadas.",
  },
  {
    key: "border",
    label: "Bordes",
    helper: "Lineas y separadores.",
  },
  {
    key: "muted",
    label: "Texto secundario",
    helper: "Descripciones y metadata.",
  },
  {
    key: "fuchsia",
    label: "Acento fucsia",
    helper: "CTA principal y energia visual.",
  },
  {
    key: "cyan",
    label: "Acento cyan",
    helper: "Links, estados y detalles.",
  },
  {
    key: "amber",
    label: "Acento ambar",
    helper: "Etiquetas editoriales.",
  },
  {
    key: "acid",
    label: "Acento acido",
    helper: "Movimiento y piezas audiovisuales.",
  },
] as const;

export default async function AdminAppearancePage() {
  const settings = await getSiteSettings();
  const theme = mergeTheme(settings.theme);

  return (
    <section className="px-5 py-8 sm:px-8">
      <AdminPageHeader
        eyebrow="Control visual"
        title="Apariencia"
        description="Ajusta la atmosfera global del sitio publico sin tocar codigo. Los cambios afectan fondos, textos, paneles y acentos."
      />

      <form
        action={saveAppearanceAction}
        className="mt-8 grid gap-8 xl:grid-cols-[1fr_420px]"
      >
        <div className="grid gap-5 rounded-lg border border-border bg-surface p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
              Paleta global
            </p>
            <p className="mt-2 text-sm text-muted">
              Mantén suficiente contraste entre fondo y texto. La artista puede
              ajustar el mood sin romper la estructura del sitio.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {colorFields.map((field) => (
              <ColorField
                key={field.key}
                name={field.key}
                label={field.label}
                helper={field.helper}
                defaultValue={theme[field.key]}
              />
            ))}
          </div>

          <label className="grid gap-3 rounded-md border border-border/70 bg-background/40 p-4 text-sm">
            <span>
              <span className="block font-semibold">Intensidad del hero</span>
              <span className="mt-1 block text-xs text-muted">
                Controla que tan oscuro queda el overlay encima de imagenes.
              </span>
            </span>
            <input
              name="heroOverlay"
              type="range"
              min="0"
              max="90"
              defaultValue={theme.heroOverlay}
              className="accent-cyan"
            />
            <span className="text-xs text-muted">
              {theme.heroOverlay}% actual
            </span>
          </label>

          <div>
            <button
              type="submit"
              className="rounded-md bg-fuchsia px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Guardar apariencia
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber">
            Preview
          </p>
          <div
            className="mt-4 overflow-hidden rounded-lg border p-5"
            style={{
              background: theme.background,
              color: theme.foreground,
              borderColor: theme.border,
            }}
          >
            <div
              className="rounded-md border p-5"
              style={{
                background: theme.surface,
                borderColor: theme.border,
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: theme.cyan }}
              >
                Archivo visual
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                Luz, imagen y memoria
              </h2>
              <p
                className="mt-3 text-sm leading-6"
                style={{ color: theme.muted }}
              >
                Una muestra rapida de titulos, texto secundario, paneles y CTA.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={{ background: theme.fuchsia, color: theme.foreground }}
                >
                  CTA principal
                </span>
                <span
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={{ background: theme.cyan, color: theme.background }}
                >
                  Link activo
                </span>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}
