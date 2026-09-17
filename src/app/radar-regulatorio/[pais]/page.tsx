import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/ui/texture-button";
import { countries, getCountry } from "@/lib/countries";
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
      <main className="mx-auto max-w-[1560px] px-6 pt-28 pb-16 md:px-14 md:pt-32 md:pb-24 lg:px-20">
        <Reveal>
          <Link
            href="/radar-regulatorio"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-indigo-600"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Volver al radar
          </Link>

          <span className="mb-4 block text-xs font-semibold tracking-[0.08em] text-indigo-600 uppercase">
            Radar regulatorio
          </span>
          <h1 className="mb-4 text-4xl font-medium text-neutral-900 md:text-5xl">{country.name}</h1>
          <p className="max-w-2xl text-lg leading-[1.35] font-light text-neutral-600">{country.teaser}</p>

          {hasAssessment && (
            <LinkButton href={`/radar-regulatorio/${country.slug}/assessment`} variant="accent" size="lg" className="mt-6 w-fit">
              Iniciar diagnóstico
              <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          )}
        </Reveal>

        {countryLaws.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {countryLaws.map((law, i) => (
              <Reveal key={law.slug} delay={i * 0.08}>
                <Link
                  href={`/radar-regulatorio/${country.slug}/${law.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="text-base font-medium text-neutral-900">{law.nickname ?? law.name}</p>
                    <p className="mt-2 text-sm leading-[1.4] font-light text-neutral-600">{law.description}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600">
                    Ver detalle
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-sm font-light text-neutral-500">
              Estamos terminando de investigar y cruzar esta regulación con la información de Truora. Vuelve pronto:
              esta página ya está indexada, el contenido se completa aquí mismo.
            </div>
          </Reveal>
        )}
      </main>
      <Footer />
    </>
  );
}
