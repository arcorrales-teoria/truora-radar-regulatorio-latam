"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Versión liviana de HeroLines para dar continuidad a la textura de líneas
 * en el resto de las secciones (no solo el Hero) — mismo color/idioma
 * visual (#818cf8, el indigo-400 de las conexiones de LatamMap), pero más
 * discreta: menos elementos, pensada para vivir detrás de contenido con su
 * propio fondo sólido (cards, banners) en vez de ser la protagonista.
 */

const LINE = "#4338ca"; // indigo-700: mismo ajuste que HeroLines, para contrastar sobre los fondos indigo-200/300/400 de estas secciones

interface FlowLine {
  d: string;
  dash: number;
  gap: number;
  duration: string;
  opacity: number;
}

interface Ring {
  cx: number;
  cy: number;
  r: number;
  dashed: boolean;
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
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full select-none", className)}
      aria-hidden
    >
      {rings.map((ring, i) => (
        <circle
          key={`ring-${i}`}
          cx={ring.cx}
          cy={ring.cy}
          r={ring.r}
          fill="none"
          stroke={LINE}
          strokeOpacity={ring.opacity}
          strokeWidth={0.75}
          strokeDasharray={ring.dashed ? "3 7" : undefined}
        />
      ))}

      {lines.map((line, i) => {
        const period = line.dash + line.gap;
        return (
          <path
            key={`flow-${i}`}
            d={line.d}
            fill="none"
            stroke={LINE}
            strokeOpacity={line.opacity}
            strokeWidth={0.75}
            strokeLinecap="round"
            strokeDasharray={`${line.dash} ${line.gap}`}
          >
            {!reduced && (
              <animate attributeName="stroke-dashoffset" from="0" to={-period} dur={line.duration} repeatCount="indefinite" />
            )}
          </path>
        );
      })}
    </svg>
  );
}
