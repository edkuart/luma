"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";

const navItems = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/albumes", label: "Albumes" },
  { href: "/cortos", label: "Cortos" },
  { href: "/sobre", label: "Sobre" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape para cerrar + bloqueo de scroll del body mientras esta abierto.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/72 backdrop-blur-xl">
      <Container as="nav" className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground"
        >
          Luma Studio
        </Link>

        <div className="hidden items-center gap-7 text-sm text-muted md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`transition hover:text-cyan focus-visible:text-cyan ${
                  active ? "text-cyan" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contacto"
            className="hidden rounded-full border border-cyan/40 px-4 py-2 text-sm font-medium text-cyan transition hover:bg-cyan hover:text-background sm:inline-flex"
          >
            Contacto
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground transition hover:border-cyan hover:text-cyan md:hidden"
          >
            <span className="sr-only">Abrir menu</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </Container>
    </header>

      {/* Menu movil: overlay a pantalla completa */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navegacion"
        hidden={!open}
        className="fixed inset-0 z-[60] md:hidden"
      >
        <button
          type="button"
          aria-label="Cerrar menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full bg-background/80 backdrop-blur-sm"
        />
        <div className="absolute inset-0 flex flex-col bg-background px-5 pb-10 pt-5 sm:px-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground">
              Luma Studio
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground transition hover:border-cyan hover:text-cyan"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-4 text-3xl font-semibold transition ${
                    active ? "text-cyan" : "text-foreground hover:text-cyan"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/contacto"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex items-center justify-center rounded-full bg-fuchsia px-6 py-4 text-sm font-semibold text-background transition hover:bg-foreground"
          >
            Contacto
          </Link>
        </div>
      </div>
    </>
  );
}
