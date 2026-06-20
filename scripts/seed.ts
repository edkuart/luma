import { config } from "dotenv";

config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import {
  albums as demoAlbums,
  projects as demoProjects,
  shorts as demoShorts,
} from "@/lib/demo/content";
import { demoSiteSettings } from "@/lib/demo/site-settings";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL no esta configurada en .env.local");
}

const db = drizzle(neon(databaseUrl), { schema });

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function wipe() {
  // Orden hijo -> padre por las FKs (projectMedia/albumMedia tienen restrict
  // sobre mediaAssets, asi que van antes).
  await db.delete(schema.siteSettings);
  await db.delete(schema.projectTags);
  await db.delete(schema.albumTags);
  await db.delete(schema.projectMedia);
  await db.delete(schema.albumMedia);
  await db.delete(schema.projects);
  await db.delete(schema.albums);
  await db.delete(schema.mediaAssets);
  await db.delete(schema.tags);
}

async function seedTags() {
  const names = new Set<string>();
  for (const project of demoProjects) project.tags.forEach((t) => names.add(t));
  for (const album of demoAlbums) album.tags.forEach((t) => names.add(t));
  for (const short of demoShorts) short.tags.forEach((t) => names.add(t));

  const tagIdByName = new Map<string, string>();
  for (const name of names) {
    const [row] = await db
      .insert(schema.tags)
      .values({ name, slug: slugify(name) })
      .returning({ id: schema.tags.id });
    tagIdByName.set(name, row.id);
  }
  return tagIdByName;
}

async function insertMedia(media: {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  title?: string;
}) {
  const [row] = await db
    .insert(schema.mediaAssets)
    .values({
      kind: "image",
      publicUrl: media.url,
      alt: media.alt,
      caption: media.caption ?? null,
      width: media.width ?? null,
      height: media.height ?? null,
      title: media.title ?? null,
      status: "published",
    })
    .returning({ id: schema.mediaAssets.id });
  return row.id;
}

async function seedProjects(tagIdByName: Map<string, string>) {
  // Proyectos del demo + los cortos (como kind short_film).
  const shortAsProject = demoShorts.map((short) => ({
    title: short.title,
    slug: short.slug,
    summary: short.summary,
    description: short.description,
    kind: "short_film" as const,
    year: short.year,
    role: short.role,
    location: "",
    credits: "",
    tags: short.tags,
    imageUrl: short.imageUrl,
    imageAlt: short.imageAlt,
    gallery: [] as { id: string; url: string; alt: string; caption: string; width: number; height: number }[],
    featured: false,
  }));

  const all = [...demoProjects, ...shortAsProject];

  let order = 0;
  for (const project of all) {
    const coverMediaId = await insertMedia({
      url: project.imageUrl,
      alt: project.imageAlt,
      title: project.title,
    });

    const [row] = await db
      .insert(schema.projects)
      .values({
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        description: project.description,
        kind: project.kind,
        year: project.year,
        role: project.role,
        location: project.location,
        credits: project.credits,
        coverMediaId,
        status: "published",
        isFeatured: project.featured ?? false,
        sortOrder: order,
        publishedAt: new Date(),
      })
      .returning({ id: schema.projects.id });

    let mediaOrder = 0;
    for (const media of project.gallery) {
      const mediaId = await insertMedia(media);
      await db.insert(schema.projectMedia).values({
        projectId: row.id,
        mediaId,
        sortOrder: mediaOrder,
      });
      mediaOrder += 1;
    }

    for (const tag of project.tags) {
      const tagId = tagIdByName.get(tag);
      if (tagId) {
        await db
          .insert(schema.projectTags)
          .values({ projectId: row.id, tagId });
      }
    }

    order += 1;
  }
}

async function seedAlbums(tagIdByName: Map<string, string>) {
  let order = 0;
  for (const album of demoAlbums) {
    const coverMediaId = await insertMedia({
      url: album.imageUrl,
      alt: album.imageAlt,
      title: album.title,
    });

    const [row] = await db
      .insert(schema.albums)
      .values({
        title: album.title,
        slug: album.slug,
        summary: album.summary,
        description: album.description,
        year: album.year,
        coverMediaId,
        status: "published",
        isFeatured: album.featured ?? false,
        sortOrder: order,
        publishedAt: new Date(),
      })
      .returning({ id: schema.albums.id });

    let mediaOrder = 0;
    for (const media of album.gallery) {
      const mediaId = await insertMedia(media);
      await db.insert(schema.albumMedia).values({
        albumId: row.id,
        mediaId,
        sortOrder: mediaOrder,
      });
      mediaOrder += 1;
    }

    for (const tag of album.tags) {
      const tagId = tagIdByName.get(tag);
      if (tagId) {
        await db.insert(schema.albumTags).values({ albumId: row.id, tagId });
      }
    }

    order += 1;
  }
}

async function seedSettings() {
  const s = demoSiteSettings;
  await db.insert(schema.siteSettings).values({
    siteName: s.siteName,
    tagline: s.tagline,
    homeTitle: s.homeTitle,
    homeIntro: s.homeIntro,
    homeCurationMode: s.homeCurationMode,
    manualSelection: s.manualSelection,
    homeSections: s.homeSections,
    contactEmail: s.contactEmail,
    instagramUrl: s.instagramUrl,
    vimeoUrl: s.vimeoUrl,
    youtubeUrl: s.youtubeUrl,
    theme: s.theme,
  });
}

async function main() {
  console.log("Limpiando tablas...");
  await wipe();
  console.log("Sembrando tags...");
  const tagIdByName = await seedTags();
  console.log("Sembrando proyectos y cortos...");
  await seedProjects(tagIdByName);
  console.log("Sembrando albumes...");
  await seedAlbums(tagIdByName);
  console.log("Sembrando settings...");
  await seedSettings();
  console.log("Seed completo.");
}

main().catch((error) => {
  console.error("Seed fallo:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
