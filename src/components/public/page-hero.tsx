type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-12 pt-32 sm:px-8 lg:pt-40">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan">
        {eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold leading-none text-foreground sm:text-7xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
        {description}
      </p>
    </section>
  );
}
