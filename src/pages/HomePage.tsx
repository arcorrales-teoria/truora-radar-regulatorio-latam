import MegaMenu from "@/components/MegaMenu";
import Hero from "@/components/Hero";
import { RegulationBand } from "@/components/RegulationBand";
import { UpcomingLawsRow } from "@/components/UpcomingLawsRow";
import CountryCards from "@/components/CountryCards";
import TestCta from "@/components/TestCta";
import Footer from "@/components/Footer";
import { PageRails } from "@/components/PageRails";

export default function RadarRegulatorioPage() {
  return (
    <>
      <MegaMenu />
      <div className="relative">
        <PageRails />
        <main>
          <Hero />
          <RegulationBand />
          <UpcomingLawsRow />
          <CountryCards />
          <TestCta />
        </main>
        <Footer />
      </div>
    </>
  );
}
