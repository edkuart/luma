import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** Elemento HTML a renderizar. Por defecto un div. */
  as?: ElementType;
  className?: string;
};

/**
 * Contenedor centrado unico para todo el sitio publico.
 *
 * Centraliza el ancho maximo y el padding horizontal responsive para que
 * todas las secciones se alineen al mismo eje y respiren igual en cada
 * breakpoint. Las secciones aportan su propio padding vertical, fondo o
 * borde; este componente solo se encarga del centrado y los margenes
 * laterales.
 */
export function Container({ children, as, className }: ContainerProps) {
  const Tag = as ?? "div";
  return (
    <Tag className={`mx-auto w-full max-w-7xl px-5 sm:px-8${className ? ` ${className}` : ""}`}>
      {children}
    </Tag>
  );
}
