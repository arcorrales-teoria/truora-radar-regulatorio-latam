"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import useMeasure from "react-use-measure";
import { ArrowUpRight } from "lucide-react";
import { countries } from "@/lib/countries";
import { lawsByCountry } from "@/lib/laws";

/**
 * Adaptado de la referencia "DirectionAwareTabs" que compartió el usuario:
 * misma mecánica (burbuja activa con `layoutId`, contenido que entra/sale
 * con blur + desplazamiento direccional, altura animada con
 * `react-use-measure`), pero el contenido de cada tab es un card grande y
 * legible con las leyes de ese país (antes esa información vivía en una
 * etiqueta diminuta sobre el mapa que casi no se alcanzaba a leer).
 *
 * Avanza sola cada `intervalMs` (sincronizada a ojo con el ciclo del mapa),
 * y notifica el índice activo hacia arriba (`onActiveChange`) para que el
 * mapa pueda iluminar el mismo país.
 */
export function CountryTabs({
  intervalMs = 4500,
  onActiveChange,
}: {
  intervalMs?: number;
  onActiveChange?: (index: number) => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();
  const reduced = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  useEffect(() => {
    onActiveChange?.(activeTab);
  }, [activeTab, onActiveChange]);

  useEffect(() => {
    if (reduced) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActiveTab((current) => (current + 1) % countries.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs, reduced, activeTab]);

  const variants = useMemo(
    () => ({
      initial: (dir: number) => ({ x: 40 * dir, opacity: 0, filter: "blur(4px)" }),
      active: { x: 0, opacity: 1, filter: "blur(0px)" },
      exit: (dir: number) => ({ x: -40 * dir, opacity: 0, filter: "blur(4px)" }),
    }),
    [],
  );

  const active = countries[activeTab];
  const activeLaws = lawsByCountry(active.slug);

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="flex w-fit gap-1 rounded-full bg-indigo-950 p-1 shadow-inner">
        {countries.map((country, index) => (
          <button
            key={country.slug}
            type="button"
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              goTo(index);
            }}
            className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
              activeTab === index ? "text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeTab === index && (
              <motion.span
                layoutId="country-tab-bubble"
                className="absolute inset-0 z-10 rounded-full bg-indigo-600"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-20">{country.name}</span>
          </button>
        ))}
      </div>

      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}>
        <motion.div className="relative overflow-hidden" initial={false} animate={{ height: bounds.height }}>
          <div ref={ref}>
            <AnimatePresence custom={direction} mode="popLayout" initial={false}>
              <motion.div
                key={active.slug}
                custom={direction}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
              >
                <div className="rounded-3xl bg-indigo-950 p-6">
                  <p className="text-base leading-6 text-white">
                    <span className="font-semibold">{active.name}.</span>{" "}
                    <span className="text-white/60">{active.teaser}</span>
                  </p>

                  {activeLaws.length > 0 ? (
                    <ul className="mt-4 flex flex-col gap-2">
                      {activeLaws.map((law) => (
                        <li key={law.slug}>
                          <Link
                            href={`/radar-regulatorio/${active.slug}/${law.slug}`}
                            className="group flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                          >
                            <span className="text-sm font-medium text-white">{law.nickname ?? law.name}</span>
                            <ArrowUpRight
                              className="size-4 shrink-0 text-white/50 transition-transform group-hover:translate-x-0.5"
                              aria-hidden
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-white/50">Próximamente</p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  );
}
