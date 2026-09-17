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

/**
 * Ventana de referencia (en días) contra la que se mide la barra de "tiempo
 * consumido": no es una fecha real de inicio de implementación (no existe
 * ese dato en `Law`), es un proxy visual — entre más cerca el vencimiento,
 * más llena la barra — pensado para leerse igual en los tres países aunque
 * sus plazos reales sean distintos. Un solo acento (índigo) en vez de un
 * semáforo de colores: así no se agrega un tono nuevo que "no combine" con
 * el resto del sitio, la urgencia se lee en cuánto se llena, no en el color.
 */
const REFERENCE_WINDOW_DAYS = 180;
const IMMINENT_THRESHOLD_DAYS = 90;

function implementationProgress(daysLeft: number) {
  return Math.min(100, Math.max(0, Math.round((1 - daysLeft / REFERENCE_WINDOW_DAYS) * 100)));
}

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
  const href = `/radar-regulatorio/${law.countrySlug}/${law.slug}`;
  const isImminent = law.daysLeft <= IMMINENT_THRESHOLD_DAYS;
  const progress = implementationProgress(law.daysLeft);

  return (
    <Link href={href} className="group block h-full transition-transform hover:-translate-y-0.5">
      <TextureCardStyled className="h-full">
        <TextureCardHeader className="flex flex-col gap-4 px-7 pt-7 pb-4">
          <div className="flex items-center justify-between gap-2">
            <TextureCardTitle className="text-lg">{country?.name}</TextureCardTitle>
            {isImminent && (
              <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em] text-indigo-300 uppercase">
                Inminente
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

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.06em] text-white/40 uppercase">
              <span>Plazo de implementación</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-indigo-400" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </TextureCardHeader>

        <TextureSeparator />

        <TextureCardContent className="px-7 py-5">
          <p className="text-sm leading-relaxed text-white/85">
            <span className="font-medium text-white">{law.nickname ?? law.name}.</span>{" "}
            {law.urgentPitch ?? law.description}
          </p>
        </TextureCardContent>

        <TextureSeparator />

        <TextureCardFooter className="px-7 py-5">
          <span className="text-xs text-white/40">{law.deadlineLabel ?? law.status}</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-white/85 transition-colors group-hover:text-white">
            Ver detalle
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </TextureCardFooter>
      </TextureCardStyled>
    </Link>
  );
}
