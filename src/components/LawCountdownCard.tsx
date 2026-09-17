import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { countries } from "@/lib/countries";
import type { Law } from "@/lib/laws";
import {
  TextureCardStyled,
  TextureCardHeader,
  TextureCardTitle,
  TextureCardContent,
  TextureCardFooter,
  TextureSeparator,
} from "@/components/ui/texture-card";

const COUNTRY_BADGE: Record<string, { code: string; color: string }> = {
  colombia: { code: "CO", color: "#6366f1" },
  chile: { code: "CL", color: "#3b82f6" },
  peru: { code: "PE", color: "#10b981" },
  mexico: { code: "MX", color: "#f43f5e" },
};

export function LawCountdownCard({ law }: { law: Law & { daysLeft: number } }) {
  const country = countries.find((c) => c.slug === law.countrySlug);
  const badge = COUNTRY_BADGE[law.countrySlug] ?? { code: "??", color: "#737373" };
  const href = `/radar-regulatorio/${law.countrySlug}/${law.slug}`;

  return (
    <Link href={href} className="group block h-full transition-transform hover:-translate-y-0.5">
      <TextureCardStyled className="h-full">
        <TextureCardHeader className="flex items-center justify-between gap-2">
          <TextureCardTitle>{country?.name}</TextureCardTitle>
          <span className="shrink-0 text-xs text-white/60 tabular-nums">Faltan {law.daysLeft}d</span>
        </TextureCardHeader>

        <TextureSeparator />

        <TextureCardContent>
          <p className="text-[13px] leading-relaxed text-white/85">
            <span className="font-medium text-white">{law.nickname ?? law.name}.</span> {law.description}
          </p>
        </TextureCardContent>

        <TextureSeparator />

        <TextureCardFooter>
          <span
            className="flex size-5 items-center justify-center rounded-[4px] text-[7px] font-bold text-white"
            style={{ background: badge.color }}
          >
            {badge.code}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-white/85 transition-colors group-hover:text-white">
            Ver detalle
            <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </TextureCardFooter>
      </TextureCardStyled>
    </Link>
  );
}
