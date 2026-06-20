"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { mergeTheme } from "@/lib/theme";
import { updateSiteTheme } from "@/lib/data/mutations";
import type { SiteTheme } from "@/types/site-settings";

const hexPattern = /^#[0-9a-fA-F]{6}$/;

function readHex(formData: FormData, key: keyof SiteTheme, fallback: string) {
  const value = String(formData.get(key) ?? "").trim();
  return hexPattern.test(value) ? value.toLowerCase() : fallback;
}

export async function saveAppearanceAction(formData: FormData) {
  await requireAdmin();

  const fallback = mergeTheme();
  const heroOverlay = Number(formData.get("heroOverlay"));
  const theme: SiteTheme = {
    background: readHex(formData, "background", fallback.background),
    foreground: readHex(formData, "foreground", fallback.foreground),
    surface: readHex(formData, "surface", fallback.surface),
    surfaceRaised: readHex(formData, "surfaceRaised", fallback.surfaceRaised),
    border: readHex(formData, "border", fallback.border),
    muted: readHex(formData, "muted", fallback.muted),
    fuchsia: readHex(formData, "fuchsia", fallback.fuchsia),
    cyan: readHex(formData, "cyan", fallback.cyan),
    amber: readHex(formData, "amber", fallback.amber),
    acid: readHex(formData, "acid", fallback.acid),
    heroOverlay: Number.isFinite(heroOverlay)
      ? Math.max(0, Math.min(90, heroOverlay))
      : fallback.heroOverlay,
  };

  await updateSiteTheme(theme);

  revalidatePath("/");
  revalidatePath("/proyectos");
  revalidatePath("/albumes");
  revalidatePath("/cortos");
  revalidatePath("/sobre");
  revalidatePath("/contacto");
  revalidatePath("/admin/appearance");
}
