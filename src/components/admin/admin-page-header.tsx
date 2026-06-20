import Link from "next/link";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Accion principal. Con `href` es un enlace; sin el, queda "Pronto". */
  action?: {
    label: string;
    href?: string;
  };
  children?: ReactNode;
};

/**
 * Encabezado consistente para las pantallas del admin: eyebrow, titulo,
 * descripcion y una accion opcional a la derecha. La accion es visual (el CRUD
 * real llega en una fase posterior), por eso se muestra deshabilitada con la
 * etiqueta "Pronto".
 */
export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-muted">{description}</p>
        ) : null}
      </div>
      {action?.href ? (
        <Link
          href={action.href}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-fuchsia px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {action.label}
        </Link>
      ) : action ? (
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Disponible en una fase posterior"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-muted"
        >
          {action.label}
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-amber">
            Pronto
          </span>
        </button>
      ) : null}
      {children}
    </div>
  );
}
