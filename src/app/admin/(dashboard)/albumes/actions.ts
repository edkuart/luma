"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import {
  type AlbumInput,
  createAlbum,
  deleteAlbum,
  parseGallery,
  parseTags,
  setAlbumFeatured,
  setAlbumStatus,
  updateAlbum,
} from "@/lib/data/mutations";

function revalidateAlbums() {
  revalidatePath("/admin/albumes");
  revalidatePath("/albumes");
  revalidatePath("/albumes/[slug]", "page");
  revalidatePath("/");
}

function readAlbumInput(formData: FormData): AlbumInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    year: Number(formData.get("year")) || new Date().getFullYear(),
    status: (String(formData.get("status") ?? "draft") as
      | "draft"
      | "published"
      | "archived"),
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: Number(formData.get("sortOrder")) || 0,
    coverUrl: String(formData.get("coverUrl") ?? "").trim(),
    coverAlt: String(formData.get("coverAlt") ?? "").trim(),
    tags: parseTags(String(formData.get("tags") ?? "")),
    gallery: parseGallery(String(formData.get("gallery") ?? "")),
  };
}

export async function saveAlbumAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const input = readAlbumInput(formData);

  if (!input.title) {
    redirect(`/admin/albumes/${id || "nuevo"}?error=title`);
  }

  if (id) {
    await updateAlbum(id, input);
  } else {
    await createAlbum(input);
  }

  revalidateAlbums();
  redirect("/admin/albumes");
}

export async function deleteAlbumAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await deleteAlbum(id);
  }
  revalidateAlbums();
  redirect("/admin/albumes");
}

export async function toggleAlbumPublishedAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  if (id) {
    await setAlbumStatus(id, status === "published" ? "draft" : "published");
  }
  revalidateAlbums();
}

export async function toggleAlbumFeaturedAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const featured = String(formData.get("featured") ?? "") === "true";
  if (id) {
    await setAlbumFeatured(id, !featured);
  }
  revalidateAlbums();
}
