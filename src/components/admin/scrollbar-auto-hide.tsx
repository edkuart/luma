"use client";

import { useEffect } from "react";

/**
 * Muestra la scrollbar de los contenedores `.luma-scroll` solo mientras el
 * usuario se desplaza, y la oculta tras un breve período de inactividad.
 * El estilo de aparición/ocultado vive en globals.css (clase `.is-scrolling`);
 * este componente solo conmuta la clase. Se monta una vez por layout.
 */
export function ScrollbarAutoHide() {
  useEffect(() => {
    const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

    function handleScroll(event: Event) {
      const el = event.target;
      if (!(el instanceof HTMLElement) || !el.classList.contains("luma-scroll")) {
        return;
      }

      el.classList.add("is-scrolling");
      const previous = timers.get(el);
      if (previous) {
        clearTimeout(previous);
      }
      timers.set(
        el,
        setTimeout(() => el.classList.remove("is-scrolling"), 800),
      );
    }

    // `scroll` no burbujea: hay que escuchar en fase de captura.
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, []);

  return null;
}
