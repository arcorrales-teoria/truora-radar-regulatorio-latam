"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { countries } from "@/lib/countries";
import { Reveal } from "@/components/Reveal";
import { SectionLines } from "@/components/SectionLines";
import { SectionTick } from "@/components/SectionTick";
import { ShiftCard } from "@/components/ui/shift-card";

const LINES = [
  { d: "M -50 80 C 320 10, 620 190, 980 70 S 1500 140, 1750 50", dash: 6, gap: 10, duration: "10s", opacity: 0.26 },
  { d: "M -50 620 C 300 560, 620 700, 980 600 S 1480 680, 1750 600", dash: 5, gap: 12, duration: "12s", opacity: 0.22 },
];

const FLAG: Record<string, string> = {
  colombia: "🇨🇴",
  chile: "🇨🇱",
  peru: "🇵🇪",
  mexico: "🇲🇽",
};

/**
 * Card "ShiftCard" (referencia del usuario, adaptada en
 * `components/ui/shift-card.tsx`): la foto editorial vive centrada y
 * grande hasta el hover, momento en que se encoge a una miniatura arriba a
 * la derecha (mismo elemento vía `layoutId`, animación de layout
 * compartida, no un crossfade) mientras un cajón inferior indigo se
 * expande revelando nombre + teaser + CTA. En reposo ese cajón solo asoma
 * 38px (una franja), suficiente para insinuar que hay más.
 */
export default function CountryCards() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-300 to-indigo-400">
      <SectionLines lines={LINES} viewBox="0 0 1600 700" />
      <SectionTick />
      <div className="relative z-10 mx-auto max-w-[1560px] px-6 py-16 md:px-14 md:py-24 lg:px-20">
        <Reveal className="mb-10 flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.08em] text-indigo-900 uppercase">Explora por país</span>
          <h2 className="text-3xl font-medium text-neutral-900 md:text-4xl">Señales activas por país</h2>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-6">
          {countries.map((country, i) => (
            <Reveal key={country.slug} delay={i * 0.08}>
              <Link href={`/radar-regulatorio/${country.slug}`} className="block">
                <ShiftCard
                  initial={false}
                  topContent={
                    <div className="flex items-center gap-2">
                      <span className="text-xl leading-none">{FLAG[country.slug]}</span>
                      <span className="text-sm font-semibold text-neutral-900">{country.name}</span>
                    </div>
                  }
                  topAnimateContent={
                    <>
                      <motion.img
                        transition={{ duration: 0.3, ease: "circIn" }}
                        src={country.image}
                        layoutId={`country-photo-${country.slug}`}
                        width={78}
                        height={78}
                        alt=""
                        className="absolute top-1.5 right-2 h-[70px] w-[70px] rounded-sm object-cover shadow-lg"
                      />
                      <motion.div
                        className="mb-[6px] ml-auto h-[78px] w-[82px] rounded-sm rounded-br-sm border-[2px] border-dashed border-indigo-500/60 bg-transparent absolute top-[4px] right-[6px]"
                        initial={{ opacity: 0, scale: 1.6, y: 0, filter: "blur(4px)" }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: { delay: 0.35, duration: 0.15 },
                        }}
                        exit={{ opacity: 0, y: 100, filter: "blur(4px)", transition: { delay: 0, duration: 0 } }}
                      />
                    </>
                  }
                  middleContent={
                    <motion.img
                      src={country.image}
                      layoutId={`country-photo-${country.slug}`}
                      width={150}
                      height={150}
                      alt={`Radar regulatorio ${country.name}`}
                      className="rounded-lg border-2 border-white object-cover shadow-sm"
                    />
                  }
                  bottomContent={
                    <div className="pb-4">
                      <div className="flex w-full flex-col gap-1 rounded-t-lg border-t border-t-black/10 bg-indigo-900/95 px-4 pb-4">
                        <p className="pt-2.5 text-[14px] font-semibold text-white">{country.name}</p>
                        <p className="line-clamp-2 text-pretty text-[13px] leading-4 text-indigo-100/75">{country.teaser}</p>
                        <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 group-hover:bg-white/20">
                          Explorar
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        </span>
                      </div>
                    </div>
                  }
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
