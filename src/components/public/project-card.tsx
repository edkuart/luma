import Link from "next/link";
import { CoverImage } from "@/components/public/cover-image";
import { kindLabels, type DemoProject } from "@/lib/content/types";

type ProjectCardProps = {
  project: DemoProject;
  priority?: boolean;
  large?: boolean;
};

export function ProjectCard({ project, priority, large }: ProjectCardProps) {
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className={`group relative block overflow-hidden rounded-lg border border-white/10 bg-surface transition duration-[180ms] ease-fluid hover:-translate-y-0.5 hover:border-cyan/40 ${
        large ? "min-h-[460px]" : "min-h-[360px]"
      }`}
    >
      {project.imageId || project.imageUrl ? (
        <CoverImage
          imageId={project.imageId}
          src={project.imageUrl}
          alt={project.imageAlt}
          priority={priority}
          sizes={
            large
              ? "(min-width: 1024px) 66vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover object-[center_38%] brightness-110 saturate-110 transition-transform duration-[420ms] ease-fluid group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,77,141,0.28),transparent_30%),linear-gradient(135deg,#221b36,#0b0a12)]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,10,18,0.02),rgba(11,10,18,0.08)_36%,rgba(11,10,18,0.82)_100%)]" />
      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan backdrop-blur">
        {kindLabels[project.kind]}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-[260ms] ease-fluid group-hover:-translate-y-1 sm:p-7">
        <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-amber">
          <span className="h-1 w-1 rounded-full bg-fuchsia" />
          <span>{project.year}</span>
        </div>
        <h3 className="text-2xl font-semibold text-balance text-foreground">
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          {project.summary}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-sm font-semibold text-background transition duration-[180ms] ease-fluid group-hover:bg-foreground">
          Ver proyecto
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
