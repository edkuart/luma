import { AlbumCard } from "@/components/public/album-card";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
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
      <Container as="section" className="grid gap-6 pb-20">
        {albums.map((album, index) => (
          <Reveal key={album.id} delay={index * 80}>
            <AlbumCard album={album} priority={index === 0} />
          </Reveal>
        ))}
      </Container>
    </main>
  );
}
