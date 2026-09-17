"use client";

import { useMemo } from "react";
import DottedMap from "dotted-map";
import { cn } from "@/lib/utils";

/**
 * "Croquis" de un solo país — mismo lenguaje visual que el mapa de LATAM
 * del Hero (dotted-map + pin sólido), pero recortado a un único país
 * (`countries: [code]` sin `region`, así dotted-map calcula el bounding
 * box natural de ESE país solo).
 *
 * El tamaño de la CAJA lo decide quien llama al componente, vía
 * `className` (alto y ancho reales). El mapa siempre escala para LLENAR
 * esa caja (`object-contain`), sin importar la proporción real del país
 * (Chile sale angosto/alto, México sale ancho): antes el alto era fijo y
 * el ancho se derivaba de la proporción natural de cada país, lo que
 * dejaba el mapa chico flotando dentro de una zona de página mucho más
 * grande cuando esa proporción no calzaba con el espacio disponible.
 */
const DOT_COLOR = "rgba(67,56,202,0.35)"; // mismo indigo-700 que el resto de líneas del sitio
const PIN_COLOR = "#4f46e5"; // indigo-600, mismo tono que el pin del mapa LATAM

export function CountryMap({ code, lat, lng, className }: { code: string; lat: number; lng: number; className?: string }) {
  const { svg, viewBox, pin } = useMemo(() => {
    const map = new DottedMap({ height: 130, grid: "diagonal", countries: [code] });
    const rendered = map.getSVG({ radius: 0.35, color: DOT_COLOR, shape: "circle", backgroundColor: "transparent" });
    const vb = rendered.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 100 100";
    return { svg: rendered, viewBox: vb, pin: map.getPin({ lat, lng }) };
  }, [code, lat, lng]);

  const [, , vbWidth] = viewBox.split(" ").map(Number);
  const unit = vbWidth / 100;

  return (
    <div className={cn("relative", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none"
        alt=""
        aria-hidden
        draggable={false}
      />
      {pin && (
        <svg
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          aria-hidden
        >
          <circle cx={pin.x} cy={pin.y} r={1.5 * unit} fill={PIN_COLOR} />
        </svg>
      )}
    </div>
  );
}
