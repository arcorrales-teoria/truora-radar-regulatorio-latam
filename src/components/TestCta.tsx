"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SectionLines } from "@/components/SectionLines";
import { SectionTick } from "@/components/SectionTick";
import { Reveal } from "@/components/Reveal";
import { countries } from "@/lib/countries";
import { FINANCIAL_SUBCATEGORY_OPTIONS, getAssessment, type FinancialSubcategory } from "@/lib/assessment";
import { cn } from "@/lib/utils";

const LINES = [
  { d: "M -50 60 C 300 -10, 620 150, 980 50 S 1500 110, 1750 30", opacity: 0.28 },
  { d: "M -50 460 C 300 520, 620 400, 980 480 S 1480 430, 1750 490", opacity: 0.22 },
];

const FLAGS: Record<string, string> = { colombia: "🇨🇴", chile: "🇨🇱", peru: "🇵🇪", mexico: "🇲🇽" };

/**
 * País y sector se piden como dos pasos de SELECCIÓN (no links), a
 * propósito: antes el país era un <Link> que redirigía apenas se hacía
 * clic, así que el sector quedaba como un dato opcional que se saltaba
 * automáticamente si alguien elegía el país primero. Ahora ninguno de los
 * dos navega por sí solo — el único que redirige es el botón final, y solo
 * cuando ambos están elegidos.
 */
export default function TestCta() {
  const router = useRouter();
  const [country, setCountry] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<FinancialSubcategory | null>(null);

  const countryHasAssessment = country ? Boolean(getAssessment(country)) : false;
  const canContinue = country !== null && subcategory !== null && countryHasAssessment;

  const handleContinue = () => {
    if (!canContinue || !country || !subcategory) return;
    router.push(`/radar-regulatorio/${country}/assessment?industria=${subcategory}`);
  };

  return (
    <section id="test" className="relative overflow-hidden bg-white">
      <SectionLines lines={LINES} viewBox="0 0 1600 520" />
      <SectionTick />
      <div className="relative z-10 mx-auto max-w-[1560px] px-6 py-16 md:px-14 md:py-24 lg:px-20">
        <Reveal className="relative overflow-hidden rounded-[32px] bg-indigo-600 p-10 md:p-16">
          <div className="max-w-2xl">
            <span className="w-fit rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.08em] text-white uppercase">
              Regulatory Impact Assessment
            </span>
            <h2 className="mt-5 text-3xl leading-[1.1] font-medium text-white md:text-4xl">
              Conoce cómo tu empresa cumple con la regulación, según el país en el que operes
            </h2>
            <p className="mt-3 text-lg leading-[1.35] font-light text-white/70">
              Selecciona tu país y tu sector para empezar un diagnóstico corto y recibir hallazgos concretos, sin
              veredictos legales: solo brechas operativas claras.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-[0.08em] text-white/50 uppercase">1. Elige tu país</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {countries.map((c) => {
                const hasAssessment = Boolean(getAssessment(c.slug));
                const flag = FLAGS[c.slug] ?? "";
                const selected = country === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCountry(c.slug)}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-2xl border px-5 py-4 text-left transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.96]",
                      selected
                        ? "border-white bg-white/15"
                        : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10",
                    )}
                  >
                    <span className="text-lg">{flag}</span>
                    <span className="text-sm font-medium text-white">{c.name}</span>
                    {!hasAssessment && <span className="text-xs text-white/50">Próximamente</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-[0.08em] text-white/50 uppercase">
              2. Necesitamos saber el sector al que perteneces para saber qué leyes aplican
            </span>
            <div className="flex flex-wrap gap-2">
              {FINANCIAL_SUBCATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSubcategory(opt.value)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.96]",
                    subcategory === opt.value
                      ? "border-white bg-white text-indigo-600"
                      : "border-white/15 text-white/70 hover:border-white/30 hover:bg-white/5",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {country && !countryHasAssessment && (
            <p className="mt-4 text-sm text-amber-300">Todavía no tenemos el diagnóstico listo para ese país.</p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className={cn(
              "mt-8 inline-flex w-fit items-center gap-2 rounded-[10px] bg-white px-6 py-3 text-sm font-medium text-indigo-600 shadow-[0px_1px_1px_rgba(20,21,38,0.1),0px_6px_14px_-4px_rgba(0,0,0,0.25)] transition-[opacity,transform] duration-150 active:scale-[0.96]",
              !canContinue && "pointer-events-none opacity-40",
            )}
          >
            Ver mi diagnóstico
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
