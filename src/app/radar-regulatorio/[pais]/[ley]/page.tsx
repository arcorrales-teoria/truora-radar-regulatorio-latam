import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getCountry } from "@/lib/countries";
import { laws, getLaw, daysUntil } from "@/lib/laws";

export function generateStaticParams() {
  return laws.map((law) => ({ pais: law.countrySlug, ley: law.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string; ley: string }>;
}): Promise<Metadata> {
  const { pais, ley } = await params;
  const law = getLaw(pais, ley);
  if (!law) return {};
  return {
    title: law.nickname ? `${law.name}: ${law.nickname}` : law.name,
    description: law.description,
  };
}

export default async function LawPage({
  params,
}: {
  params: Promise<{ pais: string; ley: string }>;
}) {
  const { pais, ley } = await params;
  const law = getLaw(pais, ley);
  const country = getCountry(pais);
  if (!law || !country) notFound();

  const days = law.deadline ? daysUntil(law.deadline) : null;

  return (
    <>
      <MegaMenu />
      <main className="mx-auto max-w-[1560px] px-6 pt-28 pb-16 md:px-14 md:pt-32 md:pb-24 lg:px-20">
        <Reveal>
          <Link
            href={`/radar-regulatorio/${country.slug}`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-indigo-600"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Volver a {country.name}
          </Link>

          <span className="mb-4 block text-xs font-semibold tracking-[0.08em] text-indigo-600 uppercase">
            {country.name}
          </span>
          <h1 className="mb-3 text-4xl font-medium text-neutral-900 md:text-5xl">{law.name}</h1>
          {law.nickname && <p className="mb-4 text-xl font-light text-neutral-500">{law.nickname}</p>}
          <p className="max-w-2xl text-lg leading-[1.35] font-light text-neutral-600">{law.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700">
              Estado: <span className="text-neutral-500">{law.status}</span>
            </span>
            {days !== null && days > 0 && (
              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
                Faltan {days} días{law.deadlineLabel ? ` para: ${law.deadlineLabel}` : ""}
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div id="implementar" className="mt-14 scroll-mt-24 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-sm font-light text-neutral-500">
            Estamos completando la guía de implementación paso a paso para esta regulación. Mientras tanto, agenda un
            diagnóstico con Truora para revisar cómo te afecta puntualmente.
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
