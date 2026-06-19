import { clerkMiddleware } from "@clerk/nextjs/server";

// Proteccion del admin desactivada temporalmente: el panel queda abierto en
// desarrollo. clerkMiddleware se mantiene para que la sesion de Clerk siga
// disponible (sign-in/up, UserButton), pero no se fuerza login ni rol.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Todas las rutas excepto archivos estaticos y _next.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
