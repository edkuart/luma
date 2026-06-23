"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getSiteSettings } from "@/lib/data/content";
import { updateSiteSettings } from "@/lib/data/mutations";
import type { HomeSectionConfig } from "@/types/site-settings";

function normalizeSlug(value: FormDataEntryValue | null) {
  const slug = String(value ?? "").trim();
  return slug || undefined;
}

function readHighlightedProjectSlugs(formData: FormData) {
  return formData
    .getAll("highlightedProjectSlugs")
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function readHomeSections(
  formData: FormData,
  currentSections: HomeSectionConfig[],
) {
  return currentSections
    .map((section) => ({
      ...section,
      title: String(formData.get(`title_${section.key}`) ?? section.title)
        .trim(),
      eyebrow: String(formData.get(`eyebrow_${section.key}`) ?? section.eyebrow)
        .trim(),
      visible: formData.get(`visible_${section.key}`) === "on",
      sortOrder: Number(formData.get(`sortOrder_${section.key}`)) || 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveHomeSettingsAction(formData: FormData) {
  await requireAdmin();

  const current = await getSiteSettings();
  const homeSections = readHomeSections(formData, current.homeSections);

  await updateSiteSettings({
    siteName: current.siteName,
    tagline: current.tagline,
    contactEmail: current.contactEmail,
    instagramUrl: current.instagramUrl ?? "",
    vimeoUrl: current.vimeoUrl ?? "",
    youtubeUrl: current.youtubeUrl ?? "",
    homeTitle: String(formData.get("homeTitle") ?? "").trim(),
    homeIntro: String(formData.get("homeIntro") ?? "").trim(),
    homeCurationMode:
      String(formData.get("homeCurationMode") ?? "automatic") === "manual"
        ? "manual"
        : "automatic",
    manualSelection: {
      heroProjectSlug: normalizeSlug(formData.get("heroProjectSlug")),
      featuredAlbumSlug: normalizeSlug(formData.get("featuredAlbumSlug")),
      featuredShortSlug: normalizeSlug(formData.get("featuredShortSlug")),
      highlightedProjectSlugs: readHighlightedProjectSlugs(formData),
    },
    homeSections,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/home");
  revalidatePath("/");
}
