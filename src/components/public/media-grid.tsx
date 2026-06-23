"use client";

import { useState } from "react";
import type { DemoMedia } from "@/lib/content/types";
import type { ImageProtection } from "@/types/site-settings";
import { ProtectedImage } from "./protected-image";
import { Lightbox } from "./lightbox";

type MediaGridProps = {
  items: DemoMedia[];
  protection: ImageProtection;
};

export function MediaGrid({ items, protection }: MediaGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setOpenIndex(index)}
            aria-label={`Abrir imagen: ${item.alt}`}
            className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-lg border border-white/10 bg-surface text-left transition-colors duration-[180ms] ease-fluid hover:border-cyan/40 focus-visible:border-cyan focus-visible:outline-none"
          >
            <figure>
              <div className="overflow-hidden">
                <ProtectedImage
                  src={`/api/media/${item.id}`}
                  alt={item.alt}
                  protection={protection}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={index < 2}
                  wrapperClassName="overflow-hidden"
                  className="h-auto w-full object-cover transition-transform duration-[260ms] ease-fluid group-hover:scale-[1.04]"
                  style={item.filter ? { filter: item.filter } : undefined}
                />
              </div>
              <figcaption className="px-4 py-3 text-sm text-muted">
                {item.caption}
              </figcaption>
            </figure>
          </button>
        ))}
      </div>

      <Lightbox
        items={items}
        index={openIndex}
        protection={protection}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </>
  );
}
