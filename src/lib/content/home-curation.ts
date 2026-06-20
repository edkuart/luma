import type { DemoAlbum, DemoProject, DemoShort } from "@/lib/content/types";
import {
  getAlbums,
  getProjects,
  getShorts,
  getSiteSettings,
} from "@/lib/data/content";
import type { HomeSectionConfig, SiteSettings } from "@/types/site-settings";

export type HomeCuration = {
  settings: SiteSettings;
  modeLabel: string;
  heroProject?: DemoProject;
  highlightedProjects: DemoProject[];
  featuredAlbum?: DemoAlbum;
  featuredShort?: DemoShort;
  visibleSections: HomeSectionConfig[];
};

type ContentInput = {
  projects: DemoProject[];
  albums: DemoAlbum[];
  shorts: DemoShort[];
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

function buildAutomaticCuration({ projects, albums, shorts }: ContentInput) {
  const projectsByRecency = sortByRecency(projects);
  const heroProject =
    projects.find((project) => project.featured) ?? projectsByRecency[0];
  const highlightedProjects = uniqueById(
    [heroProject, ...projectsByRecency].filter(
      (project): project is DemoProject => Boolean(project),
    ),
  ).slice(0, 4);
  const featuredAlbum =
    albums.find((album) => album.featured) ?? sortByRecency(albums)[0];
  const featuredShort = sortByRecency(shorts)[0];

  return { heroProject, highlightedProjects, featuredAlbum, featuredShort };
}

function buildManualCuration(settings: SiteSettings, content: ContentInput) {
  const { projects, albums, shorts } = content;
  const fallback = buildAutomaticCuration(content);
  const manual = settings.manualSelection;
  const pinnedProjects =
    manual.highlightedProjectSlugs
      ?.map((slug) => bySlug(projects, slug))
      .filter((project): project is DemoProject => Boolean(project)) ?? [];

  return {
    heroProject:
      bySlug(projects, manual.heroProjectSlug) ?? fallback.heroProject,
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

/** Logica pura de curaduria a partir de settings + contenido ya cargado. */
export function buildHomeCuration(
  settings: SiteSettings,
  content: ContentInput,
): HomeCuration {
  const base =
    settings.homeCurationMode === "manual"
      ? buildManualCuration(settings, content)
      : buildAutomaticCuration(content);

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

/** Carga contenido + settings desde la base y arma la curaduria del home. */
export async function getHomeCuration(): Promise<HomeCuration> {
  const [projects, albums, shorts, settings] = await Promise.all([
    getProjects(),
    getAlbums(),
    getShorts(),
    getSiteSettings(),
  ]);

  return buildHomeCuration(settings, { projects, albums, shorts });
}

export function getHomeSection(
  sections: HomeSectionConfig[],
  key: HomeSectionConfig["key"],
) {
  return sections.find((section) => section.key === key);
}
