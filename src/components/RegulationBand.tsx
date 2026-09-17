"use client";

import { useReducedMotion } from "motion/react";
import { SectionTick } from "@/components/SectionTick";
import { DashedFrame } from "@/components/DashedFrame";

const MESSAGE = "Ayudando a cumplir la regulación desde los procesos";
const REPEATS = Array.from({ length: 6 });

// Mismo inset que usan los PageRails (left-3/md:left-7/lg:left-10): los
// lados verticales del cuadro terminan exactamente donde pasan las líneas
// verticales de la página. El marco usa `DashedFrame` (mismo ritmo de dash
// exacto que el resto de líneas del sitio) en vez del `border-dashed`
// nativo de CSS, que se veía con un patrón distinto — y es estático a
// propósito: lo único que se mueve es el texto del marquee adentro.
const RAIL_INSET = "mx-3 md:mx-7 lg:mx-10";
const BOX = `overflow-hidden ${RAIL_INSET}`;

function MessageGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {REPEATS.map((_, i) => (
        <span key={i} className="flex shrink-0 items-center gap-10">
          <span className="text-base font-semibold tracking-[0.08em] text-indigo-900 uppercase">{MESSAGE}</span>
          <span className="text-indigo-400" aria-hidden>
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export function RegulationBand() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="relative bg-indigo-200">
        <SectionTick />
        <DashedFrame className={BOX}>
          <p className="px-6 py-8 text-center text-base font-semibold tracking-[0.08em] text-indigo-900 uppercase">{MESSAGE}</p>
        </DashedFrame>
      </div>
    );
  }

  return (
    <div className="relative bg-indigo-200 py-8">
      <SectionTick />
      <DashedFrame className={BOX}>
        <div className="flex w-max animate-[marquee_38s_linear_infinite] pl-6">
          <MessageGroup />
          <MessageGroup hidden />
        </div>
      </DashedFrame>
    </div>
  );
}
