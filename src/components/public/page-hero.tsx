import { Container } from "@/components/ui/container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <Container as="section" className="pb-12 pt-28 sm:pt-32 lg:pt-40">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan">
        {eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-none text-foreground sm:text-7xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
        {description}
      </p>
    </Container>
  );
}
