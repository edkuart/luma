import Image from "next/image";
import type { DemoMedia } from "@/lib/demo/content";

type MediaGridProps = {
  items: DemoMedia[];
};

export function MediaGrid({ items }: MediaGridProps) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {items.map((item, index) => (
        <figure
          key={item.id}
          className="mb-5 break-inside-avoid overflow-hidden rounded-lg border border-white/10 bg-surface"
        >
          <Image
            src={item.url}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={index < 2}
            className="h-auto w-full object-cover"
          />
          <figcaption className="px-4 py-3 text-sm text-muted">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
