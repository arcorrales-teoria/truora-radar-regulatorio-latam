"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import LatamMap, { type MapStop } from "@/components/LatamMap";
import { CountryTabs } from "@/components/CountryTabs";
import { TextWordReveal } from "@/components/motion/text-word-reveal";
import { SectionTick } from "@/components/SectionTick";
import { LinkButton } from "@/components/ui/texture-button";
import { RadarAlertBar } from "@/components/RadarAlertBar";

// Mismo orden que `countries` en lib/countries.ts (colombia, chile, peru,
// mexico): así el índice activo de CountryTabs se puede pasar tal cual a
// LatamMap para iluminar el mismo país en los dos componentes a la vez.
const STOPS: MapStop[] = [
  { code: "COL", name: "Colombia", lat: 4.711, lng: -74.0721, signals: [] },
  { code: "CHL", name: "Chile", lat: -33.4489, lng: -70.6693, signals: [] },
  { code: "PER", name: "Perú", lat: -12.0464, lng: -77.0428, signals: [] },
  { code: "MEX", name: "México", lat: 19.4326, lng: -99.1332, signals: [] },
];

const REGION = { lat: { min: -56, max: 34 }, lng: { min: -119, max: -34 } };

export default function Hero() {
  const [activeCountry, setActiveCountry] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#01022e]">
    <SectionTick />
    <div className="relative z-10 mx-auto flex max-w-[1560px] flex-col justify-center px-6 pt-24 pb-10 md:min-h-[86dvh] md:px-14 md:pt-28 md:pb-14 lg:px-20">
      <div className="flex flex-col items-start gap-10 md:flex-row md:gap-8">
        <div className="flex shrink-0 flex-col items-start gap-6 md:w-[380px] md:pt-4 lg:w-[420px]">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.08em] text-indigo-200 uppercase">
            Radar regulatorio LATAM
          </span>
          <h1 className="text-5xl leading-[1.02] font-medium text-white md:text-6xl lg:text-[76px] lg:leading-[1.0]">
            Radar de regulación
          </h1>
          <p className="max-w-xl text-xl leading-[1.35] font-light text-white/70 md:text-2xl">
            <TextWordReveal
              prefix="La página donde puedes entender todos los cambios regulatorios de LATAM y cómo afectan a tu"
              words={["industria.", "operación.", "cumplimiento.", "negocio."]}
              activeIndex={activeCountry}
            />
          </p>
          <CountryTabs onActiveChange={setActiveCountry} />

          {/*
            A propósito NO usa el país activo de la animación como destino:
            eso asumiría el país por el usuario según lo que esté rotando el
            mapa en ese instante, saltándose la selección explícita de país
            + industria que ya vive en el banner `TestCta` (`#test`) — justo
            el flujo "que las personas dejen los datos sutilmente" que se
            construyó a propósito. Este botón lleva ahí, no directo a un país.
          */}
          <LinkButton href="/radar-regulatorio#test" variant="minimal" size="lg" className="w-fit text-neutral-900">
            Ver mi diagnóstico
            <ArrowRight className="size-4" aria-hidden />
          </LinkButton>

          <RadarAlertBar />
        </div>

        <div className="relative w-full min-w-0 md:flex-1">
          <LatamMap stops={STOPS} region={REGION} activeIndex={activeCountry} />
        </div>
      </div>
    </div>
    </section>
  );
}
