/// <reference types="react/canary" />
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { CoverImage } from "@/components/public/cover-image";
import { MediaGrid } from "@/components/public/media-grid";
import { VideoEmbed } from "@/components/public/video-embed";
import { Container } from "@/components/ui/container";
import { kindLabels } from "@/lib/content/types";
import {
  getProjectBySlug,
  getProjects,
  getSiteSettings,
} from "@/lib/data/content";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Proyecto no encontrado" };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const [allProjects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);
  const related = allProjects
    .filter((item) => item.id !== project.id && item.kind === project.kind)
    .slice(0, 2);

  return (
    <main>
      <section className="relative flex min-h-[78vh] items-end overflow-hidden px-5 pb-14 pt-28 sm:px-8">
        <ViewTransition name={`project-${project.slug}`}>
          <CoverImage
            imageId={project.imageId}
            src={project.imageUrl}
            alt={project.imageAlt}
            priority
            sizes="100vw"
            className="object-cover"
          />
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/58 to-background/10" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan">
            {kindLabels[project.kind]} / {project.year}
          </p>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-none sm:text-7xl">
            {project.title}
          </h1>
        </div>
      </section>

      <Container as="section" className="grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-2xl leading-10 text-foreground">
            {project.summary}
          </p>
          <p className="mt-6 leading-8 text-muted">{project.description}</p>
        </div>
        <dl className="grid gap-5 rounded-lg border border-border bg-surface p-6 text-sm">
          <div>
            <dt className="text-muted">Rol</dt>
            <dd className="mt-1 text-foreground">{project.role}</dd>
          </div>
          <div>
            <dt className="text-muted">Ubicacion</dt>
            <dd className="mt-1 text-foreground">{project.location}</dd>
          </div>
          <div>
            <dt className="text-muted">Creditos</dt>
            <dd className="mt-1 text-foreground">{project.credits}</dd>
          </div>
          <div>
            <dt className="text-muted">Tags</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-cyan"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </Container>

      <Container as="section" className="pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia">
              Galeria
            </p>
            <h2 className="mt-3 text-4xl font-semibold">Imagenes del proyecto</h2>
          </div>
        </div>
        <MediaGrid
          items={project.gallery}
          protection={settings.imageProtection}
        />
      </Container>

      {project.videoUrl ? (
        <section className="border-y border-border bg-surface py-16">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-acid">
              Video
            </p>
            <h2 className="mt-3 text-4xl font-semibold">Pieza audiovisual</h2>
            <div className="mt-8">
              <VideoEmbed url={project.videoUrl} title={project.title} />
            </div>
          </Container>
        </section>
      ) : null}

      <Container as="section" className="py-16">
        <Link href="/proyectos" className="text-sm font-semibold text-cyan">
          Volver a proyectos
        </Link>
        {related.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/proyectos/${item.slug}`}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                  Relacionado
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
              </Link>
            ))}
          </div>
        ) : null}
      </Container>
    </main>
  );
}
