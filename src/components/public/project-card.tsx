import Image from "next/image";
import Link from "next/link";
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
      className={`group relative block overflow-hidden rounded-lg border border-white/10 bg-surface ${
        large ? "min-h-[460px] md:col-span-2" : "min-h-[360px]"
      }`}
    >
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
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
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
      </div>
    </Link>
  );
}
