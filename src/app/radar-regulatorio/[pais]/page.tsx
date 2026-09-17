import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import { PageRails } from "@/components/PageRails";
import { Reveal } from "@/components/Reveal";
import { LawShowcase } from "@/components/LawShowcase";
import { LinkButton } from "@/components/ui/texture-button";
import { countries, getCountry, type CountryData } from "@/lib/countries";
import { lawsByCountry } from "@/lib/laws";
import { getAssessment } from "@/lib/assessment";

export function generateStaticParams() {
  return countries.map((country) => ({ pais: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  const country = getCountry(pais);
  if (!country) return {};
  return {
    title: `${country.name}: regulación de identidad y fraude`,
    description: country.teaser,
  };
}

function HeaderText({ country, hasAssessment }: { country: CountryData; hasAssessment: boolean }) {
  return (
    <>
      <Link
        href="/radar-regulatorio"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver al radar
      </Link>

      <span className="mb-4 block text-xs font-semibold tracking-[0.08em] text-indigo-300 uppercase">Radar regulatorio</span>
      <h1 className="mb-4 text-4xl font-medium text-white md:text-5xl">{country.name}</h1>
      <p className="text-lg leading-[1.35] font-light text-white/70">{country.teaser}</p>

      {hasAssessment && (
        <LinkButton href={`/radar-regulatorio/${country.slug}/assessment`} variant="glass" size="lg" className="mt-6 w-fit">
          Iniciar diagnóstico
          <ArrowRight className="size-4" aria-hidden />
        </LinkButton>
      )}
    </>
  );
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  const country = getCountry(pais);
  if (!country) notFound();
  const countryLaws = lawsByCountry(country.slug);
  const hasAssessment = Boolean(getAssessment(country.slug));

  return (
    <>
      <MegaMenu />
      <div className="relative">
        <PageRails />
        <main className="mx-auto max-w-[1560px] bg-[#01022e] px-6 pt-28 pb-16 md:px-14 md:pt-32 md:pb-24 lg:px-20">
        <Reveal>
          <LawShowcase country={country} laws={countryLaws}>
            <HeaderText country={country} hasAssessment={hasAssessment} />
          </LawShowcase>
        </Reveal>

        {countryLaws.length > 0 ? (
          <div className="mt-16 flex flex-col gap-8">
            {countryLaws.map((law, i) => (
              <Reveal key={law.slug} delay={i * 0.08}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{law.nickname ?? law.name}</p>
                      <p className="mt-2 max-w-2xl text-sm leading-[1.4] font-light text-white/60">{law.description}</p>
                    </div>
                    <Link
                      href={`/radar-regulatorio/${country.slug}/${law.slug}`}
                      className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-indigo-300"
                    >
                      Ver detalle
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </div>

                  {(law.whatChanged || law.whoItAffects || law.impact) && (
                    <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/10 pt-6 md:grid-cols-3">
                      {law.whatChanged && (
                        <div className="rounded-xl bg-white/5 p-4">
                          <span className="block text-[11px] font-semibold tracking-[0.06em] text-indigo-300 uppercase">
                            Qué cambió
                          </span>
                          <p className="mt-1.5 text-sm leading-[1.4] font-light text-white/60">{law.whatChanged}</p>
                        </div>
                      )}
                      {law.whoItAffects && (
                        <div className="rounded-xl bg-white/5 p-4">
                          <span className="block text-[11px] font-semibold tracking-[0.06em] text-indigo-300 uppercase">
                            A quién afecta
                          </span>
                          <p className="mt-1.5 text-sm leading-[1.4] font-light text-white/60">{law.whoItAffects}</p>
                        </div>
                      )}
                      {law.impact && (
                        <div className="rounded-xl bg-white/5 p-4">
                          <span className="block text-[11px] font-semibold tracking-[0.06em] text-indigo-300 uppercase">
                            Impacto en el corto plazo
                          </span>
                          <p className="mt-1.5 text-sm leading-[1.4] font-light text-white/60">{law.impact}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <div className="mt-16 rounded-2xl border border-white/15 bg-white/5 p-8 text-sm font-light text-white/60">
              Estamos terminando de investigar y cruzar esta regulación con la información de Truora. Vuelve pronto:
              esta página ya está indexada, el contenido se completa aquí mismo.
            </div>
          </Reveal>
        )}
        </main>
        <Footer />
      </div>
    </>
  );
}
