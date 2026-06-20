"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getSiteSettings } from "@/lib/data/content";
import { updateSiteSettings } from "@/lib/data/mutations";

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  const current = await getSiteSettings();

  const highlighted = String(formData.get("highlightedProjectSlugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const homeSections = current.homeSections.map((section) => ({
    ...section,
    visible: formData.get(`visible_${section.key}`) === "on",
  }));

  await updateSiteSettings({
    siteName: String(formData.get("siteName") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    homeTitle: String(formData.get("homeTitle") ?? "").trim(),
    homeIntro: String(formData.get("homeIntro") ?? "").trim(),
    homeCurationMode:
      String(formData.get("homeCurationMode") ?? "automatic") === "manual"
        ? "manual"
        : "automatic",
    contactEmail: String(formData.get("contactEmail") ?? "").trim(),
    instagramUrl: String(formData.get("instagramUrl") ?? "").trim(),
    vimeoUrl: String(formData.get("vimeoUrl") ?? "").trim(),
    youtubeUrl: String(formData.get("youtubeUrl") ?? "").trim(),
    manualSelection: {
      heroProjectSlug:
        String(formData.get("heroProjectSlug") ?? "").trim() || undefined,
      featuredAlbumSlug:
        String(formData.get("featuredAlbumSlug") ?? "").trim() || undefined,
      featuredShortSlug:
        String(formData.get("featuredShortSlug") ?? "").trim() || undefined,
      highlightedProjectSlugs: highlighted,
    },
    homeSections,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
