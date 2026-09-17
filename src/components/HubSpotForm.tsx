"use client";

import { useEffect, useId, useRef } from "react";
import { HUBSPOT_FORM_ID, HUBSPOT_PORTAL_ID, HUBSPOT_REGION, HUBSPOT_SCRIPT_SRC } from "@/lib/hubspot";

/**
 * Embed real del formulario de HubSpot (portalId/formId que pasó el
 * usuario), con pre-llenado de los campos que YA recolectamos en el
 * diagnóstico (nombre, empresa, cargo, industria, producto, país) — así la
 * persona no tiene que volver a escribir lo que ya nos dio. Los campos que
 * el diagnóstico no pregunta (correo, teléfono, # de procesos al mes) los
 * completa la persona misma en el formulario.
 *
 * `onFormReady`/`onFormSubmitted` son las opciones OFICIALES de
 * `hbspt.forms.create` para esto — el callback de `onFormReady` recibe una
 * referencia real al formulario ya renderizado (incluso si HubSpot lo monta
 * en un iframe), pensada exactamente para pre-llenar campos desde la
 * página que lo embebe.
 */

export interface HubSpotPrefill {
  /** -> input[name="firstname"] */
  firstname?: string;
  /** -> input[name="name"] (Company Property) */
  company?: string;
  /** -> select[name="job_title_normalized"] */
  jobTitle?: string;
  /** -> select[name="industry_normalized"] */
  industry?: string;
  /** -> checkbox[name="product_normalized"][value="..."] */
  product?: string;
  /** -> select[name="country"] */
  country?: string;
}

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: Record<string, unknown>) => void;
      };
    };
  }
}

let hubspotScriptPromise: Promise<void> | null = null;

function loadHubSpotScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No hay window"));
  if (window.hbspt) return Promise.resolve();
  if (hubspotScriptPromise) return hubspotScriptPromise;

  hubspotScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${HUBSPOT_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar el script de HubSpot")));
      return;
    }
    const script = document.createElement("script");
    script.src = HUBSPOT_SCRIPT_SRC;
    script.charset = "utf-8";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el script de HubSpot"));
    document.body.appendChild(script);
  });

  return hubspotScriptPromise;
}

function setFieldValue(root: ParentNode, name: string, value?: string) {
  if (!value) return;
  const field = root.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`);
  if (!field) return;
  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

function setCheckboxValue(root: ParentNode, name: string, value?: string) {
  if (!value) return;
  const checkbox = root.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
  if (!checkbox) return;
  checkbox.checked = true;
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));
}

export function HubSpotForm({
  prefill,
  onFormSubmitted,
  className,
}: {
  prefill: HubSpotPrefill;
  onFormSubmitted?: () => void;
  className?: string;
}) {
  const rawId = useId();
  const containerId = `hubspot-form-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const createdRef = useRef(false);

  useEffect(() => {
    if (createdRef.current || !containerRef.current) return;
    createdRef.current = true;

    loadHubSpotScript()
      .then(() => {
        if (!window.hbspt || !containerRef.current) return;
        window.hbspt.forms.create({
          portalId: HUBSPOT_PORTAL_ID,
          formId: HUBSPOT_FORM_ID,
          region: HUBSPOT_REGION,
          target: `#${containerId}`,
          onFormReady: ($form: unknown) => {
            // El callback llega como HTMLFormElement en el embed v2 moderno,
            // pero cubrimos también el caso jQuery-wrapped por si acaso.
            const formEl =
              $form instanceof HTMLElement ? $form : ($form as { get?: (i: number) => HTMLElement })?.get?.(0);
            if (!formEl) return;

            setFieldValue(formEl, "firstname", prefill.firstname);
            setFieldValue(formEl, "name", prefill.company);
            setFieldValue(formEl, "job_title_normalized", prefill.jobTitle);
            setFieldValue(formEl, "industry_normalized", prefill.industry);
            setFieldValue(formEl, "country", prefill.country);
            setCheckboxValue(formEl, "product_normalized", prefill.product);
          },
          onFormSubmitted: () => {
            onFormSubmitted?.();
          },
        });
      })
      .catch(() => {
        // Si el script no carga (adblocker, sin red, etc.) no rompemos la
        // página: el contenedor queda vacío y el CTA "Hablar con un
        // especialista" sigue disponible como alternativa.
      });
    // Solo se crea una vez al montar — el prefill se lee de un closure
    // fijo, no necesita re-suscribirse a cambios posteriores.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} id={containerId} className={className} />;
}
