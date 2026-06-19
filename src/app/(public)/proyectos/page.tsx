import { PageHero } from "@/components/public/page-hero";
import { ProjectCard } from "@/components/public/project-card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
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
      <Container as="section" className="pb-20">
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {filters.map((filter, index) => (
            <span
              key={filter}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-[180ms] ease-fluid ${
                index === 0
                  ? "border-cyan bg-cyan text-background"
                  : "border-white/15 text-muted hover:border-cyan/40 hover:text-foreground"
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal
              key={project.id}
              delay={(index % 3) * 70}
              className={index === 0 ? "md:col-span-2" : undefined}
            >
              <ProjectCard
                project={project}
                priority={index < 2}
                large={index === 0}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </main>
  );
}
