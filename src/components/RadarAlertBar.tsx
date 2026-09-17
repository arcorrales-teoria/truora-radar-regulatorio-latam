"use client";

import { useState } from "react";
import { Radar, CheckCircle2, ArrowRight } from "lucide-react";
import { isCorporateEmail, isValidEmailFormat } from "@/lib/email";
import { TextureButton } from "@/components/ui/texture-button";
import { cn } from "@/lib/utils";

/**
 * Barra de suscripción al radar (distinta del diagnóstico): no es un
 * ejercicio puntual, es dejar el correo para que te avisen cada vez que
 * cambie la regulación de tu sector/empresa. Mismo gate de correo
 * corporativo que Hallazgos (`lib/email.ts`, sin Gmail/Outlook/etc.).
 * Captura solo en el front-end por ahora: no hay backend conectado
 * todavía, el "te avisaremos" es una promesa de copy, no un envío real.
 */
export function RadarAlertBar({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  const handleSubmit = () => {
    if (!isValidEmailFormat(email)) {
      setError("Ingresa un correo válido.");
      return;
    }
    if (!isCorporateEmail(email)) {
      setError("Usa tu correo corporativo, no uno personal (Gmail, Outlook, etc.).");
      return;
    }
    setError(null);
    setActivated(true);
  };

  if (activated) {
    return (
      <div className={cn("flex items-center gap-2.5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3", className)}>
        <CheckCircle2 className="size-4 shrink-0 text-emerald-400" aria-hidden />
        <p className="text-sm text-emerald-100">
          Radar activado para <span className="font-medium text-white">{email}</span>. Te avisamos apenas cambie la regulación.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <p className="flex items-center gap-2 text-sm font-medium text-white/80">
        <Radar className="size-4 shrink-0 text-indigo-300" aria-hidden />
        Activa el radar: te avisamos apenas cambie la regulación de tu sector o tu empresa.
      </p>

      <div className="flex w-full flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 backdrop-blur-sm sm:flex-row sm:items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="tucorreo@tuempresa.com"
          className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2.5 text-sm text-white placeholder-white/40 outline-none"
        />
        <TextureButton variant="minimal" size="default" className="w-auto shrink-0 text-neutral-900" onClick={handleSubmit}>
          Activar radar
          <ArrowRight className="size-4" aria-hidden />
        </TextureButton>
      </div>

      {error ? (
        <p className="text-xs text-red-300">{error}</p>
      ) : (
        <p className="text-xs text-white/40">Solo correos corporativos — nada de Gmail, Outlook, etc.</p>
      )}
    </div>
  );
}
