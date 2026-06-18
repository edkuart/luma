import Image from "next/image";
import Link from "next/link";
import type { DemoAlbum } from "@/lib/demo/content";

type AlbumCardProps = {
  album: DemoAlbum;
  priority?: boolean;
};

export function AlbumCard({ album, priority }: AlbumCardProps) {
  return (
    <Link
      href={`/albumes/${album.slug}`}
      className="group grid overflow-hidden rounded-lg border border-white/10 bg-surface md:grid-cols-[0.9fr_1fr]"
    >
      <div className="relative min-h-[320px] overflow-hidden">
        <Image
          src={album.imageUrl}
          alt={album.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
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
        <p className="mt-8 text-sm font-semibold text-cyan">Explorar album</p>
      </div>
    </Link>
  );
}
