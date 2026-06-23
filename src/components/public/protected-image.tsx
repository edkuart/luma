"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { ImageProtection } from "@/types/site-settings";

type ProtectedImageProps = {
  src: string;
  alt: string;
  protection: ImageProtection;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Clase del contenedor relativo (para fill / aspect). */
  wrapperClassName?: string;
};

/**
 * Imagen con capas de disuasion de copia (configurables por el artista en
 * Apariencia): bloqueo de click derecho/arrastre/seleccion y marca de agua
 * de texto en mosaico. No es infalible (el screenshot siempre existe), pero
 * frena la descarga casual — el patron que usan Pixieset/Zenfolio/SmugMug.
 */
export function ProtectedImage({
  src,
  alt,
  protection,
  width,
  height,
  fill,
  sizes,
  priority,
  className = "",
  style,
  wrapperClassName = "",
}: ProtectedImageProps) {
  const block = protection.disableRightClick;

  // La marca de agua se hornea en el derivado server-side (/api/media/[id]),
  // por eso aqui solo aplicamos los disuasores de copia (click derecho, drag,
  // seleccion).
  // Con `fill`, el wrapper debe rellenar el contenedor posicionado padre.
  const wrapperBase = fill ? "absolute inset-0" : "relative block";

  return (
    <span
      className={`${wrapperBase} ${wrapperClassName}`}
      onContextMenu={block ? (event) => event.preventDefault() : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        draggable={false}
        style={style}
        className={`${block ? "select-none" : ""} ${className}`}
      />
    </span>
  );
}
