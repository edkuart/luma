import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/public/project-card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getHomeCuration, getHomeSection } from "@/lib/content/home-curation";

export default async function Home() {
  const {
    settings,
    modeLabel,
    visibleSections,
    heroProject,
    highlightedProjects,
    featuredAlbum,
    featuredShort,
  } = await getHomeCuration();
  const projectSection = getHomeSection(visibleSections, "featured-projects");
  const albumSection = getHomeSection(visibleSections, "featured-album");
  const shortSection = getHomeSection(visibleSections, "featured-short");
  const artistNoteSection = getHomeSection(visibleSections, "artist-note");

  if (!heroProject) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5 text-center">
        <p className="text-muted">
          Todavia no hay contenido publicado. Agrega proyectos desde el panel.
        </p>
      </main>
    );
  }

  return (
    <main>
      <section className="relative flex min-h-[86vh] items-end overflow-hidden px-5 pb-10 pt-28 sm:min-h-screen sm:px-8 lg:pb-16">
        <Image
          src={heroProject.imageUrl}
          alt={heroProject.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 68% 22%, color-mix(in oklab, var(--fuchsia) 24%, transparent), transparent 28%), linear-gradient(90deg, color-mix(in oklab, var(--background) var(--hero-overlay), transparent), color-mix(in oklab, var(--background) calc(var(--hero-overlay) * 0.72), transparent) 52%, color-mix(in oklab, var(--background) calc(var(--hero-overlay) * 0.28), transparent))",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-4xl rounded-lg border border-white/10 bg-background/58 p-5 shadow-2xl shadow-background/35 backdrop-blur-md sm:p-8 lg:p-10">
            <Reveal
              as="p"
              className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyan"
            >
              {settings.tagline}
            </Reveal>
            <Reveal
              as="h1"
              delay={80}
              className="text-balance text-5xl font-semibold leading-[0.95] text-foreground sm:text-7xl lg:text-8xl"
            >
              {settings.homeTitle}
            </Reveal>
            <Reveal
              as="p"
              delay={160}
              className="mt-6 max-w-2xl text-lg leading-8 text-foreground/82 sm:text-xl"
            >
              {settings.homeIntro}
            </Reveal>
            <Reveal
              as="p"
              delay={240}
              className="mt-5 inline-flex rounded-full border border-amber/30 bg-amber/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber"
            >
              {modeLabel}
            </Reveal>
            <Reveal
              delay={300}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/proyectos"
                className="rounded-full bg-fuchsia px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-foreground hover:text-background"
              >
                Explorar proyectos
              </Link>
              <Link
                href="/albumes"
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-cyan hover:text-cyan"
              >
                Ver albumes
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {projectSection ? (
        <Container as="section" className="py-20">
          <Reveal className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {highlightedProjects.map((project, index) => (
              <Reveal
                key={project.id}
                delay={index * 70}
                className={index === 0 ? "md:col-span-2" : undefined}
              >
                <ProjectCard
                  project={project}
                  priority={index === 0}
                  large={index === 0}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      ) : null}

      {albumSection && featuredAlbum ? (
        <section className="border-y border-border bg-surface py-20">
          <Container className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <Reveal className="relative min-h-[420px] overflow-hidden rounded-lg">
              <Image
                src={featuredAlbum.imageUrl}
                alt={featuredAlbum.imageAlt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal delay={120}>
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
            </Reveal>
          </Container>
        </section>
      ) : null}

      {shortSection && featuredShort ? (
        <Container
          as="section"
          className="grid gap-8 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"
        >
          <Reveal>
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
          </Reveal>
          <Reveal
            delay={120}
            className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10"
          >
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
          </Reveal>
        </Container>
      ) : null}

      {artistNoteSection ? (
        <section className="border-t border-border py-16">
          <Container>
            <Reveal className="grid gap-6 rounded-lg border border-border bg-surface-raised p-6 sm:p-8 lg:grid-cols-[0.7fr_1.3fr]">
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
                proyectos, album y corto usando contenido destacado y recencia.
                Si ella fija selecciones manuales, la home respeta esas
                decisiones.
              </p>
            </Reveal>
          </Container>
        </section>
      ) : null}
    </main>
  );
}
