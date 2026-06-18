import { PageHero } from "@/components/public/page-hero";
import { ProjectCard } from "@/components/public/project-card";
import { kindLabels, projects } from "@/lib/demo/content";

export const metadata = {
  title: "Proyectos",
  description: "Archivo de proyectos artisticos de Luma Studio.",
};

export default function ProjectsPage() {
  const filters = ["Todo", ...Object.values(kindLabels)];

  return (
    <main>
      <PageHero
        eyebrow="Archivo"
        title="Proyectos"
        description="Series fotograficas, piezas audiovisuales y experimentos visuales organizados como archivo vivo."
      />
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {filters.map((filter, index) => (
            <span
              key={filter}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
                index === 0
                  ? "border-cyan bg-cyan text-background"
                  : "border-white/15 text-muted"
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 2}
              large={index === 0}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
