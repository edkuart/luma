"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContentStatusBadge } from "@/components/admin/content-status-badge";

type ServerAction = (formData: FormData) => void | Promise<void>;

type ContentStatus = "draft" | "published" | "archived";

type ContentCardProps = {
  id: string;
  title: string;
  slug: string;
  editHref: string;
  status: ContentStatus;
  isFeatured: boolean;
  /** Linea de metadatos secundarios (ej: ["Fotografia", "2025"]). */
  meta: string[];
  featuredAction: ServerAction;
  publishedAction: ServerAction;
  deleteAction: ServerAction;
};

/**
 * Presentacion movil (lg:hidden) de un item de contenido (proyecto o album).
 * Misma data que la tabla de desktop y las mismas Server Actions; las acciones
 * secundarias se agrupan en un menu kebab para el alcance del pulgar.
 */
export function ContentCard({
  id,
  title,
  slug,
  editHref,
  status,
  isFeatured,
  meta,
  featuredAction,
  publishedAction,
  deleteAction,
}: ContentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  return (
    <article className="grid gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-surface-raised to-[#2c2342]">
          <span className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent_0_7px,rgba(255,255,255,0.025)_7px_14px)]" />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={editHref}
            className="block truncate text-[15px] font-semibold transition hover:text-cyan"
          >
            {title}
          </Link>
          <p className="mt-0.5 truncate font-mono text-xs text-muted">/{slug}</p>
        </div>
        <ContentStatusBadge status={status} />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        {meta.map((item, index) => (
          <span key={item} className={index === 0 ? "text-foreground" : ""}>
            {index > 0 ? <span className="mr-3" aria-hidden="true">·</span> : null}
            {item}
          </span>
        ))}
        {isFeatured ? (
          <span className="text-fuchsia">
            <span className="mr-3" aria-hidden="true">
              ·
            </span>
            ★ Destacado
          </span>
        ) : null}
      </div>

      <div className="relative flex items-center gap-2.5" ref={menuRef}>
        <Link
          href={editHref}
          className="flex flex-1 items-center justify-center rounded-full border border-cyan/40 px-4 py-3 text-sm font-semibold text-cyan transition hover:brightness-110"
        >
          Editar
        </Link>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Mas acciones"
          onClick={() => setMenuOpen((value) => !value)}
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-border text-lg text-muted transition hover:border-cyan hover:text-cyan"
        >
          ⋯
        </button>

        {menuOpen ? (
          <div
            role="menu"
            className="absolute bottom-full right-0 z-10 mb-2 w-48 overflow-hidden rounded-xl border border-border bg-surface-raised shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
          >
            <form action={featuredAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="featured" value={String(isFeatured)} />
              <button
                type="submit"
                role="menuitem"
                className="block w-full px-4 py-3 text-left text-sm font-medium text-fuchsia transition hover:bg-background/40"
              >
                {isFeatured ? "Quitar destacado" : "Destacar"}
              </button>
            </form>
            <form action={publishedAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value={status} />
              <button
                type="submit"
                role="menuitem"
                className="block w-full border-t border-border px-4 py-3 text-left text-sm font-medium text-amber transition hover:bg-background/40"
              >
                {status === "published" ? "Despublicar" : "Publicar"}
              </button>
            </form>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={id} />
              <button
                type="submit"
                role="menuitem"
                className="block w-full border-t border-border px-4 py-3 text-left text-sm font-medium text-muted transition hover:bg-background/40 hover:text-fuchsia"
              >
                Borrar
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </article>
  );
}
