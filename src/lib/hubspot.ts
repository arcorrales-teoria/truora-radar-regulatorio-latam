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

/**
 * País -> valor real del dropdown `country` en HubSpot. Confirmado por
 * captura de pantalla del editor de esa propiedad: Colombia, México, Chile,
 * Argentina, El Salvador (visibles) + más detrás de "Show more".
 * "Perú" NO se vio en la captura (quedó cortada antes de llegar a esa
 * opción) — se usa por consistencia con el resto de la lista (nombres
 * completos, con tilde donde corresponde), pero queda SIN CONFIRMAR hasta
 * verificarlo directamente en HubSpot. Si el valor real difiere, el campo
 * simplemente no se pre-llena (no rompe el formulario, la persona solo
 * tiene que elegirlo a mano).
 */
export const COUNTRY_TO_HUBSPOT: Record<string, string> = {
  colombia: "Colombia",
  chile: "Chile",
  peru: "Perú", // sin confirmar — ver nota arriba
  mexico: "México",
};

export function countryToHubSpot(countrySlug: string): string | undefined {
  return COUNTRY_TO_HUBSPOT[countrySlug];
}
