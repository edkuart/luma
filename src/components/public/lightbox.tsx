"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import type { DemoMedia } from "@/lib/content/types";

type LightboxProps = {
  items: DemoMedia[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Lightbox de galeria (fase-2): overlay con fade, navegacion por teclado
 * (Esc/flechas), swipe horizontal en movil, contador y caption. Respeta
 * `prefers-reduced-motion` via el guard global (Motion lo detecta y reduce la
 * animacion automaticamente).
 */
export function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const open = index !== null;
  const total = items.length;

  const goNext = useCallback(() => {
    if (index === null) return;
    onChange((index + 1) % total);
  }, [index, total, onChange]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onChange((index - 1 + total) % total);
  }, [index, total, onChange]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") goNext();
      else if (event.key === "ArrowLeft") goPrev();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, goNext, goPrev]);

  const current = open ? items[index] : null;

  return (
    <AnimatePresence>
      {current && index !== null ? (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de imagenes"
          className="fixed inset-0 z-[70] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE }}
        >
          <button
            type="button"
            aria-label="Cerrar galeria"
            onClick={onClose}
            className="absolute inset-0 -z-10 h-full w-full bg-[rgba(11,10,18,0.94)] backdrop-blur-sm"
          />

          {/* Barra superior: contador + cerrar */}
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar galeria"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground transition hover:border-cyan hover:text-cyan"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Imagen con swipe horizontal */}
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-8">
            <motion.div
              key={current.id}
              className="flex max-h-full items-center justify-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) goNext();
                else if (info.offset.x > 80) goPrev();
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, ease: EASE }}
            >
              <Image
                src={current.url}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="100vw"
                priority
                draggable={false}
                className="h-auto max-h-[78vh] w-auto select-none rounded-lg object-contain"
              />
            </motion.div>
          </div>

          {/* Barra inferior: caption + navegacion */}
          <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
            <p className="max-w-[60%] text-sm text-muted">{current.caption}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Imagen anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground transition hover:border-cyan hover:text-cyan"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Imagen siguiente"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground transition hover:border-cyan hover:text-cyan"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
