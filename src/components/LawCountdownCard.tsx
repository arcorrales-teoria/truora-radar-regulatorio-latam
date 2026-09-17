"use client";

import { useEffect, useState } from "react";
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

interface Remaining {
  d: number;
  h: number;
  m: number;
  s: number;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getRemaining(deadlineISO: string): Remaining {
  const target = new Date(`${deadlineISO}T00:00:00`).getTime();
  const diff = Math.max(0, target - Date.now());
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
  };
}

/**
 * Cuenta regresiva que late en vivo (tick por segundo). El estado inicial es
 * `null` a propósito: tanto el render de servidor como el primer render del
 * cliente (antes de que el efecto corra) muestran el mismo fallback estático
 * (`daysLeft`, ya calculado server-side), así no hay hydration mismatch — el
 * reloj solo empieza a "vivir" después del mount.
 */
function LiveCountdown({ deadline, fallbackDays }: { deadline: string; fallbackDays: number }) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(deadline));
    const id = setInterval(() => setRemaining(getRemaining(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!remaining) {
    return <span className="tabular-nums">{fallbackDays}d</span>;
  }

  return (
    <span className="tabular-nums">
      {remaining.d}d {pad(remaining.h)}h {pad(remaining.m)}m {pad(remaining.s)}s
    </span>
  );
}

export function LawCountdownCard({ law }: { law: Law & { daysLeft: number } }) {
  const country = countries.find((c) => c.slug === law.countrySlug);
  const badge = COUNTRY_BADGE[law.countrySlug] ?? { code: "??", color: "#737373" };
  const href = `/radar-regulatorio/${law.countrySlug}/${law.slug}`;

  return (
    <Link href={href} className="group block h-full transition-transform hover:-translate-y-0.5">
      <TextureCardStyled className="h-full">
        <TextureCardHeader className="flex flex-col gap-3 px-7 pt-7 pb-4">
          <div className="flex items-center justify-between gap-2">
            <TextureCardTitle className="text-lg">{country?.name}</TextureCardTitle>
            {law.deadlineLabel && (
              <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/70">
                {law.deadlineLabel}
              </span>
            )}
          </div>

          <div>
            <span className="block text-[10px] font-semibold tracking-[0.08em] text-white/50 uppercase">Faltan</span>
            {law.deadline ? (
              <div className="text-2xl leading-tight font-semibold text-white">
                <LiveCountdown deadline={law.deadline} fallbackDays={law.daysLeft} />
              </div>
            ) : (
              <div className="text-2xl leading-tight font-semibold text-white tabular-nums">{law.daysLeft}d</div>
            )}
          </div>
        </TextureCardHeader>

        <TextureSeparator />

        <TextureCardContent className="px-7 py-5">
          <p className="text-sm leading-relaxed text-white/85">
            <span className="font-medium text-white">{law.nickname ?? law.name}.</span> {law.description}
          </p>
        </TextureCardContent>

        <TextureSeparator />

        <TextureCardFooter className="px-7 py-5">
          <span
            className="flex size-5 items-center justify-center rounded-[4px] text-[7px] font-bold text-white"
            style={{ background: badge.color }}
          >
            {badge.code}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-white/85 transition-colors group-hover:text-white">
            Ver detalle
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </TextureCardFooter>
      </TextureCardStyled>
    </Link>
  );
}
