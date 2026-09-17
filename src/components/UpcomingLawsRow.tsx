import { ArrowRight } from "lucide-react";
import { upcomingLaws } from "@/lib/laws";
import { LawCountdownCard } from "@/components/LawCountdownCard";
import { Reveal } from "@/components/Reveal";
import { SectionLines } from "@/components/SectionLines";
import { SectionTick } from "@/components/SectionTick";
import { LinkButton } from "@/components/ui/texture-button";

const LINES = [
  { d: "M -50 40 C 300 -30, 650 130, 1000 30 S 1500 90, 1750 10", opacity: 0.3 },
  { d: "M -50 260 C 280 340, 600 190, 950 290 S 1450 230, 1750 310", opacity: 0.24 },
];

/**
 * Antes vivía apretada al fondo del Hero, como un anexo con solo un
 * eyebrow diminuto de título. Ahora es su propia sección (con el mismo
 * peso visual que "Señales activas por país"): divisor de sección,
 * padding generoso, y un H2 real en vez de solo el eyebrow.
 */
export function UpcomingLawsRow() {
  const laws = upcomingLaws();
  if (laws.length === 0) return null;

  return (
    <section id="vencimientos" className="relative overflow-hidden bg-[#01022e]">
      <SectionLines lines={LINES} viewBox="0 0 1600 500" />
      <SectionTick />
      <div className="relative z-10 mx-auto max-w-[1560px] px-6 py-16 md:px-14 md:py-24 lg:px-20">
        <Reveal className="mb-10 flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-[0.08em] text-indigo-300 uppercase">Cronología</span>
            <h2 className="text-3xl font-medium text-white md:text-4xl">Próximos vencimientos</h2>
          </div>
          <LinkButton href="/radar-regulatorio#test" variant="minimal" size="lg" className="w-fit shrink-0 text-neutral-900">
            Ver si mi empresa está lista
            <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {laws.map((law, i) => (
            <Reveal key={`${law.countrySlug}-${law.slug}`} delay={0.1 + i * 0.1}>
              <LawCountdownCard law={law} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
