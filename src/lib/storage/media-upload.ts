import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

const maxUploadBytes = 10 * 1024 * 1024;

export type UploadedMediaFile = {
  url: string;
  mimeType: string;
  fileSize: number;
};

export async function uploadMediaFile(file: File): Promise<UploadedMediaFile> {
  if (!file.size) {
    throw new Error("El archivo esta vacio.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Solo se permiten imagenes.");
  }

  if (file.size > maxUploadBytes) {
    throw new Error("La imagen supera el limite de 10MB.");
  }

  const filename = `media/${Date.now()}-${safeFilename(file.name)}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return {
      url: blob.url,
      mimeType: file.type,
      fileSize: file.size,
    };
  }

  if (process.env.VERCEL === "1") {
    throw new Error("Falta BLOB_READ_WRITE_TOKEN para subir imagenes.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", "media");
  const publicFilename = `${Date.now()}-${safeFilename(file.name)}`;
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, publicFilename), bytes);

  return {
    url: `/uploads/media/${publicFilename}`,
    mimeType: file.type,
    fileSize: file.size,
  };
}

function safeFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, extension);
  const safeBase = basename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();

  return `${safeBase || "image"}${extension || ".png"}`;
}
