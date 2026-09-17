import Image from "@/components/AppImage";
import Link from "@/components/AppLink";
import { countries } from "@/lib/countries";
import { SectionTick } from "@/components/SectionTick";
import { Reveal } from "@/components/Reveal";

const RECURSOS = [
  { label: "Radar regulatorio", href: "/radar-regulatorio" },
  { label: "Próximos vencimientos", href: "/radar-regulatorio#vencimientos" },
  { label: "Diagnóstico regulatorio", href: "/radar-regulatorio#test" },
];

// URLs reales del menú de truora.com (verificadas, no inventadas).
const TRUORA = [
  { label: "Producto", href: "https://www.truora.com/en/products" },
  { label: "Casos de éxito", href: "https://www.truora.com/en/success-stories#stories" },
  { label: "Blog", href: "https://blog.truora.com/en" },
  { label: "Precios", href: "https://www.truora.com/en/pricing/" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#01022e]">
      <SectionTick />
      <div className="mx-auto max-w-[1560px] px-6 pt-16 pb-10 md:px-14 md:pt-20 lg:px-20">
        <Reveal className="flex flex-col gap-12 border-b border-white/15 pb-14 md:flex-row md:justify-between md:gap-8">
          <div className="flex max-w-xs flex-col gap-4">
            <Image src="/brand/logo-full.svg" alt="Truora" width={110} height={26} className="brightness-0 invert" />
            <p className="text-sm leading-[1.5] font-light text-white/65">
              Radar de regulación: identidad, fraude y cumplimiento en LATAM.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-[0.08em] text-white/55 uppercase">Países</span>
              {countries.map((country) => (
                <Link
                  key={country.slug}
                  href={`/radar-regulatorio/${country.slug}`}
                  className="text-sm font-normal text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                >
                  {country.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-[0.08em] text-white/55 uppercase">Recursos</span>
              {RECURSOS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-normal text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-[0.08em] text-white/55 uppercase">Truora</span>
              {TRUORA.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-normal text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-[0.08em] text-white/55 uppercase">Contacto</span>
              <a
                href="https://www.truora.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-normal text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4"
              >
                truora.com
              </a>
            </div>
          </div>
        </Reveal>

        <p className="pt-6 text-xs font-light text-white/45">© {year} Truora. Todos los derechos reservados.</p>
      </div>

      <div className="pointer-events-none -mt-6 select-none overflow-hidden pb-2 text-center leading-none md:-mt-10" aria-hidden>
        <span className="whitespace-nowrap text-[10vw] font-medium tracking-tighter text-white/[0.06] md:text-[6.2vw]">
          RADAR DE REGULACIÓN
        </span>
      </div>
    </footer>
  );
}
