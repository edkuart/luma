import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { shorts } from "@/lib/demo/content";

export const metadata = {
  title: "Cortometrajes",
  description: "Piezas audiovisuales y cortometrajes de Luma Studio.",
};

export default function ShortsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Movimiento"
        title="Cortometrajes"
        description="Piezas audiovisuales, exploraciones narrativas y visuales con poster, sinopsis y metadata."
      />
      <Container as="section" className="grid gap-6 pb-20">
        {shorts.map((short) => (
          <article
            key={short.id}
            className="grid overflow-hidden rounded-lg border border-white/10 bg-surface lg:grid-cols-[0.95fr_1.05fr]"
          >
            <div className="relative min-h-[360px]">
              <Image
                src={short.imageUrl}
                alt={short.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-acid">
                {short.duration} / {short.year}
              </p>
              <h2 className="mt-4 text-4xl font-semibold text-balance">
                {short.title}
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted">
                {short.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {short.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-cyan"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/proyectos/linea-de-fuga`}
                className="mt-8 inline-flex w-fit rounded-full bg-acid px-6 py-3 text-sm font-semibold text-background"
              >
                Ver ficha audiovisual
              </Link>
            </div>
          </article>
        ))}
      </Container>
    </main>
  );
}
