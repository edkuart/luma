"use client";

import { logoutAction } from "@/app/admin/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

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
  eyebrow: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    key: "overview",
    label: "General",
    eyebrow: "Vista rapida",
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
    eyebrow: "Textos y portada",
    items: [
      {
        href: "/admin/home",
        label: "Home",
        helper: "Hero, curaduria y secciones",
      },
      {
        href: "/admin/settings",
        label: "Settings",
        helper: "Contacto, redes y datos base",
      },
      {
        href: "/admin/appearance",
        label: "Apariencia",
        helper: "Colores, acentos y ambiente",
      },
    ],
  },
  {
    key: "content",
    label: "Contenido",
    eyebrow: "Obras y archivo",
    items: [
      {
        href: "/admin/proyectos",
        label: "Proyectos",
        helper: "Series, editoriales y piezas",
      },
      {
        href: "/admin/albumes",
        label: "Albumes",
        helper: "Colecciones fotograficas",
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

function buildInitialOpenGroups(pathname: string) {
  return navGroups.reduce<Record<string, boolean>>((acc, group) => {
    acc[group.key] = group.items.some((item) => isActivePath(pathname, item.href));
    return acc;
  }, {});
}

function AdminIdentity({ adminEmail }: AdminSidebarProps) {
  const adminInitial = adminEmail.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/55 p-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-fuchsia text-sm font-semibold text-white shadow-[0_0_22px_rgba(255,77,141,0.28)]">
        {adminInitial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">Admin</p>
        <p className="truncate text-xs text-muted">{adminEmail}</p>
      </div>
      <form action={logoutAction}>
        <button
          className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted transition hover:border-fuchsia hover:text-fuchsia"
          type="submit"
        >
          Salir
        </button>
      </form>
    </div>
  );
}

function SidebarContent({ adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const initialOpenGroups = useMemo(
    () => buildInitialOpenGroups(pathname),
    [pathname],
  );
  const [openGroups, setOpenGroups] = useState(initialOpenGroups);

  function toggleGroup(key: string) {
    setOpenGroups((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-5">
        <div>
          <p className="text-[11px] font-semibold uppercase leading-5 tracking-[0.38em] text-foreground">
            Luma
            <br />
            Admin
          </p>
          <p className="mt-3 text-xs leading-5 text-muted">
            CMS privado para controlar el sitio publico.
          </p>
        </div>
        <AdminIdentity adminEmail={adminEmail} />
      </div>

      <nav className="mt-8 grid gap-4 overflow-y-auto pr-1">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.key] ?? false;
          const hasActiveItem = group.items.some((item) =>
            isActivePath(pathname, item.href),
          );

          return (
            <section
              key={group.key}
              className="rounded-lg border border-border/70 bg-background/30"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleGroup(group.key)}
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-surface-raised/70"
              >
                <span>
                  <span
                    className={`block text-xs font-semibold uppercase tracking-[0.2em] ${
                      hasActiveItem ? "text-cyan" : "text-muted"
                    }`}
                  >
                    {group.label}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted">
                    {group.eyebrow}
                  </span>
                </span>
                <span
                  className={`grid size-7 place-items-center rounded-md border border-border text-sm text-muted transition ${
                    isOpen ? "rotate-90 border-cyan text-cyan" : ""
                  }`}
                  aria-hidden="true"
                >
                  &gt;
                </span>
              </button>

              {isOpen ? (
                <div className="grid gap-1 border-t border-border/70 p-2">
                  {group.items.map((item) => {
                    const isActive = isActivePath(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-md px-3 py-3 text-sm transition ${
                          isActive
                            ? "bg-surface-raised text-foreground shadow-[inset_3px_0_0_var(--cyan)]"
                            : "text-muted hover:bg-surface-raised/70 hover:text-foreground"
                        }`}
                      >
                        <span className="block font-medium">{item.label}</span>
                        <span className="mt-1 block text-xs text-muted">
                          {item.helper}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Link
          href="/"
          className="block rounded-lg border border-border bg-background/45 px-4 py-3 text-sm font-semibold text-muted transition hover:border-cyan hover:text-cyan"
        >
          Ver sitio publico
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  return (
    <aside className="hidden min-h-screen border-r border-border bg-surface p-5 lg:block">
      <SidebarContent adminEmail={adminEmail} />
    </aside>
  );
}

export function AdminMobileNav({ adminEmail }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const adminInitial = adminEmail.charAt(0).toUpperCase();

  return (
    <div className="border-b border-border bg-surface lg:hidden">
      <header className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em]">
            Luma Admin
          </p>
          <p className="mt-1 text-xs text-muted">Panel privado</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-fuchsia text-sm font-semibold text-white">
            {adminInitial}
          </div>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted"
          >
            Menu
          </button>
        </div>
      </header>

      {open ? (
        <div className="max-h-[75vh] overflow-y-auto border-t border-border p-5">
          <SidebarContent adminEmail={adminEmail} />
        </div>
      ) : null}
    </div>
  );
}
