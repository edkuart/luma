import sharp from "sharp";
import { db } from "@/db/client";
import { getSiteSettings } from "@/lib/data/content";

// Proxy de derivados: el publico nunca recibe la URL del Blob original ni el
// archivo en alta resolucion. Esta ruta toma el id del asset, descarga el
// original en el servidor, lo reescala (tope ~1600px), hornea la marca de agua
// (si esta activa) y devuelve un webp. El original queda oculto detras del id.
export const runtime = "nodejs";

const MAX_WIDTH = 1600;

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });
}

function watermarkTile(text: string) {
  const safe = escapeXml(text);
  return Buffer.from(
    `<svg width="420" height="300" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="50%" font-family="Helvetica, Arial, sans-serif"
        font-size="22" font-weight="600" letter-spacing="4"
        fill="rgba(255,255,255,0.16)" text-anchor="middle"
        transform="rotate(-28 210 150)">${safe}</text>
    </svg>`,
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // wm=0 desactiva la marca de agua (portadas/hero).
  const watermarkAllowed =
    new URL(request.url).searchParams.get("wm") !== "0";

  const asset = await db.query.mediaAssets.findFirst({
    where: (m, { eq }) => eq(m.id, id),
    columns: { publicUrl: true, externalUrl: true },
  });

  const source = asset?.publicUrl ?? asset?.externalUrl;
  if (!source) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(source);
  if (!upstream.ok) {
    return new Response("Upstream error", { status: 502 });
  }
  const input = Buffer.from(await upstream.arrayBuffer());

  const settings = await getSiteSettings();
  const { watermarkEnabled, watermarkText } = settings.imageProtection;

  let pipeline = sharp(input)
    .rotate() // respeta orientacion EXIF
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

  if (watermarkAllowed && watermarkEnabled && watermarkText.trim()) {
    pipeline = pipeline.composite([
      { input: watermarkTile(watermarkText.trim()), tile: true, blend: "over" },
    ]);
  }

  const output = await pipeline.webp({ quality: 80 }).toBuffer();

  return new Response(new Uint8Array(output), {
    headers: {
      "Content-Type": "image/webp",
      // Cache moderado: permite que un cambio de watermark se propague pronto.
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
