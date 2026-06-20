"use client";

import Image from "next/image";
import { useState } from "react";
import type { DemoMedia } from "@/lib/content/types";
import { Lightbox } from "./lightbox";

type MediaGridProps = {
  items: DemoMedia[];
};

export function MediaGrid({ items }: MediaGridProps) {
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
                <Image
                  src={item.url}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={index < 2}
                  className="h-auto w-full object-cover transition-transform duration-[260ms] ease-fluid group-hover:scale-[1.04]"
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
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </>
  );
}
