import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <Container as="section" className="pb-12 pt-28 sm:pt-32 lg:pt-40">
      <Reveal
        as="p"
        className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan"
      >
        {eyebrow}
      </Reveal>
      <Reveal
        as="h1"
        delay={80}
        className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-none text-foreground sm:text-7xl"
      >
        {title}
      </Reveal>
      <Reveal
        as="p"
        delay={160}
        className="mt-6 max-w-2xl text-lg leading-8 text-muted"
      >
        {description}
      </Reveal>
    </Container>
  );
}
