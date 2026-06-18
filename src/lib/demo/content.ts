export type ProjectKind =
  | "photography"
  | "short_film"
  | "editorial"
  | "experimental"
  | "direction"
  | "mixed";

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

export type DemoMedia = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
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

export const projects: DemoProject[] = [
  {
    id: "p-01",
    title: "Retratos bajo neon",
    slug: "retratos-bajo-neon",
    summary:
      "Una serie fotografica sobre color, silencio urbano y presencia humana despues del anochecer.",
    description:
      "La serie trabaja con luces intensas, piel y contraste para construir retratos que se sienten entre documento y ficcion. Funciona como muestra de como Luma puede presentar una obra con narrativa, metadata y galeria propia.",
    kind: "photography",
    year: 2026,
    role: "Fotografia y direccion visual",
    location: "Ciudad nocturna",
    credits: "Modelo y asistencia por confirmar",
    tags: ["Retrato", "Neon", "Nocturno"],
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1800&q=85",
    imageAlt:
      "Retrato artistico de una persona iluminada por luz azul y fucsia.",
    gallery: [
      {
        id: "p-01-g-01",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=82",
        alt: "Retrato femenino con luz suave y fondo oscuro.",
        caption: "Retrato en luz suave.",
        width: 1200,
        height: 1600,
      },
      {
        id: "p-01-g-02",
        url: "https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?auto=format&fit=crop&w=1400&q=82",
        alt: "Retrato con luz saturada y sombra profunda.",
        caption: "Color directo sobre piel.",
        width: 1400,
        height: 934,
      },
      {
        id: "p-01-g-03",
        url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
        alt: "Retrato editorial con gesto sereno.",
        caption: "Pausa y presencia.",
        width: 1200,
        height: 1500,
      },
    ],
  },
  {
    id: "p-02",
    title: "Fragmentos de una habitacion",
    slug: "fragmentos-de-una-habitacion",
    summary:
      "Exploracion editorial de objetos, piel, sombra y memoria domestica.",
    description:
      "Un proyecto editorial pensado como pieza de atmosfera: objetos, textura y sombra construyen una lectura mas intima del espacio.",
    kind: "editorial",
    year: 2025,
    role: "Direccion de arte",
    location: "Interior",
    credits: "Produccion demo",
    tags: ["Editorial", "Interiores", "Textura"],
    imageUrl:
      "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=1400&q=82",
    imageAlt: "Composicion editorial con una figura en una habitacion oscura.",
    gallery: [
      {
        id: "p-02-g-01",
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
        alt: "Editorial de moda con ropa oscura y actitud dramatica.",
        caption: "Volumen y sombra.",
        width: 1200,
        height: 1500,
      },
      {
        id: "p-02-g-02",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=82",
        alt: "Detalle editorial con luz calida.",
        caption: "Detalle de atmosfera.",
        width: 1400,
        height: 933,
      },
    ],
  },
  {
    id: "p-03",
    title: "Linea de fuga",
    slug: "linea-de-fuga",
    summary:
      "Pieza audiovisual corta sobre movimiento, espera y arquitectura nocturna.",
    description:
      "Una pieza audiovisual breve construida a partir de recorridos, silencios y arquitectura. En la version final esta pagina podra cargar embed de Vimeo, YouTube o proveedor de video.",
    kind: "short_film",
    year: 2026,
    role: "Direccion y montaje",
    location: "Exterior nocturno",
    credits: "Equipo audiovisual por confirmar",
    tags: ["Cine", "Arquitectura", "Movimiento"],
    imageUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=82",
    imageAlt: "Camara de cine frente a una escena iluminada.",
    videoUrl: "https://vimeo.com/",
    gallery: [
      {
        id: "p-03-g-01",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=82",
        alt: "Paisaje nocturno cinematografico con luces urbanas.",
        caption: "Fotograma de recorrido.",
        width: 1400,
        height: 933,
      },
      {
        id: "p-03-g-02",
        url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1400&q=82",
        alt: "Butacas de cine frente a una pantalla iluminada.",
        caption: "Sala y espera.",
        width: 1400,
        height: 934,
      },
    ],
  },
  {
    id: "p-04",
    title: "Color residual",
    slug: "color-residual",
    summary:
      "Experimento visual con reflejos, exposiciones largas y color saturado.",
    description:
      "Color residual funciona como laboratorio visual: reflejos, luz accidental y abstraccion fotografica para abrir una linea mas experimental del archivo.",
    kind: "experimental",
    year: 2024,
    role: "Experimentacion visual",
    location: "Estudio y calle",
    credits: "Obra personal",
    tags: ["Experimental", "Color", "Abstraccion"],
    imageUrl:
      "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1400&q=82",
    imageAlt: "Luces urbanas desenfocadas en colores intensos.",
    gallery: [
      {
        id: "p-04-g-01",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=82",
        alt: "Luz de atardecer sobre una escena amplia.",
        caption: "Color suspendido.",
        width: 1400,
        height: 933,
      },
      {
        id: "p-04-g-02",
        url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=82",
        alt: "Paisaje con color intenso y composicion atmosferica.",
        caption: "Prueba cromatica.",
        width: 1200,
        height: 1600,
      },
    ],
  },
];

export const albums: DemoAlbum[] = [
  {
    id: "a-01",
    title: "Archivo nocturno",
    slug: "archivo-nocturno",
    summary:
      "Una coleccion de imagenes sobre ciudad, color, movimiento y escenas encontradas.",
    description:
      "Album pensado como recorrido visual. Mezcla escenas urbanas, luces y fragmentos de movimiento para probar el comportamiento masonry y la navegacion de album.",
    year: 2026,
    imageCount: 18,
    tags: ["Ciudad", "Nocturno", "Color"],
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85",
    imageAlt: "Calle nocturna con luces intensas y atmosfera cinematografica.",
    gallery: [
      {
        id: "a-01-g-01",
        url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=82",
        alt: "Calle nocturna con luces rojas y azules.",
        caption: "Entrada a la noche.",
        width: 1200,
        height: 1500,
      },
      {
        id: "a-01-g-02",
        url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=82",
        alt: "Paisaje vertical con color atmosferico.",
        caption: "Distancia y color.",
        width: 1200,
        height: 1600,
      },
      {
        id: "a-01-g-03",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=82",
        alt: "Escena exterior con luz suave y vegetacion.",
        caption: "Respirar fuera del ruido.",
        width: 1400,
        height: 933,
      },
      {
        id: "a-01-g-04",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=82",
        alt: "Horizonte amplio con luz cinematografica.",
        caption: "Plano abierto.",
        width: 1400,
        height: 933,
      },
    ],
  },
  {
    id: "a-02",
    title: "Piel y sombra",
    slug: "piel-y-sombra",
    summary: "Retratos intimos con contraste fuerte y luz dirigida.",
    description:
      "Una serie de retratos de prueba para validar como se presentan imagenes verticales y captions dentro de la galeria.",
    year: 2025,
    imageCount: 12,
    tags: ["Retrato", "Sombra", "Intimo"],
    imageUrl:
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=1400&q=82",
    imageAlt: "Retrato artistico en blanco y negro con sombra marcada.",
    gallery: [
      {
        id: "a-02-g-01",
        url: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=1200&q=82",
        alt: "Retrato femenino con luz lateral y sombra.",
        caption: "Luz dirigida.",
        width: 1200,
        height: 1500,
      },
      {
        id: "a-02-g-02",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=82",
        alt: "Retrato con fondo oscuro y expresion serena.",
        caption: "Silencio.",
        width: 1200,
        height: 1600,
      },
      {
        id: "a-02-g-03",
        url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
        alt: "Retrato editorial con pose contenida.",
        caption: "Figura y borde.",
        width: 1200,
        height: 1500,
      },
    ],
  },
];

export const shorts: DemoShort[] = [
  {
    id: "s-01",
    title: "Antes de la luz",
    slug: "antes-de-la-luz",
    summary:
      "Cortometraje sobre una caminata antes del amanecer y las imagenes que quedan suspendidas.",
    description:
      "Una pieza demo para ensayar el espacio audiovisual del sitio. La tarjeta prioriza poster, sinopsis y metadata antes de cargar embeds pesados.",
    duration: "08:42",
    year: 2026,
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Sala de cine oscura con pantalla iluminada.",
    role: "Direccion",
    tags: ["Corto", "Cine", "Memoria"],
  },
];

export const kindLabels: Record<ProjectKind, string> = {
  photography: "Fotografia",
  short_film: "Cortometraje",
  editorial: "Editorial",
  experimental: "Experimental",
  direction: "Direccion",
  mixed: "Mixto",
};

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAlbumBySlug(slug: string) {
  return albums.find((album) => album.slug === slug);
}

export function getShortBySlug(slug: string) {
  return shorts.find((short) => short.slug === slug);
}
