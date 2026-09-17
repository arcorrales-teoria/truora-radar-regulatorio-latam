import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marco de línea continua (sólida, no punteada) en las 4 direcciones,
 * mismo color que `PageRails.tsx` (indigo-700 al 65%) — reutilizable para
 * cualquier caja que deba leerse como "parte del mismo lenguaje de líneas"
 * del sitio. Antes era un marco punteado (`DashedFrame`); se reemplazó
 * porque el usuario prefirió las líneas continuas del nuevo divisor de
 * sección sobre el punteado que tenía el resto del sitio.
 */
const LINE = "rgba(67,56,202,0.65)";

export function SolidFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ backgroundColor: LINE }} />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ backgroundColor: LINE }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px" style={{ backgroundColor: LINE }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px" style={{ backgroundColor: LINE }} />
      {children}
    </div>
  );
}
