"use client";

import { logoutAction } from "@/app/admin/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AdminSidebarProps = {
  adminEmail: string;
};

type NavItem = {
  href: string;
  label: string;
  helper: string;
};

type NavGroup = {
  key: string;
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    key: "overview",
    label: "General",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        helper: "Resumen del contenido",
      },
    ],
  },
  {
    key: "public-site",
    label: "Sitio publico",
    items: [
      {
        href: "/admin/home",
        label: "Home",
        helper: "Hero y secciones",
      },
      {
        href: "/admin/settings",
        label: "Settings",
        helper: "Contacto y redes",
      },
      {
        href: "/admin/appearance",
        label: "Apariencia",
        helper: "Colores y acentos",
      },
    ],
  },
  {
    key: "content",
    label: "Contenido",
    items: [
      {
        href: "/admin/proyectos",
        label: "Proyectos",
        helper: "Series y piezas",
      },
      {
        href: "/admin/albumes",
        label: "Albumes",
        helper: "Colecciones",
      },
      {
        href: "/admin/media",
        label: "Media",
        helper: "Imagenes y recursos",
      },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminIdentity({
  adminEmail,
  withLogout = true,
}: AdminSidebarProps & { withLogout?: boolean }) {
  const adminInitial = adminEmail.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/55 p-2.5">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-fuchsia text-sm font-semibold text-white shadow-[0_0_22px_rgba(255,77,141,0.28)]">
        {adminInitial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight">Admin</p>
        <p className="truncate text-[11px] text-muted">{adminEmail}</p>
      </div>
      {withLogout ? (
        <form action={logoutAction}>
          <button
            className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-muted transition hover:border-fuchsia hover:text-fuchsia"
            type="submit"
          >
            Salir
          </button>
        </form>
      ) : null}
    </div>
  );
}

/**
 * Arbol de navegacion unico, montado una sola vez. `AdminSidebar` (desktop) y
 * `AdminMobileNav` (drawer) lo reutilizan: el contenedor cambia por breakpoint,
 * no el contenido. Los grupos quedan siempre visibles (sin colapsables).
 */
function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-3.5 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.key}>
          <p className="px-1.5 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">
            {group.label}
          </p>
          <div className="grid gap-0.5">
            {group.items.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex flex-col gap-0.5 rounded-lg px-2.5 py-2.5 transition ${
                    isActive
                      ? "bg-surface-raised text-foreground shadow-[inset_3px_0_0_var(--cyan)]"
                      : "text-muted hover:bg-surface-raised/70 hover:text-foreground"
                  }`}
                >
                  <span className="text-[13.5px] font-medium">{item.label}</span>
                  <span
                    className={`text-[11px] ${isActive ? "text-foreground/70" : "text-muted"}`}
                  >
                    {item.helper}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <p className="text-[11px] font-semibold uppercase leading-7 tracking-[0.34em] text-foreground">
      Luma
      <br />
      Admin
    </p>
  );
}

function SidebarBody({
  adminEmail,
  onNavigate,
  withLogout = true,
  showBrand = true,
}: AdminSidebarProps & {
  onNavigate?: () => void;
  withLogout?: boolean;
  showBrand?: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-4">
      {showBrand ? <Brand /> : null}
      <AdminIdentity adminEmail={adminEmail} withLogout={withLogout} />
      <AdminNav onNavigate={onNavigate} />
      <div className="mt-auto pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="block rounded-lg border border-border bg-background/45 px-3.5 py-2.5 text-sm font-semibold text-muted transition hover:border-cyan hover:text-cyan"
        >
          Ver sitio publico
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-border bg-surface p-5 lg:block">
      <SidebarBody adminEmail={adminEmail} />
    </aside>
  );
}

export function AdminMobileNav({ adminEmail }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const adminInitial = adminEmail.charAt(0).toUpperCase();

  // El drawer se cierra al navegar via `onNavigate` en cada link.
  // Cerrar con Escape + bloquear scroll del body mientras esta abierto.
  useEffect(() => {
    if (!open) {
      return;
    }

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
          Luma Admin
          <span className="mt-0.5 block text-[10px] font-normal normal-case tracking-normal text-muted">
            Panel privado
          </span>
        </p>
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-full bg-fuchsia text-xs font-semibold text-white">
            {adminInitial}
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="admin-drawer"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
            className="grid size-11 place-items-center gap-1 rounded-lg border border-border text-foreground"
          >
            <span className="block h-px w-[18px] bg-current" />
            <span className="block h-px w-[18px] bg-current" />
            <span className="block h-px w-[18px] bg-current" />
          </button>
        </div>
      </header>

      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-[rgba(6,5,11,0.62)] transition-opacity duration-[180ms] ease-[var(--ease-fluid)] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer off-canvas (mismo AdminNav que en desktop) */}
      <aside
        id="admin-drawer"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-40 w-[280px] max-w-[85vw] overflow-y-auto border-r border-border bg-surface p-5 transition-transform duration-[260ms] ease-[var(--ease-fluid)] ${
          open ? "translate-x-0" : "-translate-x-[104%]"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <Brand />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menu"
            className="grid size-9 place-items-center rounded-lg border border-border text-muted transition hover:border-cyan hover:text-cyan"
          >
            ✕
          </button>
        </div>
        <SidebarBody
          adminEmail={adminEmail}
          onNavigate={() => setOpen(false)}
          showBrand={false}
        />
      </aside>
    </div>
  );
}
