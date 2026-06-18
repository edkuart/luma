import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type {
  HomeManualSelection,
  HomeSectionConfig,
} from "@/types/site-settings";

export const contentStatus = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);

export const mediaKind = pgEnum("media_kind", ["image", "video", "embed"]);

export const projectKind = pgEnum("project_kind", [
  "photography",
  "short_film",
  "editorial",
  "experimental",
  "direction",
  "mixed",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: mediaKind("kind").notNull().default("image"),
    bucket: text("bucket"),
    path: text("path"),
    publicUrl: text("public_url"),
    externalUrl: text("external_url"),
    title: text("title"),
    alt: text("alt"),
    caption: text("caption"),
    mimeType: text("mime_type"),
    fileSize: integer("file_size"),
    width: integer("width"),
    height: integer("height"),
    durationSeconds: integer("duration_seconds"),
    dominantColor: text("dominant_color"),
    blurDataUrl: text("blur_data_url"),
    status: contentStatus("status").notNull().default("draft"),
    ...timestamps,
  },
  (table) => [uniqueIndex("media_assets_bucket_path_idx").on(table.bucket, table.path)],
);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  description: text("description"),
  kind: projectKind("kind").notNull(),
  year: integer("year"),
  role: text("role"),
  location: text("location"),
  credits: text("credits"),
  coverMediaId: uuid("cover_media_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  status: contentStatus("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
});

export const albums = pgTable("albums", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  description: text("description"),
  year: integer("year"),
  coverMediaId: uuid("cover_media_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  status: contentStatus("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
});

export const projectMedia = pgTable(
  "project_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull().default(0),
    displayRole: text("display_role"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("project_media_project_media_idx").on(table.projectId, table.mediaId)],
);

export const albumMedia = pgTable(
  "album_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("album_media_album_media_idx").on(table.albumId, table.mediaId)],
);

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectTags = pgTable(
  "project_tags",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.tagId] })],
);

export const albumTags = pgTable(
  "album_tags",
  {
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.albumId, table.tagId] })],
);

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteName: text("site_name").notNull().default("Luma Studio"),
  tagline: text("tagline").notNull().default("Archivo visual"),
  homeTitle: text("home_title").notNull(),
  homeIntro: text("home_intro").notNull(),
  homeCurationMode: text("home_curation_mode").notNull().default("automatic"),
  manualSelection: jsonb("manual_selection")
    .$type<HomeManualSelection>()
    .notNull()
    .default({}),
  homeSections: jsonb("home_sections")
    .$type<HomeSectionConfig[]>()
    .notNull()
    .default([]),
  contactEmail: text("contact_email"),
  instagramUrl: text("instagram_url"),
  vimeoUrl: text("vimeo_url"),
  youtubeUrl: text("youtube_url"),
  heroProjectId: uuid("hero_project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  featuredAlbumId: uuid("featured_album_id").references(() => albums.id, {
    onDelete: "set null",
  }),
  featuredShortId: uuid("featured_short_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  coverMedia: one(mediaAssets, {
    fields: [projects.coverMediaId],
    references: [mediaAssets.id],
  }),
  media: many(projectMedia),
  tags: many(projectTags),
}));

export const albumsRelations = relations(albums, ({ one, many }) => ({
  coverMedia: one(mediaAssets, {
    fields: [albums.coverMediaId],
    references: [mediaAssets.id],
  }),
  media: many(albumMedia),
  tags: many(albumTags),
}));

export const mediaAssetsRelations = relations(mediaAssets, ({ many }) => ({
  projectMedia: many(projectMedia),
  albumMedia: many(albumMedia),
}));

export const projectMediaRelations = relations(projectMedia, ({ one }) => ({
  project: one(projects, {
    fields: [projectMedia.projectId],
    references: [projects.id],
  }),
  media: one(mediaAssets, {
    fields: [projectMedia.mediaId],
    references: [mediaAssets.id],
  }),
}));

export const albumMediaRelations = relations(albumMedia, ({ one }) => ({
  album: one(albums, {
    fields: [albumMedia.albumId],
    references: [albums.id],
  }),
  media: one(mediaAssets, {
    fields: [albumMedia.mediaId],
    references: [mediaAssets.id],
  }),
}));

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;
export type Album = InferSelectModel<typeof albums>;
export type NewAlbum = InferInsertModel<typeof albums>;
export type MediaAsset = InferSelectModel<typeof mediaAssets>;
export type NewMediaAsset = InferInsertModel<typeof mediaAssets>;
export type SiteSettings = InferSelectModel<typeof siteSettings>;
