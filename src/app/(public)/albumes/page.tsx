import { AlbumCard } from "@/components/public/album-card";
import { PageHero } from "@/components/public/page-hero";
import { albums } from "@/lib/demo/content";

export const metadata = {
  title: "Albumes",
  description: "Series fotograficas y colecciones visuales de Luma Studio.",
};

export default function AlbumsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Series"
        title="Albumes"
        description="Colecciones fotograficas organizadas como recorridos visuales, con portada, narrativa y orden propio."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-8">
        {albums.map((album, index) => (
          <AlbumCard key={album.id} album={album} priority={index === 0} />
        ))}
      </section>
    </main>
  );
}
