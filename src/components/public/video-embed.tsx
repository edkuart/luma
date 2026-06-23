// Render de video para la ficha audiovisual. Detecta Vimeo/YouTube y los
// embebe por iframe (mejor streaming y control de descarga del proveedor); para
// archivos directos (.mp4/.webm) usa <video> con controlsList para desalentar
// la descarga. Es un Server Component (sin estado).

function parseVideo(url: string):
  | { type: "youtube"; src: string }
  | { type: "vimeo"; src: string }
  | { type: "file" }
  | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      if (id) {
        return { type: "youtube", src: `https://www.youtube.com/embed/${id}` };
      }
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) {
        return { type: "youtube", src: `https://www.youtube.com/embed/${id}` };
      }
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) {
        return { type: "vimeo", src: `https://player.vimeo.com/video/${id}` };
      }
    }

    return { type: "file" };
  } catch {
    return null;
  }
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const video = parseVideo(url);
  if (!video) {
    return null;
  }

  if (video.type === "file") {
    return (
      <video
        controls
        controlsList="nodownload"
        playsInline
        preload="metadata"
        className="aspect-video w-full rounded-lg border border-border bg-black"
      >
        <source src={url} />
        Tu navegador no puede reproducir este video.
      </video>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
      <iframe
        src={video.src}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
