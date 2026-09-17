"use client";

import { useReducedMotion } from "motion/react";
import { SectionTick } from "@/components/SectionTick";

const MESSAGE = "Ayudando a cumplir la regulación desde los procesos";
const REPEATS = Array.from({ length: 6 });

// Mismo inset que usan los PageRails (left-3/md:left-7/lg:left-10): el
// contenido termina exactamente donde pasan las líneas verticales de la
// página. Ya no lleva su propio marco (`SolidFrame`): con el divisor
// horizontal de `SectionTick` arriba, el marco propio quedaba como una
// segunda línea pegada a la primera ("bandas" redundantes). Estático a
// propósito: lo único que se mueve es el texto del marquee adentro.
const RAIL_INSET = "mx-3 md:mx-7 lg:mx-10";

function MessageGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {REPEATS.map((_, i) => (
        <span key={i} className="flex shrink-0 items-center gap-10">
          <span className="text-2xl font-semibold tracking-[0.04em] text-white uppercase">{MESSAGE}</span>
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
      <div className="relative bg-[#01022e]">
        <SectionTick />
        <p className={`${RAIL_INSET} px-6 py-12 text-center text-2xl font-semibold tracking-[0.04em] text-white uppercase`}>
          {MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#01022e] py-12">
      <SectionTick />
      <div className={`${RAIL_INSET} overflow-hidden`}>
        <div className="flex w-max animate-[marquee_38s_linear_infinite] pl-6">
          <MessageGroup />
          <MessageGroup hidden />
        </div>
      </div>
    </div>
  );
}
