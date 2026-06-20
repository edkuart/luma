export type HomeCurationMode = "automatic" | "manual";

export type HomeSectionKey =
  | "featured-projects"
  | "featured-album"
  | "featured-short"
  | "artist-note";

export type HomeSectionConfig = {
  key: HomeSectionKey;
  title: string;
  eyebrow: string;
  visible: boolean;
  sortOrder: number;
};

export type HomeManualSelection = {
  heroProjectSlug?: string;
  highlightedProjectSlugs?: string[];
  featuredAlbumSlug?: string;
  featuredShortSlug?: string;
};

export type SiteTheme = {
  background: string;
  foreground: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  muted: string;
  fuchsia: string;
  cyan: string;
  amber: string;
  acid: string;
  heroOverlay: number;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  homeTitle: string;
  homeIntro: string;
  homeCurationMode: HomeCurationMode;
  manualSelection: HomeManualSelection;
  homeSections: HomeSectionConfig[];
  contactEmail: string;
  instagramUrl?: string;
  vimeoUrl?: string;
  youtubeUrl?: string;
  theme: SiteTheme;
};
