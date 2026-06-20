import type { SiteSettings } from "@/types/site-settings";

export const demoSiteSettings: SiteSettings = {
  siteName: "Luma Studio",
  tagline: "Archivo visual",
  homeTitle: "Luz, imagen y memoria en movimiento.",
  homeIntro:
    "Un archivo visual para reunir fotografia, series artisticas y piezas audiovisuales con una direccion editorial nocturna.",
  homeCurationMode: "automatic",
  manualSelection: {
    // When this mode changes to "manual", the artist can pin exact content.
    heroProjectSlug: "retratos-bajo-neon",
    highlightedProjectSlugs: [
      "retratos-bajo-neon",
      "linea-de-fuga",
      "fragmentos-de-una-habitacion",
      "color-residual",
    ],
    featuredAlbumSlug: "archivo-nocturno",
    featuredShortSlug: "antes-de-la-luz",
  },
  homeSections: [
    {
      key: "featured-projects",
      title: "Proyectos destacados",
      eyebrow: "Curaduria inicial",
      visible: true,
      sortOrder: 10,
    },
    {
      key: "featured-album",
      title: "Serie destacada",
      eyebrow: "Serie destacada",
      visible: true,
      sortOrder: 20,
    },
    {
      key: "featured-short",
      title: "Movimiento",
      eyebrow: "Movimiento",
      visible: true,
      sortOrder: 30,
    },
    {
      key: "artist-note",
      title: "Nota de archivo",
      eyebrow: "Desde el estudio",
      visible: true,
      sortOrder: 40,
    },
  ],
  contactEmail: "hola@lumastudio.demo",
  instagramUrl: "https://instagram.com/",
  vimeoUrl: "https://vimeo.com/",
  youtubeUrl: "https://youtube.com/",
  theme: {
    background: "#0b0a12",
    foreground: "#f6f1e8",
    surface: "#171426",
    surfaceRaised: "#221b36",
    border: "#342c49",
    muted: "#afa7bd",
    fuchsia: "#ff4d8d",
    cyan: "#00e0c6",
    amber: "#ffb000",
    acid: "#7cff4b",
    heroOverlay: 58,
  },
};
