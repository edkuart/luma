"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  /** Elemento a renderizar. Por defecto un div. */
  as?: ElementType;
  /** Retardo en ms para escalonar (stagger) varios reveals. */
  delay?: number;
  className?: string;
};

/**
 * Revela su contenido con un fade + translateY cuando entra al viewport.
 *
 * La animacion vive en CSS (.reveal / .is-visible en globals.css), regida por
 * los tokens de motion y desactivada por `prefers-reduced-motion`. Aqui solo se
 * detecta la entrada al viewport con IntersectionObserver (una sola vez) y se
 * agrega la clase. El estado se actualiza dentro del callback del observer, no
 * de forma sincrona en el cuerpo del efecto.
 */
export function Reveal({ children, as, delay = 0, className }: RevealProps) {
  const Tag = as ?? "div";
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={
        delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}
