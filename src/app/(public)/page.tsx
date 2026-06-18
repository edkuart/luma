import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/public/project-card";
import { Container } from "@/components/ui/container";
import { buildHomeCuration, getHomeSection } from "@/lib/content/home-curation";

export default function Home() {
  const {
    settings,
    modeLabel,
    visibleSections,
    heroProject,
    highlightedProjects,
    featuredAlbum,
    featuredShort,
  } = buildHomeCuration();
  const projectSection = getHomeSection(visibleSections, "featured-projects");
  const albumSection = getHomeSection(visibleSections, "featured-album");
  const shortSection = getHomeSection(visibleSections, "featured-short");
  const artistNoteSection = getHomeSection(visibleSections, "artist-note");

  return (
    <main>
      <section className="relative flex min-h-[78vh] items-end overflow-hidden px-5 pb-16 pt-28 sm:min-h-screen sm:px-8 lg:pb-24">
        <Image
          src={heroProject.imageUrl}
          alt={heroProject.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(255,77,141,0.28),transparent_28%),linear-gradient(90deg,rgba(11,10,18,0.94),rgba(11,10,18,0.52)_48%,rgba(11,10,18,0.18))]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyan">
            {settings.tagline}
          </p>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.95] text-foreground sm:text-7xl lg:text-8xl">
            {settings.homeTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
            {settings.homeIntro}
          </p>
          <p className="mt-5 inline-flex rounded-full border border-white/15 bg-background/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            {modeLabel}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/proyectos"
              className="rounded-full bg-fuchsia px-6 py-3 text-center text-sm font-semibold text-background transition hover:bg-foreground"
            >
              Explorar proyectos
            </Link>
            <Link
              href="/albumes"
              className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-cyan hover:text-cyan"
            >
              Ver albumes
            </Link>
          </div>
        </div>
      </section>

      {projectSection ? (
      <Container as="section" className="py-20">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia">
              {projectSection.eyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-foreground">
              {projectSection.title}
            </h2>
          </div>
          <Link href="/proyectos" className="text-sm font-semibold text-cyan">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {highlightedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index === 0}
              large={index === 0}
            />
          ))}
        </div>
      </Container>
      ) : null}

      {albumSection ? (
      <section className="border-y border-border bg-surface py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg">
            <Image
              src={featuredAlbum.imageUrl}
              alt={featuredAlbum.imageAlt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">
              {albumSection.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold text-balance">
              {featuredAlbum.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              {featuredAlbum.summary}
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-cyan">
              {featuredAlbum.imageCount} imagenes / {featuredAlbum.year}
            </p>
            <Link
              href={`/albumes/${featuredAlbum.slug}`}
              className="mt-8 inline-flex rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground"
            >
              Explorar album
            </Link>
          </div>
        </Container>
      </section>
      ) : null}

      {shortSection ? (
      <Container as="section" className="grid gap-8 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-acid">
            {shortSection.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-semibold text-balance">
            {featuredShort.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">
            {featuredShort.summary}
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-cyan">
            {featuredShort.duration} / {featuredShort.year}
          </p>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10">
          <Image
            src={featuredShort.imageUrl}
            alt={featuredShort.imageAlt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <Link
            href={`/cortos/${featuredShort.slug}`}
            className="absolute bottom-6 left-6 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            Ver corto
          </Link>
        </div>
      </Container>
      ) : null}

      {artistNoteSection ? (
        <section className="border-t border-border py-16">
          <Container>
            <div className="grid gap-6 rounded-lg border border-border bg-surface-raised p-6 sm:p-8 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
                {artistNoteSection.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {artistNoteSection.title}
              </h2>
            </div>
            <p className="text-lg leading-8 text-muted">
              Si la artista no configura nada, el sistema propone portada,
              proyectos, album y corto usando contenido destacado y recencia. Si
              ella fija selecciones manuales, la home respeta esas decisiones.
            </p>
            </div>
          </Container>
        </section>
      ) : null}
    </main>
  );
}
