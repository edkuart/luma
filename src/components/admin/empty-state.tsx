import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
};

/**
 * Estado vacio reutilizable para las pantallas del admin (lista sin items).
 * Mismo lenguaje visual que el resto del CMS: borde punteado, accion primaria.
 */
export function EmptyState({
  icon = "▦",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
      <div className="grid size-11 place-items-center rounded-xl border border-border text-muted">
        {icon}
      </div>
      <h4 className="text-base font-semibold">{title}</h4>
      {description ? (
        <p className="max-w-sm text-sm text-muted">{description}</p>
      ) : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-1 rounded-full bg-fuchsia px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
