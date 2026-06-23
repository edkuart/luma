import type { CSSProperties } from "react";
import type { ImageProtection, SiteTheme } from "@/types/site-settings";

export const defaultImageProtection: ImageProtection = {
  disableRightClick: true,
  watermarkEnabled: false,
  watermarkText: "",
};

export function mergeImageProtection(
  value?: Partial<ImageProtection> | null,
): ImageProtection {
  return { ...defaultImageProtection, ...(value ?? {}) };
}

export const defaultTheme: SiteTheme = {
  background: "#0b0a12",
  foreground: "#f6f1e8",
  surface: "#171426",
  surfaceRaised: "#221b36",
  border: "#342c49",
  muted: "#afa7bd",
  fuchsia: "#ff4d8d",
  cyan: "#00e0c6",
  amber: "#ffb000",
  acid: "#7cff4b",
  heroOverlay: 58,
};

export function mergeTheme(theme?: Partial<SiteTheme>): SiteTheme {
  return {
    ...defaultTheme,
    ...theme,
    heroOverlay:
      typeof theme?.heroOverlay === "number"
        ? Math.max(0, Math.min(90, theme.heroOverlay))
        : defaultTheme.heroOverlay,
  };
}

export function themeToCssVariables(theme: SiteTheme): CSSProperties {
  return {
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--surface": theme.surface,
    "--surface-raised": theme.surfaceRaised,
    "--border": theme.border,
    "--muted": theme.muted,
    "--fuchsia": theme.fuchsia,
    "--cyan": theme.cyan,
    "--amber": theme.amber,
    "--acid": theme.acid,
    "--hero-overlay": `${theme.heroOverlay}%`,
  } as CSSProperties;
}
