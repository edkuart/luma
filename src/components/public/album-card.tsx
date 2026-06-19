/// <reference types="react/canary" />
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { DemoAlbum } from "@/lib/demo/content";

type AlbumCardProps = {
  album: DemoAlbum;
  priority?: boolean;
};

export function AlbumCard({ album, priority }: AlbumCardProps) {
  return (
    <Link
      href={`/albumes/${album.slug}`}
      className="group grid overflow-hidden rounded-lg border border-white/10 bg-surface transition-colors duration-[180ms] ease-fluid hover:border-cyan/30 md:grid-cols-[0.9fr_1fr]"
    >
      <div className="relative min-h-[320px] overflow-hidden">
        <ViewTransition name={`album-${album.slug}`}>
          <Image
            src={album.imageUrl}
            alt={album.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-[420ms] ease-fluid group-hover:scale-105"
          />
        </ViewTransition>
      </div>
      <div className="flex flex-col justify-between p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber">
            {album.imageCount} imagenes / {album.year}
          </p>
          <h3 className="mt-4 text-3xl font-semibold text-balance">
            {album.title}
          </h3>
          <p className="mt-4 text-sm leading-6 text-muted">{album.summary}</p>
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan">
          Explorar album
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-[180ms] ease-fluid group-hover:translate-x-1"
          >
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      </div>
    </Link>
  );
}
