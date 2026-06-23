// Helper de clases para los botones/enlaces del admin. Centraliza variantes y
// radios (antes mezclados ad-hoc entre rounded-full y rounded-md por pantalla).

type Variant = "primary" | "cyan" | "ghost";

type Options = {
  /** `pill` (default) = rounded-full; `square` = rounded-md para forms. */
  shape?: "pill" | "square";
  /** Ocupa todo el ancho del contenedor. */
  block?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition";

const variants: Record<Variant, string> = {
  primary: "bg-fuchsia text-white hover:brightness-110",
  cyan: "bg-cyan text-background hover:brightness-110",
  ghost:
    "border border-border text-muted hover:border-cyan hover:text-foreground",
};

export function adminButton(variant: Variant = "primary", options: Options = {}) {
  const { shape = "pill", block = false } = options;
  return [
    base,
    variants[variant],
    shape === "square" ? "rounded-md" : "rounded-full",
    block ? "w-full" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
