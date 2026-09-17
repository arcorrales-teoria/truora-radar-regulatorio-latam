import { useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Link from "@/components/AppLink";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import { PageRails } from "@/components/PageRails";
import { AssessmentWizard } from "@/components/AssessmentWizard";
import { SectionLines } from "@/components/SectionLines";
import { SectionTick } from "@/components/SectionTick";
import { countries, getCountry } from "@/lib/countries";
import { getAssessment, FINANCIAL_SUBCATEGORY_OPTIONS, type FinancialSubcategory } from "@/lib/assessment";

const LINES = [
  { d: "M -50 60 C 300 -10, 620 150, 980 50 S 1500 110, 1750 30", opacity: 0.3 },
  { d: "M -50 500 C 300 560, 620 440, 980 520 S 1480 470, 1750 530", opacity: 0.22 },
];

export default function AssessmentPage() {
  const { pais = "" } = useParams();
  const [searchParams] = useSearchParams();
  const industria = searchParams.get("industria") ?? undefined;
  const country = getCountry(pais);
  const assessment = getAssessment(pais);
  if (!country || !assessment) return null;

  const availableCountries = countries.filter((c) => Boolean(getAssessment(c.slug)));
  const initialSubcategory = FINANCIAL_SUBCATEGORY_OPTIONS.find((s) => s.value === industria)?.value as
    | FinancialSubcategory
    | undefined;

  return (
    <>
      <MegaMenu />
      <div className="relative">
        <PageRails />
        <main className="relative overflow-hidden bg-[#01022e] px-6 pt-28 pb-16 md:px-14 md:pt-32 md:pb-24 lg:px-20">
          <SectionLines lines={LINES} viewBox="0 0 1600 600" />
          <SectionTick />
          <div className="relative z-10 mx-auto max-w-[1560px]">
            <Link
              href={`/radar-regulatorio/${country.slug}`}
              className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Volver a {country.name}
            </Link>

            <AssessmentWizard
              assessment={assessment}
              countrySlug={country.slug}
              availableCountries={availableCountries}
              initialSubcategory={initialSubcategory}
            />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
