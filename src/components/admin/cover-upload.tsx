"use client";

import { FileUpload } from "@/components/admin/file-upload";

/**
 * Sube un archivo a Blob y vuelca la URL resultante en un input del formulario
 * (por id). Mismo contrato que usa MediaLibraryPicker. Reutilizable para
 * portada (#coverUrl) y video (#videoUrl).
 */
export function UploadToInput({
  targetId,
  label,
  accept = "image/*",
}: {
  targetId: string;
  label: string;
  accept?: string;
}) {
  return (
    <FileUpload
      label={label}
      accept={accept}
      onUploaded={(file) => {
        const input = document.getElementById(
          targetId,
        ) as HTMLInputElement | null;
        if (input) {
          input.value = file.url;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }}
    />
  );
}

/** Atajo para la portada. */
export function CoverUpload() {
  return (
    <UploadToInput targetId="coverUrl" label="Subir portada" accept="image/*" />
  );
}
