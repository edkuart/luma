"use client";

import Image from "next/image";
import { useState } from "react";
import {
  GALLERY_ADD_EVENT,
  type GalleryAddDetail,
} from "@/components/admin/gallery-editor";
import type { AdminMediaRow } from "@/lib/data/content";

type MediaLibraryPickerProps = {
  media: AdminMediaRow[];
};

export function MediaLibraryPicker({ media }: MediaLibraryPickerProps) {
  // En movil arranca colapsada (boton "Agregar desde Media"); en xl la columna
  // lateral siempre esta visible.
  const [expanded, setExpanded] = useState(false);

  function setAsCover(item: AdminMediaRow) {
    setInputValue("coverUrl", item.url);
    setInputValue("coverAlt", item.alt || item.caption);
  }

  function addToGallery(item: AdminMediaRow) {
    const detail: GalleryAddDetail = {
      url: item.url,
      alt: item.alt,
      caption: item.caption,
    };
    window.dispatchEvent(new CustomEvent(GALLERY_ADD_EVENT, { detail }));
  }

  if (media.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-5 text-sm text-muted">
        Aun no hay imagenes en Media. Primero sube assets desde la biblioteca.
      </div>
    );
  }

  return (
    <section className="grid h-fit gap-4 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
            Biblioteca media
          </p>
          <p className="mt-2 text-sm text-muted">
            Usa una imagen como portada o agregala a la galeria.
          </p>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-cyan hover:text-cyan xl:hidden"
        >
          {expanded ? "Ocultar" : "Agregar desde Media"}
        </button>
      </div>

      <div
        className={`${expanded ? "grid" : "hidden"} max-h-[560px] gap-3 overflow-auto pr-1 sm:grid-cols-2 xl:grid`}
      >
        {media.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-md border border-border bg-background"
          >
            <div
              className="relative min-h-36 bg-surface-raised"
              style={{ aspectRatio: "4 / 3" }}
            >
              {item.url ? (
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 240px, 50vw"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-2">
                <p className="mb-2 truncate text-xs font-semibold">
                  {item.caption || item.alt || "Sin titulo"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAsCover(item)}
                    className="rounded-md bg-cyan px-2 py-1.5 text-xs font-semibold text-background transition hover:brightness-110"
                  >
                    Portada
                  </button>
                  <button
                    type="button"
                    onClick={() => addToGallery(item)}
                    className="rounded-md border border-white/20 bg-background/70 px-2 py-1.5 text-xs font-semibold text-foreground transition hover:border-fuchsia hover:text-fuchsia"
                  >
                    Galeria
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function setInputValue(id: string, value: string) {
  const input = document.getElementById(id) as HTMLInputElement | null;
  if (!input) {
    return;
  }

  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}
