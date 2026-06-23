"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import {
  createMedia,
  deleteMedia,
  updateMediaEditSettings,
} from "@/lib/data/mutations";
import { uploadMediaFile } from "@/lib/storage/media-upload";
import {
  normalizeMediaEditSettings,
  type MediaEditSettings,
} from "@/types/media";

function parseEditSettings(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return normalizeMediaEditSettings();
  }

  try {
    return normalizeMediaEditSettings(
      JSON.parse(value) as Partial<MediaEditSettings>,
    );
  } catch {
    return normalizeMediaEditSettings();
  }
}

export async function createMediaAction(formData: FormData) {
  await requireAdmin();

  let url = String(formData.get("url") ?? "").trim();
  const file = formData.get("file");

  let mimeType: string | undefined;
  let fileSize: number | undefined;

  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadMediaFile(file);
    url = uploaded.url;
    mimeType = uploaded.mimeType;
    fileSize = uploaded.fileSize;
  }

  if (!url) {
    return;
  }
  await createMedia({
    url,
    alt: String(formData.get("alt") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    width: Number(formData.get("width")) || undefined,
    height: Number(formData.get("height")) || undefined,
    mimeType,
    fileSize,
    editSettings: parseEditSettings(formData.get("editSettings")),
  });
  revalidatePath("/admin/media");
}

export async function updateMediaEditSettingsAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  await updateMediaEditSettings(
    id,
    parseEditSettings(formData.get("editSettings")),
  );
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await deleteMedia(id);
  }
  revalidatePath("/admin/media");
}
