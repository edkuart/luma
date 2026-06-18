import type { DemoAlbum, DemoProject, DemoShort } from "@/lib/demo/content";
import { albums, projects, shorts } from "@/lib/demo/content";
import { demoSiteSettings } from "@/lib/demo/site-settings";
import type { HomeSectionConfig, SiteSettings } from "@/types/site-settings";

export type HomeCuration = {
  settings: SiteSettings;
  modeLabel: string;
  heroProject: DemoProject;
  highlightedProjects: DemoProject[];
  featuredAlbum: DemoAlbum;
  featuredShort: DemoShort;
  visibleSections: HomeSectionConfig[];
};

function bySlug<T extends { slug: string }>(items: T[], slug?: string) {
  if (!slug) {
    return undefined;
  }

  return items.find((item) => item.slug === slug);
}

function sortByRecency<T extends { year: number }>(items: T[]) {
  return [...items].sort((a, b) => b.year - a.year);
}

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function buildAutomaticCuration() {
  const projectsByRecency = sortByRecency(projects);
  const heroProject =
    projects.find((project) => project.featured) ?? projectsByRecency[0];
  const highlightedProjects = uniqueById([
    heroProject,
    ...projectsByRecency,
  ]).slice(0, 4);
  const featuredAlbum =
    albums.find((album) => album.featured) ?? sortByRecency(albums)[0];
  const featuredShort = sortByRecency(shorts)[0];

  return {
    heroProject,
    highlightedProjects,
    featuredAlbum,
    featuredShort,
  };
}

function buildManualCuration(settings: SiteSettings) {
  const fallback = buildAutomaticCuration();
  const manual = settings.manualSelection;
  const pinnedProjects =
    manual.highlightedProjectSlugs
      ?.map((slug) => bySlug(projects, slug))
      .filter((project): project is DemoProject => Boolean(project)) ?? [];

  return {
    heroProject: bySlug(projects, manual.heroProjectSlug) ?? fallback.heroProject,
    highlightedProjects:
      pinnedProjects.length > 0
        ? uniqueById([...pinnedProjects, ...fallback.highlightedProjects]).slice(
            0,
            4,
          )
        : fallback.highlightedProjects,
    featuredAlbum:
      bySlug(albums, manual.featuredAlbumSlug) ?? fallback.featuredAlbum,
    featuredShort:
      bySlug(shorts, manual.featuredShortSlug) ?? fallback.featuredShort,
  };
}

export function buildHomeCuration(
  settings: SiteSettings = demoSiteSettings,
): HomeCuration {
  const base =
    settings.homeCurationMode === "manual"
      ? buildManualCuration(settings)
      : buildAutomaticCuration();

  return {
    settings,
    modeLabel:
      settings.homeCurationMode === "manual"
        ? "Seleccion manual"
        : "Propuesta automatica",
    visibleSections: [...settings.homeSections]
      .filter((section) => section.visible)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    ...base,
  };
}

export function getHomeSection(
  sections: HomeSectionConfig[],
  key: HomeSectionConfig["key"],
) {
  return sections.find((section) => section.key === key);
}
