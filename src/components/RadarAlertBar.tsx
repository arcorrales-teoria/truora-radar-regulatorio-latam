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
      <div className={cn("flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3", className)}>
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden />
        <p className="text-sm text-emerald-800">
          Radar activado para <span className="font-medium">{email}</span>. Te avisamos apenas cambie la regulación.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <p className="flex items-center gap-2 text-sm font-medium text-neutral-700">
        <Radar className="size-4 shrink-0 text-indigo-600" aria-hidden />
        Activa el radar: te avisamos apenas cambie la regulación de tu sector o tu empresa.
      </p>

      <div className="flex w-full flex-col gap-2 rounded-2xl border border-indigo-200/70 bg-white/70 p-2 backdrop-blur-sm sm:flex-row sm:items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="tucorreo@tuempresa.com"
          className="flex-1 rounded-xl bg-transparent px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none"
        />
        <TextureButton variant="accent" size="default" className="shrink-0" onClick={handleSubmit}>
          Activar radar
          <ArrowRight className="size-4" aria-hidden />
        </TextureButton>
      </div>

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <p className="text-xs text-neutral-500">Solo correos corporativos — nada de Gmail, Outlook, etc.</p>
      )}
    </div>
  );
}
