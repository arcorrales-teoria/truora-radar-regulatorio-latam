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
      <div className="mx-auto flex w-fit max-w-full items-center gap-4 rounded-2xl border border-white/15 bg-[#01022e]/70 px-4 py-2 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.4)] backdrop-blur-xl md:gap-5 md:px-5">
        <Link href="/radar-regulatorio" className="flex shrink-0 items-center gap-2">
          <Image src="/brand/logo-full.svg" alt="Truora" width={100} height={24} priority className="brightness-0 invert" />
        </Link>

        <nav
          aria-label="Países"
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex"
        >
          {countries.map((country) => {
            const active = pathname === `/radar-regulatorio/${country.slug}`;
            return (
              <Link
                key={country.slug}
                href={`/radar-regulatorio/${country.slug}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-[transform,box-shadow,background-color] duration-150 active:scale-[0.96]",
                  active
                    ? "bg-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                    : "font-normal text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                {country.name}
              </Link>
            );
          })}
        </nav>

        <LinkButton href="/radar-regulatorio#test" variant="glass" size="sm" className="hidden w-auto shrink-0 md:inline-flex">
          Pon tu proceso bajo la lupa
        </LinkButton>
      </div>
    </header>
  );
}
