"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Dos líneas verticales que corren de punta a punta de la página (desde el
 * Hero hasta el Footer, no solo dentro de una sección), alineadas con el
 * mismo padding lateral que usan todos los contenedores (`px-6 md:px-14
 * lg:px-20`). Viven dentro de un wrapper `relative` que envuelve TODAS las
 * secciones en `page.tsx`, así que un `absolute inset-y-0` sobre ellas
 * automáticamente estira al alto real del documento, sin necesidad de medir
 * nada por JS. El punteado "fluye" con un `background-position` animado en
 * vez de SVG, porque a diferencia de una curva, una línea recta de alto
 * dinámico/desconocido no necesita viewBox.
 */

function Rail({ className }: { className: string }) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 z-20 w-px",
        !reduced && "animate-[rail-flow_7s_linear_infinite]",
        className,
      )}
      style={{
        backgroundImage: "repeating-linear-gradient(to bottom, rgba(67,56,202,0.65) 0px, rgba(67,56,202,0.65) 5px, transparent 5px, transparent 14px)",
      }}
    />
  );
}

export function PageRails() {
  return (
    <>
      <Rail className="left-3 md:left-7 lg:left-10" />
      <Rail className="right-3 md:right-7 lg:right-10" />
    </>
  );
}
