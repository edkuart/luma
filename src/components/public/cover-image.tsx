"use client";

import type { ImageProtection } from "@/types/site-settings";
import { ProtectedImage } from "./protected-image";

// Las portadas pasan por el proxy de derivados (oculta el original y capa la
// resolucion) pero SIN marca de agua (wm=0): son la cara del sitio. Mantienen
// los disuasores de copia. Si el contenido no tiene media id (datos demo o
// externos), cae a la URL directa.
const COVER_PROTECTION: ImageProtection = {
  disableRightClick: true,
  watermarkEnabled: false,
  watermarkText: "",
};

export function CoverImage({
  imageId,
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  imageId?: string;
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const finalSrc = imageId ? `/api/media/${imageId}?wm=0` : src;
  if (!finalSrc) {
    return null;
  }

  return (
    <ProtectedImage
      src={finalSrc}
      alt={alt}
      protection={COVER_PROTECTION}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
