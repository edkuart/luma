import Link from "next/link";

const navItems = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/albumes", label: "Albumes" },
  { href: "/cortos", label: "Cortos" },
  { href: "/sobre", label: "Sobre" },
];

export function PublicHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/72 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground"
        >
          Luma Studio
        </Link>
        <div className="hidden items-center gap-7 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-cyan focus-visible:text-cyan"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/contacto"
          className="rounded-full border border-cyan/40 px-4 py-2 text-sm font-medium text-cyan transition hover:bg-cyan hover:text-background"
        >
          Contacto
        </Link>
      </nav>
    </header>
  );
}
