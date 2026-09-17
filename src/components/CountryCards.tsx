import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { countries } from "@/lib/countries";
import { Reveal } from "@/components/Reveal";
import { SectionLines } from "@/components/SectionLines";
import { SectionTick } from "@/components/SectionTick";

const LINES = [
  { d: "M -50 80 C 320 10, 620 190, 980 70 S 1500 140, 1750 50", dash: 6, gap: 10, duration: "10s", opacity: 0.26 },
  { d: "M -50 620 C 300 560, 620 700, 980 600 S 1480 680, 1750 600", dash: 5, gap: 12, duration: "12s", opacity: 0.22 },
];

/**
 * Las imágenes ya traen el título y los badges integrados (fotografía
 * editorial 1:1), así que la card no repite ese texto encima: solo un
 * pie de página compacto con el nombre, el teaser y el CTA. El zoom
 * sutil de la imagen al hover (scale 1 -> 1.04, easing fuerte de salida,
 * NUNCA `ease-in`) y el levantamiento de la card son el único movimiento,
 * criterio de Emil Kowalski: transform/opacity nada más, nunca `transition: all`.
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {countries.map((country, i) => (
            <Reveal key={country.slug} delay={i * 0.08}>
              <Link
                href={`/radar-regulatorio/${country.slug}`}
                className="group block overflow-hidden rounded-[28px] border border-white/40 bg-white/75 shadow-sm backdrop-blur-md transition-shadow duration-300 ease-out hover:shadow-xl"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={country.image}
                    alt={`Radar regulatorio ${country.name}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex items-start justify-between gap-4 px-6 py-5">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-neutral-900">{country.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-snug text-neutral-600">{country.teaser}</p>
                  </div>
                  <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    Explorar
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
