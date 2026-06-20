import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import {
  albumMedia,
  albumTags,
  albums,
  mediaAssets,
  projectMedia,
  projects,
  projectTags,
  siteSettings,
  tags,
} from "@/db/schema";
import type { ProjectKind } from "@/lib/content/types";
import type {
  HomeManualSelection,
  HomeSectionConfig,
  SiteTheme,
} from "@/types/site-settings";
import {
  normalizeMediaEditSettings,
  type MediaEditSettings,
} from "@/types/media";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Lista "url | alt | caption" por linea -> objetos media. */
export function parseGallery(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, alt, caption] = line.split("|").map((p) => p.trim());
      return { url, alt: alt ?? "", caption: caption ?? "" };
    })
    .filter((item) => item.url);
}

export function parseTags(input: string) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function ensureTagIds(names: string[]) {
  const ids: string[] = [];
  for (const name of names) {
    const slug = slugify(name);
    const existing = await db.query.tags.findFirst({
      where: (t, { eq: eqFn }) => eqFn(t.slug, slug),
    });
    if (existing) {
      ids.push(existing.id);
    } else {
      const [row] = await db
        .insert(tags)
        .values({ name, slug })
        .returning({ id: tags.id });
      ids.push(row.id);
    }
  }
  return ids;
}

async function createMediaAsset(media: {
  url: string;
  alt: string;
  caption?: string;
  title?: string;
}) {
  const [row] = await db
    .insert(mediaAssets)
    .values({
      kind: "image",
      publicUrl: media.url,
      alt: media.alt,
      caption: media.caption ?? null,
      title: media.title ?? null,
      status: "published",
    })
    .returning({ id: mediaAssets.id });
  return row.id;
}

export type ProjectInput = {
  title: string;
  slug?: string;
  summary: string;
  description: string;
  kind: ProjectKind;
  year: number;
  role: string;
  location: string;
  credits: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  sortOrder: number;
  coverUrl: string;
  coverAlt: string;
  tags: string[];
  gallery: { url: string; alt: string; caption: string }[];
};

async function replaceProjectGallery(
  projectId: string,
  gallery: ProjectInput["gallery"],
) {
  const links = await db.query.projectMedia.findMany({
    where: (pm, { eq: eqFn }) => eqFn(pm.projectId, projectId),
  });
  const mediaIds = links.map((l) => l.mediaId);
  await db.delete(projectMedia).where(eq(projectMedia.projectId, projectId));
  if (mediaIds.length > 0) {
    await db.delete(mediaAssets).where(inArray(mediaAssets.id, mediaIds));
  }

  let order = 0;
  for (const item of gallery) {
    const mediaId = await createMediaAsset(item);
    await db
      .insert(projectMedia)
      .values({ projectId, mediaId, sortOrder: order });
    order += 1;
  }
}

async function replaceProjectTags(projectId: string, names: string[]) {
  await db.delete(projectTags).where(eq(projectTags.projectId, projectId));
  const ids = await ensureTagIds(names);
  for (const tagId of ids) {
    await db.insert(projectTags).values({ projectId, tagId });
  }
}

export async function createProject(input: ProjectInput) {
  const slug = input.slug?.trim() || slugify(input.title);
  const coverMediaId = await createMediaAsset({
    url: input.coverUrl,
    alt: input.coverAlt || input.title,
    title: input.title,
  });

  const [row] = await db
    .insert(projects)
    .values({
      title: input.title,
      slug,
      summary: input.summary,
      description: input.description,
      kind: input.kind,
      year: input.year,
      role: input.role,
      location: input.location,
      credits: input.credits,
      coverMediaId,
      status: input.status,
      isFeatured: input.isFeatured,
      sortOrder: input.sortOrder,
      publishedAt: input.status === "published" ? new Date() : null,
    })
    .returning({ id: projects.id });

  await replaceProjectGallery(row.id, input.gallery);
  await replaceProjectTags(row.id, input.tags);
  return row.id;
}

export async function updateProject(id: string, input: ProjectInput) {
  const slug = input.slug?.trim() || slugify(input.title);
  const current = await db.query.projects.findFirst({
    where: (p, { eq: eqFn }) => eqFn(p.id, id),
    columns: { coverMediaId: true },
  });

  // Actualiza (o crea) la portada reutilizando su media asset si existe.
  if (current?.coverMediaId) {
    await db
      .update(mediaAssets)
      .set({ publicUrl: input.coverUrl, alt: input.coverAlt || input.title })
      .where(eq(mediaAssets.id, current.coverMediaId));
  }
  const coverMediaId =
    current?.coverMediaId ??
    (await createMediaAsset({
      url: input.coverUrl,
      alt: input.coverAlt || input.title,
      title: input.title,
    }));

  await db
    .update(projects)
    .set({
      title: input.title,
      slug,
      summary: input.summary,
      description: input.description,
      kind: input.kind,
      year: input.year,
      role: input.role,
      location: input.location,
      credits: input.credits,
      coverMediaId,
      status: input.status,
      isFeatured: input.isFeatured,
      sortOrder: input.sortOrder,
      publishedAt: input.status === "published" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  await replaceProjectGallery(id, input.gallery);
  await replaceProjectTags(id, input.tags);
}

export async function deleteProject(id: string) {
  await replaceProjectGallery(id, []); // limpia media de galeria
  await db.delete(projectTags).where(eq(projectTags.projectId, id));
  const project = await db.query.projects.findFirst({
    where: (p, { eq: eqFn }) => eqFn(p.id, id),
    columns: { coverMediaId: true },
  });
  await db.delete(projects).where(eq(projects.id, id));
  if (project?.coverMediaId) {
    await db
      .delete(mediaAssets)
      .where(eq(mediaAssets.id, project.coverMediaId));
  }
}

export async function setProjectStatus(
  id: string,
  status: "draft" | "published" | "archived",
) {
  await db
    .update(projects)
    .set({
      status,
      publishedAt: status === "published" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));
}

export async function setProjectFeatured(id: string, isFeatured: boolean) {
  await db
    .update(projects)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(projects.id, id));
}

// ---- Albumes ----

export type AlbumInput = {
  title: string;
  slug?: string;
  summary: string;
  description: string;
  year: number;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  sortOrder: number;
  coverUrl: string;
  coverAlt: string;
  tags: string[];
  gallery: { url: string; alt: string; caption: string }[];
};

async function replaceAlbumGallery(
  albumId: string,
  gallery: AlbumInput["gallery"],
) {
  const links = await db.query.albumMedia.findMany({
    where: (am, { eq: eqFn }) => eqFn(am.albumId, albumId),
  });
  const mediaIds = links.map((l) => l.mediaId);
  await db.delete(albumMedia).where(eq(albumMedia.albumId, albumId));
  if (mediaIds.length > 0) {
    await db.delete(mediaAssets).where(inArray(mediaAssets.id, mediaIds));
  }

  let order = 0;
  for (const item of gallery) {
    const mediaId = await createMediaAsset(item);
    await db.insert(albumMedia).values({ albumId, mediaId, sortOrder: order });
    order += 1;
  }
}

async function replaceAlbumTags(albumId: string, names: string[]) {
  await db.delete(albumTags).where(eq(albumTags.albumId, albumId));
  const ids = await ensureTagIds(names);
  for (const tagId of ids) {
    await db.insert(albumTags).values({ albumId, tagId });
  }
}

export async function createAlbum(input: AlbumInput) {
  const slug = input.slug?.trim() || slugify(input.title);
  const coverMediaId = await createMediaAsset({
    url: input.coverUrl,
    alt: input.coverAlt || input.title,
    title: input.title,
  });

  const [row] = await db
    .insert(albums)
    .values({
      title: input.title,
      slug,
      summary: input.summary,
      description: input.description,
      year: input.year,
      coverMediaId,
      status: input.status,
      isFeatured: input.isFeatured,
      sortOrder: input.sortOrder,
      publishedAt: input.status === "published" ? new Date() : null,
    })
    .returning({ id: albums.id });

  await replaceAlbumGallery(row.id, input.gallery);
  await replaceAlbumTags(row.id, input.tags);
  return row.id;
}

export async function updateAlbum(id: string, input: AlbumInput) {
  const slug = input.slug?.trim() || slugify(input.title);
  const current = await db.query.albums.findFirst({
    where: (a, { eq: eqFn }) => eqFn(a.id, id),
    columns: { coverMediaId: true },
  });

  if (current?.coverMediaId) {
    await db
      .update(mediaAssets)
      .set({ publicUrl: input.coverUrl, alt: input.coverAlt || input.title })
      .where(eq(mediaAssets.id, current.coverMediaId));
  }
  const coverMediaId =
    current?.coverMediaId ??
    (await createMediaAsset({
      url: input.coverUrl,
      alt: input.coverAlt || input.title,
      title: input.title,
    }));

  await db
    .update(albums)
    .set({
      title: input.title,
      slug,
      summary: input.summary,
      description: input.description,
      year: input.year,
      coverMediaId,
      status: input.status,
      isFeatured: input.isFeatured,
      sortOrder: input.sortOrder,
      publishedAt: input.status === "published" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(albums.id, id));

  await replaceAlbumGallery(id, input.gallery);
  await replaceAlbumTags(id, input.tags);
}

export async function deleteAlbum(id: string) {
  await replaceAlbumGallery(id, []);
  await db.delete(albumTags).where(eq(albumTags.albumId, id));
  const album = await db.query.albums.findFirst({
    where: (a, { eq: eqFn }) => eqFn(a.id, id),
    columns: { coverMediaId: true },
  });
  await db.delete(albums).where(eq(albums.id, id));
  if (album?.coverMediaId) {
    await db.delete(mediaAssets).where(eq(mediaAssets.id, album.coverMediaId));
  }
}

export async function setAlbumStatus(
  id: string,
  status: "draft" | "published" | "archived",
) {
  await db
    .update(albums)
    .set({
      status,
      publishedAt: status === "published" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(albums.id, id));
}

export async function setAlbumFeatured(id: string, isFeatured: boolean) {
  await db
    .update(albums)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(albums.id, id));
}

// ---- Media (biblioteca) ----

export async function createMedia(input: {
  url: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  mimeType?: string;
  fileSize?: number;
  editSettings?: Partial<MediaEditSettings>;
}) {
  await db.insert(mediaAssets).values({
    kind: "image",
    publicUrl: input.url,
    alt: input.alt,
    caption: input.caption || null,
    width: input.width ?? null,
    height: input.height ?? null,
    mimeType: input.mimeType ?? null,
    fileSize: input.fileSize ?? null,
    editSettings: normalizeMediaEditSettings(input.editSettings),
    status: "published",
  });
}

export async function updateMediaEditSettings(
  id: string,
  editSettings: Partial<MediaEditSettings>,
) {
  await db
    .update(mediaAssets)
    .set({
      editSettings: normalizeMediaEditSettings(editSettings),
      updatedAt: new Date(),
    })
    .where(eq(mediaAssets.id, id));
}

export async function deleteMedia(id: string) {
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
}

// ---- Settings ----

export type SiteSettingsInput = {
  siteName: string;
  tagline: string;
  homeTitle: string;
  homeIntro: string;
  homeCurationMode: "automatic" | "manual";
  contactEmail: string;
  instagramUrl: string;
  vimeoUrl: string;
  youtubeUrl: string;
  manualSelection: HomeManualSelection;
  homeSections: HomeSectionConfig[];
  theme?: SiteTheme;
};

export async function updateSiteSettings(input: SiteSettingsInput) {
  const current = await db.query.siteSettings.findFirst({
    columns: { id: true },
  });

  const values = {
    siteName: input.siteName,
    tagline: input.tagline,
    homeTitle: input.homeTitle,
    homeIntro: input.homeIntro,
    homeCurationMode: input.homeCurationMode,
    contactEmail: input.contactEmail || null,
    instagramUrl: input.instagramUrl || null,
    vimeoUrl: input.vimeoUrl || null,
    youtubeUrl: input.youtubeUrl || null,
    manualSelection: input.manualSelection,
    homeSections: input.homeSections,
    ...(input.theme ? { theme: input.theme } : {}),
    updatedAt: new Date(),
  };

  if (current) {
    await db
      .update(siteSettings)
      .set(values)
      .where(eq(siteSettings.id, current.id));
  } else {
    await db.insert(siteSettings).values(values);
  }
}

export async function updateSiteTheme(theme: SiteTheme) {
  const current = await db.query.siteSettings.findFirst({
    columns: { id: true },
  });

  if (current) {
    await db
      .update(siteSettings)
      .set({ theme, updatedAt: new Date() })
      .where(eq(siteSettings.id, current.id));
    return;
  }

  await db.insert(siteSettings).values({
    homeTitle: "Luz, imagen y memoria en movimiento.",
    homeIntro:
      "Un archivo visual para reunir fotografia, series artisticas y piezas audiovisuales.",
    theme,
  });
}
