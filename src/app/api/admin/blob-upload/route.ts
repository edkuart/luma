import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";

// Subida directa cliente -> Vercel Blob. El navegador sube el archivo sin pasar
// por el servidor (evita el limite de 1MB de Server Actions y 4.5MB de las
// funciones de Vercel), intercambiando primero un token firmado aqui. Solo el
// admin autenticado puede generar token.
const ONE_GB = 1024 * 1024 * 1024;

const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getAdminSession();
        if (!session) {
          throw new Error("No autorizado");
        }

        return {
          allowedContentTypes,
          maximumSizeInBytes: ONE_GB,
          addRandomSuffix: true,
        };
      },
      // En localhost Vercel no puede llamar de vuelta a este callback; el flujo
      // guarda el asset desde el cliente con la URL devuelta, asi que no
      // dependemos de onUploadCompleted.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
