"use client";

import { AnimatePresence, motion } from "motion/react";
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

const EASE = [0.22, 1, 0.36, 1] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Header scroll-aware: intensifica borde/sombra al separarse del top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-[260ms] ease-fluid ${
          scrolled
            ? "border-white/15 bg-background/85 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            : "border-white/10 bg-background/72"
        }`}
      >
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
                  className={`transition-colors duration-[180ms] ease-fluid hover:text-cyan focus-visible:text-cyan ${
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
              className="hidden rounded-full border border-cyan/40 px-4 py-2 text-sm font-medium text-cyan transition duration-[180ms] ease-fluid hover:bg-cyan hover:text-background sm:inline-flex"
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* Menu movil: overlay a pantalla completa */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navegacion"
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <button
              type="button"
              aria-label="Cerrar menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              className="absolute inset-0 flex flex-col bg-background px-5 pb-10 pt-5 sm:px-8"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
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
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
