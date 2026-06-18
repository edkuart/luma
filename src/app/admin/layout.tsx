import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/proyectos", label: "Proyectos" },
    { href: "/admin/albumes", label: "Albumes" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border bg-surface p-6 lg:block">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em]">
              Luma Admin
            </p>
            <UserButton />
          </div>
          <nav className="mt-10 grid gap-3 text-sm text-muted">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 transition hover:bg-surface-raised hover:text-cyan"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>
          <header className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">
              Luma Admin
            </p>
            <UserButton />
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
