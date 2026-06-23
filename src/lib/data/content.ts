import { db } from "@/db/client";
import type {
  DemoAlbum,
  DemoMedia,
  DemoProject,
  DemoShort,
  ProjectKind,
} from "@/lib/content/types";
import { demoSiteSettings } from "@/lib/demo/site-settings";
import { mergeImageProtection } from "@/lib/theme";
import {
  normalizeMediaEditSettings,
  type MediaEditSettings,
} from "@/types/media";
import type { SiteSettings } from "@/types/site-settings";

type MediaRow = {
  id: string;
  publicUrl: string | null;
  externalUrl: string | null;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  editSettings?: MediaEditSettings | null;
};

function mediaUrl(media: MediaRow) {
  return media.publicUrl ?? media.externalUrl ?? "";
}

/** Convierte los ajustes editoriales en un filtro CSS (si difieren del base). */
function editSettingsToFilter(settings?: MediaEditSettings | null) {
  if (!settings) {
    return undefined;
  }
  const { brightness, contrast, saturation } = settings;
  if (brightness === 100 && contrast === 100 && saturation === 100) {
    return undefined;
  }
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
}

function toMedia(media: MediaRow): DemoMedia {
  return {
    id: media.id,
    url: mediaUrl(media),
    alt: media.alt ?? "",
    caption: media.caption ?? "",
    width: media.width ?? 1200,
    height: media.height ?? 800,
    filter: editSettingsToFilter(media.editSettings),
  };
}

// Las junction rows traen su sortOrder; ordenamos la galeria en JS.
const contentWith = {
  coverMedia: true,
  media: { with: { media: true } },
  tags: { with: { tag: true } },
} as const;

type JunctionRow = { sortOrder: number; media: MediaRow };

type ContentStatus = "draft" | "published" | "archived";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  kind: string;
  year: number | null;
  role: string | null;
  location: string | null;
  credits: string | null;
  videoUrl: string | null;
  status: ContentStatus;
  sortOrder: number;
  isFeatured: boolean;
  coverMedia: MediaRow | null;
  media: JunctionRow[];
  tags: { tag: { name: string } }[];
};

type AlbumRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  year: number | null;
  status: ContentStatus;
  sortOrder: number;
  isFeatured: boolean;
  coverMedia: MediaRow | null;
  media: JunctionRow[];
  tags: { tag: { name: string } }[];
};

function gallery(rows: JunctionRow[]): DemoMedia[] {
  return [...rows]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((row) => toMedia(row.media));
}

function toProject(row: ProjectRow): DemoProject {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary ?? "",
    description: row.description ?? "",
    kind: row.kind as ProjectKind,
    year: row.year ?? 0,
    role: row.role ?? "",
    location: row.location ?? "",
    credits: row.credits ?? "",
    tags: row.tags.map((t) => t.tag.name),
    imageUrl: row.coverMedia ? mediaUrl(row.coverMedia) : "",
    imageAlt: row.coverMedia?.alt ?? row.title,
    imageId: row.coverMedia?.id,
    gallery: gallery(row.media),
    videoUrl: row.videoUrl ?? undefined,
    featured: row.isFeatured,
  };
}

function toShort(row: ProjectRow): DemoShort {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary ?? "",
    description: row.description ?? "",
    duration: "",
    year: row.year ?? 0,
    imageUrl: row.coverMedia ? mediaUrl(row.coverMedia) : "",
    imageAlt: row.coverMedia?.alt ?? row.title,
    imageId: row.coverMedia?.id,
    role: row.role ?? "",
    tags: row.tags.map((t) => t.tag.name),
  };
}

function toAlbum(row: AlbumRow): DemoAlbum {
  const items = gallery(row.media);
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary ?? "",
    description: row.description ?? "",
    year: row.year ?? 0,
    imageCount: items.length,
    imageUrl: row.coverMedia ? mediaUrl(row.coverMedia) : "",
    imageAlt: row.coverMedia?.alt ?? row.title,
    imageId: row.coverMedia?.id,
    tags: row.tags.map((t) => t.tag.name),
    gallery: items,
    featured: row.isFeatured,
  };
}

// ---- Lecturas publicas (solo publicado) ----

export async function getProjects(): Promise<DemoProject[]> {
  const rows = (await db.query.projects.findMany({
    where: (p, { eq }) => eq(p.status, "published"),
    orderBy: (p, { asc, desc }) => [asc(p.sortOrder), desc(p.year)],
    with: contentWith,
  })) as unknown as ProjectRow[];
  return rows.map(toProject);
}

export async function getProjectBySlug(
  slug: string,
): Promise<DemoProject | undefined> {
  const row = (await db.query.projects.findFirst({
    where: (p, { and, eq }) => and(eq(p.slug, slug), eq(p.status, "published")),
    with: contentWith,
  })) as unknown as ProjectRow | undefined;
  return row ? toProject(row) : undefined;
}

export async function getShorts(): Promise<DemoShort[]> {
  const rows = (await db.query.projects.findMany({
    where: (p, { and, eq }) =>
      and(eq(p.status, "published"), eq(p.kind, "short_film")),
    orderBy: (p, { desc }) => [desc(p.year)],
    with: contentWith,
  })) as unknown as ProjectRow[];
  return rows.map(toShort);
}

export async function getAlbums(): Promise<DemoAlbum[]> {
  const rows = (await db.query.albums.findMany({
    where: (a, { eq }) => eq(a.status, "published"),
    orderBy: (a, { asc, desc }) => [asc(a.sortOrder), desc(a.year)],
    with: contentWith,
  })) as unknown as AlbumRow[];
  return rows.map(toAlbum);
}

export async function getAlbumBySlug(
  slug: string,
): Promise<DemoAlbum | undefined> {
  const row = (await db.query.albums.findFirst({
    where: (a, { and, eq }) => and(eq(a.slug, slug), eq(a.status, "published")),
    with: contentWith,
  })) as unknown as AlbumRow | undefined;
  return row ? toAlbum(row) : undefined;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await db.query.siteSettings.findFirst();
  if (!row) {
    return demoSiteSettings;
  }
  return {
    siteName: row.siteName,
    tagline: row.tagline,
    homeTitle: row.homeTitle,
    homeIntro: row.homeIntro,
    homeCurationMode: row.homeCurationMode as SiteSettings["homeCurationMode"],
    manualSelection: row.manualSelection,
    homeSections: row.homeSections,
    contactEmail: row.contactEmail ?? "",
    instagramUrl: row.instagramUrl ?? undefined,
    vimeoUrl: row.vimeoUrl ?? undefined,
    youtubeUrl: row.youtubeUrl ?? undefined,
    theme: row.theme,
    imageProtection: mergeImageProtection(row.imageProtection),
  };
}

// ---- Lecturas admin (todos los estados) ----

export type AdminProjectRow = {
  id: string;
  title: string;
  slug: string;
  kind: ProjectKind;
  year: number | null;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
};

export async function getAdminProjects(): Promise<AdminProjectRow[]> {
  const rows = await db.query.projects.findMany({
    orderBy: (p, { asc }) => [asc(p.sortOrder)],
    columns: {
      id: true,
      title: true,
      slug: true,
      kind: true,
      year: true,
      status: true,
      isFeatured: true,
    },
  });
  return rows as AdminProjectRow[];
}

export type AdminAlbumRow = {
  id: string;
  title: string;
  slug: string;
  year: number | null;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
};

export async function getAdminAlbums(): Promise<AdminAlbumRow[]> {
  const rows = await db.query.albums.findMany({
    orderBy: (a, { asc }) => [asc(a.sortOrder)],
    columns: {
      id: true,
      title: true,
      slug: true,
      year: true,
      status: true,
      isFeatured: true,
    },
  });
  return rows as AdminAlbumRow[];
}

export type AdminMediaRow = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  width: number | null;
  height: number | null;
  editSettings: MediaEditSettings;
};

export async function getAdminMedia(): Promise<AdminMediaRow[]> {
  const rows = await db.query.mediaAssets.findMany({
    orderBy: (m, { desc }) => [desc(m.createdAt)],
  });
  return rows.map((m) => ({
    id: m.id,
    url: m.publicUrl ?? m.externalUrl ?? "",
    alt: m.alt ?? "",
    caption: m.caption ?? "",
    width: m.width,
    height: m.height,
    editSettings: normalizeMediaEditSettings(m.editSettings),
  }));
}

export async function getAdminProjectById(
  id: string,
): Promise<ProjectRow | undefined> {
  return (await db.query.projects.findFirst({
    where: (p, { eq }) => eq(p.id, id),
    with: contentWith,
  })) as unknown as ProjectRow | undefined;
}

export async function getAdminAlbumById(
  id: string,
): Promise<AlbumRow | undefined> {
  return (await db.query.albums.findFirst({
    where: (a, { eq }) => eq(a.id, id),
    with: contentWith,
  })) as unknown as AlbumRow | undefined;
}
