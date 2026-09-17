"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleCheck, RefreshCw, Users, TriangleAlert } from "lucide-react";
import type { Law } from "@/lib/laws";
import type { CountryData } from "@/lib/countries";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

/**
 * Inspirado en `onboarding_dashboard/src/components/dashboard/validation-reel.tsx`
 * (mismo mecanismo: lista de pasos numerada a la izquierda sincronizada con
 * una "escena" animada a la derecha — tarjeta blanca sobre degradado índigo
 * + píldora oscura flotante), pero NO es el mismo componente ni el mismo
 * guion: acá los "pasos" son los 3 campos de cada ley (Qué cambió / A quién
 * afecta / Impacto) y la escena muestra el hallazgo real en vez de un mock
 * de validación de identidad.
 */

const FIELD_META = {
  whatChanged: { icon: RefreshCw, label: "Qué cambió" },
  whoItAffects: { icon: Users, label: "A quién afecta" },
  impact: { icon: TriangleAlert, label: "Impacto en el corto plazo" },
} as const;

const STEP_LABELS: string[] = Object.values(FIELD_META).map((m) => m.label);

interface Phase {
  id: string;
  step: string;
  icon: (typeof FIELD_META)[keyof typeof FIELD_META]["icon"];
  lawName: string;
  text: string;
}

const PHASE_MS = 4200;

export function LawShowcase({ country, laws, children }: { country: CountryData; laws: Law[]; children: ReactNode }) {
  const reduced = useReducedMotion();

  const phases = useMemo<Phase[]>(() => {
    const items: Phase[] = [];
    for (const law of laws) {
      (Object.keys(FIELD_META) as (keyof typeof FIELD_META)[]).forEach((field) => {
        const text = law[field];
        if (text) {
          items.push({
            id: `${law.slug}-${field}`,
            step: FIELD_META[field].label,
            icon: FIELD_META[field].icon,
            lawName: law.nickname ?? law.name,
            text,
          });
        }
      });
    }
    return items;
  }, [laws]);

  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced || phases.length <= 1) return;
    const timer = window.setInterval(() => setPhase((p) => (p + 1) % phases.length), PHASE_MS);
    return () => window.clearInterval(timer);
  }, [reduced, phases.length]);

  const current = phases.length > 0 ? phases[phase % phases.length] : null;
  const activeStep = current ? STEP_LABELS.indexOf(current.step) : -1;
  const Icon = current?.icon;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
      <div className="max-w-2xl">
        {children}

        {current && (
          <ol className="mt-8 space-y-2">
            {STEP_LABELS.map((label, index) => {
              const isActive = index === activeStep;
              const isDone = index < activeStep;
              return (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-300",
                    isActive ? "bg-indigo-50 font-medium text-indigo-700" : isDone ? "text-neutral-700" : "text-neutral-500",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                      isActive ? "bg-indigo-600 text-white" : isDone ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {isDone ? <CircleCheck className="size-3.5" aria-hidden /> : <span className="font-mono text-[11px]">{index + 1}</span>}
                  </span>
                  {label}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {current && Icon && (
        <figure className="relative mx-auto w-full max-w-[440px] lg:mr-[-24px] lg:max-w-none xl:mr-[-40px]">
          <div className="relative aspect-[564/404] overflow-hidden rounded-2xl border border-neutral-200/80 shadow-[0px_1px_1px_rgba(20,21,38,0.06),0px_16px_32px_-12px_rgba(38,36,110,0.3),inset_0px_1px_0px_rgba(255,255,255,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-indigo-400 to-indigo-700" />
            <div
              className="absolute inset-0 opacity-40 mix-blend-soft-light"
              style={{ background: "radial-gradient(120% 90% at 20% 10%, rgba(255,255,255,0.9), transparent 55%)" }}
              aria-hidden
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-[0px_20px_40px_-16px_rgba(30,27,110,0.5),inset_0px_1px_0px_rgba(255,255,255,0.9)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">{current.lawName}</h3>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em] text-indigo-600 uppercase">
                    {country.name}
                  </span>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-neutral-600">{current.text}</p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`pill-${current.id}`}
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="absolute left-1/2 top-[15%] z-10 -translate-x-1/2"
              >
                <span className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-neutral-950/95 py-2 pl-2.5 pr-5 text-[13px] font-medium text-white shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.5),inset_0px_1px_0px_rgba(255,255,255,0.18)]">
                  <Icon className="size-4 text-indigo-300" strokeWidth={1.75} aria-hidden />
                  {current.step}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <figcaption className="mt-2.5 text-center font-mono text-[11px] text-neutral-500">Radar regulatorio · {country.name}</figcaption>
        </figure>
      )}
    </div>
  );
}
