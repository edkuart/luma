// Serializa la galeria de un proyecto/album al formato editable
// `url | alt | caption` (una por linea) que consumen GalleryEditor y
// `parseGallery`. Compartido por project-form y album-form.

type GalleryMediaRow = {
  sortOrder: number;
  media: {
    publicUrl: string | null;
    externalUrl: string | null;
    alt: string | null;
    caption: string | null;
  };
};

export function galleryToText(media: GalleryMediaRow[]) {
  return [...media]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) =>
      [
        m.media.publicUrl ?? m.media.externalUrl ?? "",
        m.media.alt ?? "",
        m.media.caption ?? "",
      ]
        .join(" | ")
        .replace(/(\s\|\s)+$/, ""),
    )
    .join("\n");
}
