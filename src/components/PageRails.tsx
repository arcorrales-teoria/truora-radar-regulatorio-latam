import { cn } from "@/lib/utils";

/**
 * Dos líneas verticales continuas (sólidas, no punteadas) que corren de
 * punta a punta de la página (desde el Hero hasta el Footer, no solo
 * dentro de una sección), alineadas con el mismo padding lateral que usan
 * todos los contenedores (`px-6 md:px-14 lg:px-20`). Viven dentro de un
 * wrapper `relative` que envuelve TODAS las secciones en `page.tsx`, así
 * que un `absolute inset-y-0` sobre ellas automáticamente estira al alto
 * real del documento, sin necesidad de medir nada por JS.
 */

function Rail({ className }: { className: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute inset-y-0 z-20 w-px bg-indigo-400/50", className)} />;
}

export function PageRails() {
  return (
    <>
      <Rail className="left-3 md:left-7 lg:left-10" />
      <Rail className="right-3 md:right-7 lg:right-10" />
    </>
  );
}
