/// <reference types="react/canary" />
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { kindLabels, type DemoProject } from "@/lib/demo/content";

type ProjectCardProps = {
  project: DemoProject;
  priority?: boolean;
  large?: boolean;
};

export function ProjectCard({ project, priority, large }: ProjectCardProps) {
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className={`group relative block overflow-hidden rounded-lg border border-white/10 bg-surface transition-colors duration-[180ms] ease-fluid hover:border-cyan/30 ${
        large ? "min-h-[460px]" : "min-h-[360px]"
      }`}
    >
      <ViewTransition name={`project-${project.slug}`}>
        <Image
          src={project.imageUrl}
          alt={project.imageAlt}
          fill
          priority={priority}
          sizes={
            large
              ? "(min-width: 1024px) 66vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-[420ms] ease-fluid group-hover:scale-105"
        />
      </ViewTransition>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-[260ms] ease-fluid group-hover:-translate-y-1 sm:p-7">
        <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-cyan">
          <span>{kindLabels[project.kind]}</span>
          <span className="h-1 w-1 rounded-full bg-fuchsia" />
          <span>{project.year}</span>
        </div>
        <h3 className="text-2xl font-semibold text-balance text-foreground">
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          {project.summary}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan transition duration-[180ms] ease-fluid md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          Ver proyecto
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
