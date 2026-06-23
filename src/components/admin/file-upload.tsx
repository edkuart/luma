"use client";

import { upload } from "@vercel/blob/client";
import { useId, useRef, useState } from "react";

export type UploadedFile = {
  url: string;
  contentType: string;
  size: number;
  name: string;
};

type FileUploadProps = {
  label?: string;
  /** Tipos aceptados por el input (default: imagenes). */
  accept?: string;
  onUploaded: (file: UploadedFile) => void;
  className?: string;
};

/**
 * Boton de subida directa cliente -> Vercel Blob. El archivo viaja del navegador
 * a Blob sin pasar por el servidor (soporta archivos pesados / video), tras
 * pedir un token firmado a /api/admin/blob-upload. Devuelve la URL publica.
 */
export function FileUpload({
  label = "Subir archivo",
  accept = "image/*",
  onUploaded,
  className = "",
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setProgress(0);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
        contentType: file.type || undefined,
        onUploadProgress: (event) => setProgress(Math.round(event.percentage)),
      });

      onUploaded({
        url: blob.url,
        contentType: file.type,
        size: file.size,
        name: file.name,
      });
      setProgress(null);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir el archivo.",
      );
      setProgress(null);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  const uploading = progress !== null;

  return (
    <span className={`inline-flex flex-col gap-1 ${className}`}>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
      />
      <label
        htmlFor={inputId}
        aria-busy={uploading}
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold transition ${
          uploading
            ? "cursor-not-allowed text-muted"
            : "text-muted hover:border-cyan hover:text-cyan"
        }`}
      >
        {uploading ? `Subiendo… ${progress}%` : label}
      </label>
      {error ? <span className="text-xs text-fuchsia">{error}</span> : null}
    </span>
  );
}
