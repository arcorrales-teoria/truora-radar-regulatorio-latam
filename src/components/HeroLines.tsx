"use client";

import { useReducedMotion } from "motion/react";

/**
 * Textura de fondo del Hero: mismo lenguaje "constelación de datos" que las
 * imágenes editoriales de las cards por país (anillos orbitales finos, nodos
 * punteados, líneas que fluyen) pero recoloreado a un tono muy tenue que
 * funciona sobre el fondo claro del Hero, en vez de blanco sobre foto oscura.
 * Es ambiente, no protagonista: el mapa sigue siendo el elemento animado
 * principal de la sección.
 */

const LINE = "#4338ca"; // indigo-700: más oscuro que el indigo-400 de LatamMap a propósito — sobre los fondos indigo-100/200/300 de estas secciones un indigo-400 se veía "lavado", casi blanco

interface FlowLine {
  d: string;
  dash: number;
  gap: number;
  duration: string;
  opacity: number;
}

// Todo el contenido decorativo vive en x >= ~550 (el ~35% derecho del
// viewBox), que en desktop cae siempre dentro de la columna del mapa
// (`md:flex-1`), nunca en la columna fija de texto a la izquierda — así
// ninguna línea/anillo/nodo queda "pegado a las letras" del H1 o el
// subtítulo. En mobile, donde el texto ocupa todo el ancho arriba del
// mapa, el SVG completo se oculta (`hidden md:block` más abajo).
const FLOW_LINES: FlowLine[] = [
  { d: "M 500 120 C 700 40, 900 220, 1150 90 S 1550 160, 1750 60", dash: 6, gap: 10, duration: "8s", opacity: 0.38 },
  { d: "M 550 400 C 750 460, 950 320, 1150 420 S 1500 360, 1750 440", dash: 5, gap: 12, duration: "10s", opacity: 0.3 },
  { d: "M 650 -40 C 730 180, 600 380, 760 630", dash: 4, gap: 9, duration: "9s", opacity: 0.3 },
];

const RINGS = [
  { cx: 1420, cy: 140, r: 240, dashed: true, opacity: 0.26 },
  { cx: 1420, cy: 140, r: 340, dashed: false, opacity: 0.18 },
  { cx: 650, cy: 520, r: 150, dashed: true, opacity: 0.22 },
];

const NODES = [
  { x: 1150, y: 90 },
  { x: 1500, y: 160 },
  { x: 750, y: 460 },
  { x: 1150, y: 420 },
  { x: 620, y: 380 },
  { x: 1180, y: 380 },
];

const SQUARE_MARKERS = [
  { x: 1050, y: 60, s: 14 },
  { x: 570, y: 300, s: 12 },
];

export function HeroLines() {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 1600 650"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden h-full w-full select-none md:block"
      aria-hidden
    >
      {RINGS.map((ring, i) => (
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

      {FLOW_LINES.map((line, i) => {
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

      {NODES.map((node, i) => (
        <circle key={`node-${i}`} cx={node.x} cy={node.y} r={2.2} fill={LINE} fillOpacity={0.5} />
      ))}

      {SQUARE_MARKERS.map((m, i) => (
        <rect
          key={`square-${i}`}
          x={m.x - m.s / 2}
          y={m.y - m.s / 2}
          width={m.s}
          height={m.s}
          fill="none"
          stroke={LINE}
          strokeOpacity={0.32}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}
