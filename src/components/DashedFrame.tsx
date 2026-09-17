import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marco punteado en las 4 direcciones con EXACTAMENTE el mismo ritmo de
 * dash/gap/color que `PageRails.tsx` (indigo-700 al 65%, dash 5px, gap 9px)
 * — reutilizable para cualquier caja que deba leerse como "parte del mismo
 * lenguaje de líneas" del sitio, no el `border-dashed` nativo de CSS (cuyo
 * patrón de dash es demasiado chico/denso y no coincide visualmente).
 * Estático a propósito: no usa la animación `rail-flow` de los rieles.
 */
const DASH = "rgba(67,56,202,0.65)";
const HORIZONTAL = `repeating-linear-gradient(to right, ${DASH} 0px, ${DASH} 5px, transparent 5px, transparent 14px)`;
const VERTICAL = `repeating-linear-gradient(to bottom, ${DASH} 0px, ${DASH} 5px, transparent 5px, transparent 14px)`;

export function DashedFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ backgroundImage: HORIZONTAL }} />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ backgroundImage: HORIZONTAL }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px" style={{ backgroundImage: VERTICAL }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px" style={{ backgroundImage: VERTICAL }} />
      {children}
    </div>
  );
}
