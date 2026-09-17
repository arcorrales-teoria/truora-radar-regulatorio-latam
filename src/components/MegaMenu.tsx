"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { countries } from "@/lib/countries";
import { LinkButton } from "@/components/ui/texture-button";
import { cn } from "@/lib/utils";

export default function MegaMenu() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-4 md:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-xl flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-[#01022e]/70 p-2 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.4)] backdrop-blur-xl md:w-fit md:max-w-full md:flex-nowrap md:gap-4 md:px-4 lg:gap-5 lg:px-5">
        <Link href="/radar-regulatorio" className="flex shrink-0 items-center gap-2">
          <Image
            src="/brand/logo-full.svg"
            alt="Truora"
            width={100}
            height={24}
            priority
            className="w-[92px] brightness-0 invert sm:w-[100px]"
          />
        </Link>

        <nav
          aria-label="Países"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:order-none md:w-auto md:overflow-visible"
        >
          {countries.map((country) => {
            const countryPath = `/radar-regulatorio/${country.slug}`;
            const active = pathname === countryPath || pathname.startsWith(`${countryPath}/`);
            return (
              <Link
                key={country.slug}
                href={countryPath}
                className={cn(
                  "min-h-9 shrink-0 rounded-full px-3 py-2 text-sm leading-5 transition-[color,transform,box-shadow,background-color] duration-150 active:scale-[0.96]",
                  active
                    ? "bg-white font-semibold text-[#01022e] shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                    : "font-normal text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                {country.name}
              </Link>
            );
          })}
        </nav>

        <LinkButton href="/radar-regulatorio#test" variant="glass" size="sm" className="w-auto shrink-0">
          <span className="lg:hidden">Haz el test</span>
          <span className="hidden lg:inline">Pon tu proceso bajo la lupa</span>
        </LinkButton>
      </div>
    </header>
  );
}
