"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import type { ProjectKind } from "@/lib/content/types";
import {
  createProject,
  deleteProject,
  type ProjectInput,
  parseGallery,
  parseTags,
  setProjectFeatured,
  setProjectStatus,
  updateProject,
} from "@/lib/data/mutations";

function revalidateProjects() {
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/cortos");
  revalidatePath("/");
}

function readProjectInput(formData: FormData): ProjectInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    kind: (String(formData.get("kind") ?? "photography") as ProjectKind),
    year: Number(formData.get("year")) || new Date().getFullYear(),
    role: String(formData.get("role") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    credits: String(formData.get("credits") ?? "").trim(),
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

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const input = readProjectInput(formData);

  if (!input.title) {
    redirect(
      `/admin/proyectos/${id || "nuevo"}?error=title`,
    );
  }

  if (id) {
    await updateProject(id, input);
  } else {
    await createProject(input);
  }

  revalidateProjects();
  redirect("/admin/proyectos");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await deleteProject(id);
  }
  revalidateProjects();
  redirect("/admin/proyectos");
}

export async function toggleProjectPublishedAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  if (id) {
    await setProjectStatus(id, status === "published" ? "draft" : "published");
  }
  revalidateProjects();
}

export async function toggleProjectFeaturedAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const featured = String(formData.get("featured") ?? "") === "true";
  if (id) {
    await setProjectFeatured(id, !featured);
  }
  revalidateProjects();
}
