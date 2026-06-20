// Tipos de vista (view models) que consumen los componentes publicos y el admin.
// Antes vivian en lib/demo/content.ts; se centralizan aqui para que tanto el
// contenido demo (seed) como la capa de datos (Drizzle) produzcan las mismas
// formas.

export type ProjectKind =
  | "photography"
  | "short_film"
  | "editorial"
  | "experimental"
  | "direction"
  | "mixed";

export type DemoMedia = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type DemoProject = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  kind: ProjectKind;
  year: number;
  role: string;
  location: string;
  credits: string;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
  gallery: DemoMedia[];
  videoUrl?: string;
  featured?: boolean;
};

export type DemoAlbum = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  year: number;
  imageCount: number;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  gallery: DemoMedia[];
  featured?: boolean;
};

export type DemoShort = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  duration: string;
  year: number;
  imageUrl: string;
  imageAlt: string;
  role: string;
  tags: string[];
};

export const kindLabels: Record<ProjectKind, string> = {
  photography: "Fotografia",
  short_film: "Cortometraje",
  editorial: "Editorial",
  experimental: "Experimental",
  direction: "Direccion",
  mixed: "Mixto",
};
