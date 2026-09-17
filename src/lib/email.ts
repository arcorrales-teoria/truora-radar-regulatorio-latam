/**
 * Dominios de correo personal/gratuitos: se usan para exigir un correo
 * CORPORATIVO en cualquier gate del sitio (Hallazgos del diagnóstico, la
 * barra de "Activar radar"), no para validar deliverability real del correo.
 * Compartido para no duplicar la lista en cada componente que la necesite.
 */
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "hotmail.com",
  "hotmail.es",
  "outlook.com",
  "outlook.es",
  "yahoo.com",
  "yahoo.es",
  "icloud.com",
  "live.com",
  "aol.com",
  "protonmail.com",
]);

export function isValidEmailFormat(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isCorporateEmail(value: string) {
  const trimmed = value.trim().toLowerCase();
  if (!isValidEmailFormat(trimmed)) return false;
  const domain = trimmed.split("@")[1];
  return !FREE_EMAIL_DOMAINS.has(domain);
}
