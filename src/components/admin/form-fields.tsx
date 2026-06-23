import type { ReactNode } from "react";

// Clases base compartidas por todos los formularios del admin. Antes vivian
// duplicadas en cada form/pantalla.
// `w-full min-w-0` evita que los inputs desborden su columna en grids estrechos
// (los items de grid/flex tienen min-width:auto por defecto y no encogen).
export const fieldClass =
  "w-full min-w-0 rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-cyan";

export const labelClass = "grid min-w-0 gap-2 text-sm font-medium";

/**
 * Campo etiquetado consistente: <Field label="Titulo"><input .../></Field>.
 * El `children` recibe el control (input/select/textarea) con `fieldClass`.
 */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className={labelClass}>
      <span>
        {label}
        {hint ? (
          <span className="ml-1 font-normal text-muted">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}
