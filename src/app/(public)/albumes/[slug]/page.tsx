/// <reference types="react/canary" />
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { MediaGrid } from "@/components/public/media-grid";
import { Container } from "@/components/ui/container";
import { getAlbumBySlug, getAlbums } from "@/lib/data/content";

type AlbumDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: AlbumDetailPageProps) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  if (!album) {
    return { title: "Album no encontrado" };
  }

  return {
    title: album.title,
    description: album.summary,
  };
}

export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  if (!album) {
    notFound();
  }

  const albums = await getAlbums();
  const currentIndex = albums.findIndex((item) => item.id === album.id);
  const previous = albums[currentIndex - 1];
  const next = albums[currentIndex + 1];

  return (
    <main>
      <section className="relative flex min-h-[72vh] items-end overflow-hidden px-5 pb-14 pt-28 sm:px-8">
        <ViewTransition name={`album-${album.slug}`}>
          <Image
            src={album.imageUrl}
            alt={album.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber">
            {album.imageCount} imagenes / {album.year}
          </p>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-none sm:text-7xl">
            {album.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            {album.description}
          </p>
        </div>
      </section>

      <Container as="section" className="py-16">
        <div className="mb-8 flex flex-wrap gap-2">
          {album.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-cyan"
            >
              {tag}
            </span>
          ))}
        </div>
        <MediaGrid items={album.gallery} />
      </Container>

      <Container as="section" className="flex flex-col gap-4 pb-20 md:flex-row md:justify-between">
        {previous ? (
          <Link href={`/albumes/${previous.slug}`} className="text-cyan">
            Album anterior: {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/albumes/${next.slug}`} className="text-cyan">
            Album siguiente: {next.title}
          </Link>
        ) : (
          <Link href="/albumes" className="text-cyan">
            Volver a albumes
          </Link>
        )}
      </Container>
    </main>
  );
}
