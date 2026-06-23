import Link from "next/link";
import type { ReactNode } from "react";
import { adminButton } from "@/components/admin/admin-button";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Accion principal a la derecha (enlace). */
  action?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
};

/**
 * Encabezado consistente para las pantallas del admin: eyebrow, titulo,
 * descripcion y una accion principal opcional a la derecha.
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
      {action ? (
        <Link href={action.href} className={`${adminButton("primary")} shrink-0`}>
          {action.label}
        </Link>
      ) : null}
      {children}
    </div>
  );
}
