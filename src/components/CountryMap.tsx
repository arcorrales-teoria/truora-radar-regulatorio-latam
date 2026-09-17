"use client";

import { useMemo } from "react";
import DottedMap from "dotted-map";

/**
 * "Croquis" de un solo país — mismo lenguaje visual que el mapa de LATAM
 * del Hero (dotted-map + pin sólido), pero recortado a un único país
 * (`countries: [code]` sin `region`, así dotted-map calcula el bounding
 * box natural de ESE país solo). La altura es la dimensión fija/definida y
 * el ancho se deriva vía `aspectRatio` — a propósito, porque cada país
 * tiene una proporción real muy distinta (Chile sale angosto y alto,
 * México sale ancho) y forzar un ancho fijo lo distorsionaría.
 */

const DOT_COLOR = "rgba(67,56,202,0.35)"; // mismo indigo-700 que el resto de líneas del sitio
const PIN_COLOR = "#4f46e5"; // indigo-600, mismo tono que el pin del mapa LATAM

export function CountryMap({ code, lat, lng, height = 340 }: { code: string; lat: number; lng: number; height?: number }) {
  const { svg, viewBox, pin } = useMemo(() => {
    const map = new DottedMap({ height: 130, grid: "diagonal", countries: [code] });
    const rendered = map.getSVG({ radius: 0.35, color: DOT_COLOR, shape: "circle", backgroundColor: "transparent" });
    const vb = rendered.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 100 100";
    return { svg: rendered, viewBox: vb, pin: map.getPin({ lat, lng }) };
  }, [code, lat, lng]);

  const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
  const unit = vbWidth / 100;

  return (
    <div className="relative" style={{ height, aspectRatio: `${vbWidth} / ${vbHeight}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
        className="pointer-events-none h-full w-full select-none"
        alt=""
        aria-hidden
        draggable={false}
      />
      {pin && (
        <svg viewBox={viewBox} className="pointer-events-none absolute inset-0 h-full w-full select-none" aria-hidden>
          <circle cx={pin.x} cy={pin.y} r={1.5 * unit} fill={PIN_COLOR} />
        </svg>
      )}
    </div>
  );
}
