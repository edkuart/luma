import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    // El proxy de derivados sirve imagenes locales (con y sin ?wm=0).
    localPatterns: [
      { pathname: "/api/media/**", search: "" },
      { pathname: "/api/media/**", search: "?wm=0" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
