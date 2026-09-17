/**
 * Constantes y equivalencias para el formulario embebido real de HubSpot
 * que reemplaza el gate de correo del diagnóstico (`AssessmentWizard.tsx`,
 * fase "results"). El formulario en sí (campos, validaciones, textos) vive
 * y se edita en HubSpot — acá solo mapeamos lo que YA recolectamos en el
 * wizard a los valores internos reales de cada propiedad, para pre-llenar
 * el formulario embebido antes de que la persona lo vea.
 */

export const HUBSPOT_PORTAL_ID = "21471312";
export const HUBSPOT_FORM_ID = "1412f8f7-95e9-4792-9a1c-82358c1192d5";
export const HUBSPOT_REGION = "na1";
export const HUBSPOT_SCRIPT_SRC = "//js.hsforms.net/forms/embed/v2.js";

declare global {
  interface Window {
    _hsq?: unknown[][];
  }
}

/**
 * Registra una vista virtual en HubSpot para medir el avance dentro de una
 * experiencia SPA. Cada ruta se reporta una sola vez por pestaña para que
 * volver atrás en el wizard no infle el funnel.
 */
export function trackHubSpotVirtualPage(path: string) {
  if (typeof window === "undefined") return;

  const storageKey = `hubspot-virtual-page:${path}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
  } catch {
    // El tracking sigue funcionando aunque el navegador bloquee storage.
  }

  window._hsq = window._hsq || [];
  window._hsq.push(["setPath", path]);
  window._hsq.push(["trackPageView"]);

  try {
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // No interrumpimos el diagnóstico si storage no está disponible.
  }
}

/**
 * País -> valor real del dropdown `country` en HubSpot. Confirmado 2026-09-17
 * directo contra la definición real del formulario (`GET
 * forms.hubspot.com/embed/v3/form/{portalId}/{formId}?callback=...`, el
 * mismo endpoint que usa el embed para renderizar sus campos): las cuatro
 * opciones, incluyendo "Perú" con tilde, existen tal cual en el dropdown.
 */
export const COUNTRY_TO_HUBSPOT: Record<string, string> = {
  colombia: "Colombia",
  chile: "Chile",
  peru: "Perú",
  mexico: "México",
};

export function countryToHubSpot(countrySlug: string): string | undefined {
  return COUNTRY_TO_HUBSPOT[countrySlug];
}
