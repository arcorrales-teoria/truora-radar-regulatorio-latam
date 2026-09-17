"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { countries } from "@/lib/countries";
import { lawsByCountry } from "@/lib/laws";
import { Reveal } from "@/components/Reveal";
import { SectionLines } from "@/components/SectionLines";
import { SectionTick } from "@/components/SectionTick";
import { cn } from "@/lib/utils";

const LINES = [
  { d: "M -50 80 C 320 10, 620 190, 980 70 S 1500 140, 1750 50", opacity: 0.26 },
  { d: "M -50 620 C 300 560, 620 700, 980 600 S 1480 680, 1750 600", opacity: 0.22 },
];

const FLAG: Record<string, string> = {
  colombia: "🇨🇴",
  chile: "🇨🇱",
  peru: "🇵🇪",
  mexico: "🇲🇽",
};

/**
 * Antes: 4 cards grandes (una por país, con foto editorial). Ahora: un
 * selector de país (mismo mecanismo de pills que `CountryTabs` en el Hero)
 * y, debajo, una grilla de cards de TEXTO (sin imagen) con las leyes de ese
 * país — pedido explícito del usuario, inspirado en una referencia con
 * pills de país + grid de cards de fuentes de datos.
 */
export default function CountryCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = countries[activeIndex];
  const activeLaws = lawsByCountry(active.slug);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-300 to-indigo-400">
      <SectionLines lines={LINES} viewBox="0 0 1600 700" />
      <SectionTick />
      <div className="relative z-10 mx-auto max-w-[1560px] px-6 py-16 md:px-14 md:py-24 lg:px-20">
        <Reveal className="mb-8 flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.08em] text-indigo-900 uppercase">Leyes que impactan a tu sector</span>
          <h2 className="text-3xl font-medium text-neutral-900 md:text-4xl">Un radar, todas las leyes de LATAM</h2>
          <p className="max-w-2xl text-base leading-relaxed font-light text-neutral-700">
            Sabemos que cada país en el que opera tu empresa tiene leyes totalmente distintas. Solo tienes que explorar
            para saber cómo te afectan y, sobre todo, qué debes tener en cuenta para prepararte y poder cumplir.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mb-8 flex flex-wrap gap-3">
          {countries.map((country, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={country.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-3 text-base font-medium shadow-sm transition-colors duration-150 active:scale-[0.96]",
                  isActive ? "bg-indigo-600 text-white" : "bg-white/85 text-neutral-700 hover:bg-white",
                )}
              >
                <span aria-hidden className="text-lg leading-none">
                  {FLAG[country.slug]}
                </span>
                {country.name}
                <span className={cn("text-sm", isActive ? "text-white/70" : "text-neutral-400")}>
                  {lawsByCountry(country.slug).length}
                </span>
              </button>
            );
          })}
        </Reveal>

        {activeLaws.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeLaws.map((law, i) => (
              <Reveal key={`${active.slug}-${law.slug}`} delay={i * 0.06}>
                <Link
                  href={`/radar-regulatorio/${active.slug}/${law.slug}`}
                  className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/50 bg-white/85 p-6 shadow-sm backdrop-blur-sm transition-shadow duration-300 ease-out hover:shadow-md"
                >
                  <div>
                    <p className="text-base font-semibold text-neutral-900">{law.nickname ?? law.name}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-snug text-neutral-600">{law.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    Ver detalle
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-600">Estamos terminando de investigar esta regulación. Vuelve pronto.</p>
        )}

        <Reveal delay={0.1} className="mt-8 flex justify-end">
          <Link
            href={`/radar-regulatorio/${active.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-800 hover:text-indigo-950"
          >
            Ver todo {active.name}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
