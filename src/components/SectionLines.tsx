import { cn } from "@/lib/utils";

/**
 * Versión liviana de HeroLines para dar continuidad a la textura de líneas
 * en el resto de las secciones (no solo el Hero) — mismo color/idioma
 * visual (#818cf8, el indigo-400 de las conexiones de LatamMap), pero más
 * discreta: menos elementos, pensada para vivir detrás de contenido con su
 * propio fondo sólido (cards, banners) en vez de ser la protagonista.
 * Trazos continuos (no punteados), mismo criterio que HeroLines/PageRails.
 */

const LINE = "#4338ca"; // indigo-700: mismo ajuste que HeroLines, para contrastar sobre los fondos indigo-200/300/400 de estas secciones

interface FlowLine {
  d: string;
  opacity: number;
}

interface Ring {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

export function SectionLines({
  lines,
  rings = [],
  viewBox = "0 0 1600 500",
  className,
}: {
  lines: FlowLine[];
  rings?: Ring[];
  viewBox?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full select-none", className)}
      aria-hidden
    >
      {rings.map((ring, i) => (
        <circle key={`ring-${i}`} cx={ring.cx} cy={ring.cy} r={ring.r} fill="none" stroke={LINE} strokeOpacity={ring.opacity} strokeWidth={0.75} />
      ))}

      {lines.map((line, i) => (
        <path key={`flow-${i}`} d={line.d} fill="none" stroke={LINE} strokeOpacity={line.opacity} strokeWidth={0.75} strokeLinecap="round" />
      ))}
    </svg>
  );
}
