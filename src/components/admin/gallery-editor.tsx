"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { FileUpload } from "@/components/admin/file-upload";

export type GalleryAddDetail = {
  url: string;
  alt?: string;
  caption?: string;
};

type GalleryItem = {
  key: string;
  url: string;
  alt: string;
  caption: string;
};

/** Evento global que dispara la biblioteca de media para agregar a la galeria. */
export const GALLERY_ADD_EVENT = "luma:gallery-add";

let keySeq = 0;
function nextKey() {
  keySeq += 1;
  return `g-${keySeq}`;
}

function parseInitial(value: string): GalleryItem[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, alt, caption] = line.split("|").map((p) => p.trim());
      return {
        key: nextKey(),
        url: url ?? "",
        alt: alt ?? "",
        caption: caption ?? "",
      };
    })
    .filter((item) => item.url);
}

function serialize(items: GalleryItem[]) {
  return items
    .map((item) => [item.url, item.alt, item.caption].join(" | "))
    .join("\n");
}

/**
 * Editor visual de galeria. Reemplaza el textarea plano por una lista con
 * miniatura y reorden, pero escribe el MISMO valor `url | alt | caption` (una
 * por linea) en un <input type="hidden" name="gallery">. El modelo de datos y
 * `saveProjectAction` no cambian.
 */
export function GalleryEditor({ initialValue = "" }: { initialValue?: string }) {
  const [items, setItems] = useState<GalleryItem[]>(() =>
    parseInitial(initialValue),
  );
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const liveId = useId();

  const addItem = useCallback((detail: GalleryAddDetail) => {
    if (!detail.url) {
      return;
    }
    setItems((current) => [
      ...current,
      {
        key: nextKey(),
        url: detail.url,
        alt: detail.alt ?? "",
        caption: detail.caption ?? "",
      },
    ]);
  }, []);

  // Permite que MediaLibraryPicker agregue items via evento global.
  useEffect(() => {
    function onAdd(event: Event) {
      const detail = (event as CustomEvent<GalleryAddDetail>).detail;
      if (detail) {
        addItem(detail);
      }
    }
    window.addEventListener(GALLERY_ADD_EVENT, onAdd);
    return () => window.removeEventListener(GALLERY_ADD_EVENT, onAdd);
  }, [addItem]);

  function addByUrl() {
    const url = newUrl.trim();
    if (!url) {
      return;
    }
    addItem({ url });
    setNewUrl("");
    setAnnounce("Imagen agregada a la galeria.");
  }

  function update(key: string, patch: Partial<GalleryItem>) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  }

  function remove(key: string) {
    setItems((current) => current.filter((item) => item.key !== key));
    setAnnounce("Imagen eliminada de la galeria.");
  }

  function move(key: string, direction: -1 | 1) {
    setItems((current) => {
      const index = current.findIndex((item) => item.key === key);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      setAnnounce(`Movida a la posicion ${target + 1} de ${next.length}.`);
      return next;
    });
  }

  function reorderByDrag(from: string, to: string) {
    setItems((current) => {
      const fromIndex = current.findIndex((item) => item.key === from);
      const toIndex = current.findIndex((item) => item.key === to);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
        return current;
      }
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  return (
    <div className="grid gap-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">Galeria</span>
        <span className="text-[11.5px] text-muted">
          arrastra <span className="font-mono">⠿</span> para reordenar
        </span>
      </div>

      <input type="hidden" name="gallery" value={serialize(items)} readOnly />

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
          Sin imagenes. Agrega desde la biblioteca de media o pega URLs.
        </p>
      ) : (
        <div className="grid gap-2.5">
          {items.map((item, index) => (
            <div
              key={item.key}
              draggable
              onDragStart={() => setDragKey(item.key)}
              onDragEnd={() => {
                setDragKey(null);
                setOverKey(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (item.key !== overKey) {
                  setOverKey(item.key);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (dragKey) {
                  reorderByDrag(dragKey, item.key);
                }
                setOverKey(null);
              }}
              className={`flex items-center gap-3 rounded-xl border bg-background p-2 pr-3 transition ${
                dragKey === item.key
                  ? "opacity-40"
                  : overKey === item.key
                    ? "border-cyan shadow-[0_0_0_1px_var(--cyan)]"
                    : "border-border"
              }`}
            >
              <button
                type="button"
                aria-label="Mover (usa flechas arriba y abajo)"
                onKeyDown={(event) => {
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    move(item.key, -1);
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    move(item.key, 1);
                  }
                }}
                className="grid h-11 w-6 shrink-0 cursor-grab place-items-center text-[#6a6379] outline-none focus-visible:text-cyan"
              >
                ⠿
              </button>

              <span className="relative size-13 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-surface-raised to-[#2c2342]">
                {item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </span>

              <div className="grid min-w-0 flex-1 gap-1.5">
                <input
                  value={item.alt}
                  onChange={(event) =>
                    update(item.key, { alt: event.target.value })
                  }
                  placeholder="Texto alternativo"
                  aria-label={`Texto alternativo de la imagen ${index + 1}`}
                  className="w-full truncate rounded-md border border-transparent bg-transparent text-[13px] font-medium outline-none transition focus:border-border focus:bg-surface focus:px-2 focus:py-1"
                />
                <input
                  value={item.caption}
                  onChange={(event) =>
                    update(item.key, { caption: event.target.value })
                  }
                  placeholder="Caption (opcional)"
                  aria-label={`Caption de la imagen ${index + 1}`}
                  className="w-full truncate rounded-md border border-transparent bg-transparent font-mono text-[11.5px] text-muted outline-none transition focus:border-border focus:bg-surface focus:px-2 focus:py-1"
                />
              </div>

              <button
                type="button"
                onClick={() => remove(item.key)}
                aria-label={`Quitar imagen ${index + 1}`}
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted transition hover:border-fuchsia hover:text-fuchsia"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(event) => setNewUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addByUrl();
            }
          }}
          placeholder="Pega una URL de imagen"
          aria-label="URL de imagen a agregar"
          className="min-w-40 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-cyan"
        />
        <button
          type="button"
          onClick={addByUrl}
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:border-cyan hover:text-cyan"
        >
          Agregar
        </button>
        <FileUpload
          label="Subir imagen"
          accept="image/*"
          onUploaded={(file) => {
            addItem({ url: file.url });
            setAnnounce("Imagen subida y agregada a la galeria.");
          }}
        />
      </div>

      <p id={liveId} aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
