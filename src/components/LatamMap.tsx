"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import DottedMap from "dotted-map";

/**
 * Mapa de puntos de LATAM. Las conexiones entre países son líneas
 * punteadas MUY finas que fluyen todo el tiempo (stroke-dashoffset
 * animado con SMIL nativo, offset = -(un período completo del patrón de
 * puntos) para que el loop sea perfectamente continuo, sin salto visible
 * al reiniciar). Se abandonó el diseño anterior (línea base estática +
 * resaltado que viaja de país en país con keyframes orquestados): esa
 * línea base "de respaldo" quedaba visible todo el tiempo como un
 * guardrail de fondo, que es justo lo que se pidió quitar. Con un patrón
 * de puntos en movimiento continuo no hace falta ningún respaldo estático:
 * siempre hay algo visible, sin depender de temporizaciones frágiles.
 */

export interface MapRegion {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
}

export interface MapStop {
  code: string; // ISO 3166-1 alpha-3, debe existir en countries.geo.json de dotted-map
  name: string;
  lat: number;
  lng: number;
  signals: string[];
  labelSide?: "left" | "right";
}

interface LatamMapProps {
  stops: MapStop[];
  region?: MapRegion;
  /** Altura interna del grid de puntos (más alto = mapa más grande/detallado). */
  mapHeight?: number;
  /** Índice de la parada actualmente "activa" (la resalta, sin animación orquestada). */
  activeIndex?: number;
}

const DIM_COUNTRY_COLOR = "rgba(67, 56, 202, 0.55)"; // indigo-700, más visible que antes (el fondo de la sección se volvió más saturado y el 0.30 anterior casi no se veía)
const ACTIVE_COUNTRY_COLOR = "#4338ca"; // indigo-700, un poco más oscuro para que el salto activo/inactivo siga siendo claro incluso con el dim ya más fuerte
const BG_DOT_COLOR = "rgba(67, 56, 202, 0.22)"; // antes casi negro al 10%, se perdía contra el fondo índigo — ahora mismo tono que el resto del mapa, más presente

export default function LatamMap({ stops, region, mapHeight = 130, activeIndex }: LatamMapProps) {
  const reduced = useReducedMotion();

  const { bgSvg, viewBox, project, countryPoints } = useMemo(() => {
    const baseMap = new DottedMap({ height: mapHeight, grid: "diagonal", ...(region ? { region } : {}) });
    const rendered = baseMap.getSVG({
      radius: 0.24,
      color: BG_DOT_COLOR,
      shape: "circle",
      backgroundColor: "transparent",
    });
    const vb = rendered.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 800 400";
    const projectFn = (lat: number, lng: number) => {
      const pin = baseMap.getPin({ lat, lng });
      return { x: pin?.x ?? 0, y: pin?.y ?? 0 };
    };

    // Un DottedMap por país objetivo, compartiendo la misma región + altura
    // que el mapa base para que sus puntos caigan en el mismo sistema de
    // coordenadas: así se puede iluminar el clúster real de ese país.
    const perCountry = new Map<string, { x: number; y: number }[]>();
    for (const stop of stops) {
      if (perCountry.has(stop.code)) continue;
      const countryMap = new DottedMap({
        height: mapHeight,
        grid: "diagonal",
        ...(region ? { region } : {}),
        countries: [stop.code],
      });
      perCountry.set(
        stop.code,
        countryMap.getPoints().map((p) => ({ x: p.x, y: p.y })),
      );
    }

    return { bgSvg: rendered, viewBox: vb, project: projectFn, countryPoints: perCountry };
  }, [region, stops, mapHeight]);

  const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
  const unit = vbWidth / 100;

  const projectedStops = useMemo(
    () => stops.map((stop) => ({ ...stop, ...project(stop.lat, stop.lng) })),
    [stops, project],
  );

  const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const lift = Math.max(6 * unit, Math.hypot(end.x - start.x, end.y - start.y) * 0.25);
    const midY = Math.min(start.y, end.y) - lift;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const dash = 1.1 * unit;
  const gap = 3.2 * unit;
  const period = dash + gap;

  return (
    <div className="relative mx-auto w-full" style={{ aspectRatio: `${vbWidth} / ${vbHeight}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(bgSvg)}`}
        className="pointer-events-none h-full w-full select-none"
        alt=""
        aria-hidden
        draggable={false}
      />

      <svg
        viewBox={viewBox}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        role="img"
        aria-label="Mapa de LATAM: conexiones entre México, Colombia, Perú y Chile"
      >
        {/* Clúster de puntos por país objetivo: se enciende cuando le toca el turno */}
        {projectedStops.map((stop, i) => {
          const points = countryPoints.get(stop.code) ?? [];
          const isActive = activeIndex !== undefined && activeIndex === i;
          return (
            <motion.g
              key={`country-${stop.code}`}
              animate={{ color: isActive ? ACTIVE_COUNTRY_COLOR : DIM_COUNTRY_COLOR }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {points.map((p, pi) => (
                <circle key={pi} cx={p.x} cy={p.y} r={0.22 * unit} fill="currentColor" />
              ))}
            </motion.g>
          );
        })}

        {/* Conexiones: puntos que fluyen sin parar, sin ninguna línea de respaldo detrás */}
        {projectedStops.map((stop, i) => {
          const next = projectedStops[(i + 1) % projectedStops.length];
          return (
            <path
              key={`arc-${i}`}
              d={createCurvedPath(stop, next)}
              fill="none"
              stroke="#818cf8"
              strokeLinecap="round"
              strokeOpacity={0.8}
              strokeWidth={0.16 * unit}
              strokeDasharray={`${dash} ${gap}`}
            >
              {!reduced && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to={-period}
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          );
        })}

        {/* Pin sólido en cada parada, más grande si es la parada activa */}
        {projectedStops.map((stop, i) => {
          const isActive = activeIndex !== undefined && activeIndex === i;
          return (
            <motion.circle
              key={`pin-${stop.code}`}
              cx={stop.x}
              cy={stop.y}
              r={0.75 * unit}
              fill="#4f46e5"
              animate={{ scale: isActive ? 1.8 : 1 }}
              style={{ transformOrigin: `${stop.x}px ${stop.y}px` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          );
        })}
      </svg>
    </div>
  );
}
