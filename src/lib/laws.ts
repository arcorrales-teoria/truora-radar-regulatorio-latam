export interface Law {
  slug: string;
  countrySlug: string;
  name: string;
  nickname?: string;
  description: string;
  status: string;
  /** Fecha ISO del próximo hito relevante para la cuenta regresiva. Sin fecha confirmada: se omite. */
  deadline?: string;
  deadlineLabel?: string;
}

export const laws: Law[] = [
  {
    slug: "ley-2573",
    countrySlug: "colombia",
    name: "Ley 2573 de 2026",
    nickname: "La Ley del Yo No Fui",
    description:
      "Cambia quién debe probar una suplantación de identidad: ya no es la víctima, es la entidad la que debe demostrar que verificó bien.",
    status: "Vigencia parcial desde may. 2026",
    deadline: "2026-11-19",
    deadlineLabel: "Entra en vigor general",
  },
  {
    slug: "ncg-538",
    countrySlug: "chile",
    name: "NCG 538 (CMF)",
    nickname: "La Norma de la Doble Llave",
    description:
      "Autenticación reforzada del cliente: dos factores independientes en onboarding, transferencias y cambio de datos.",
    status: "Obligatoria desde jul. 2026",
    deadline: "2026-07-01",
    deadlineLabel: "Ya es obligatoria",
  },
  {
    slug: "ley-21719",
    countrySlug: "chile",
    name: "Ley 21.719",
    description: "Nueva ley de protección de datos personales: la biometría pasa a ser un dato sensible.",
    status: "Entra en vigor dic. 2026",
    deadline: "2026-12-01",
    deadlineLabel: "Entra en vigor",
  },
  {
    slug: "id-peru",
    countrySlug: "peru",
    name: "ID Perú / RENIEC",
    description: "Migración hacia la validación oficial con DNI electrónico y biometría facial de RENIEC.",
    status: "En migración durante 2026",
  },
  {
    slug: "sbs-2286-2024",
    countrySlug: "peru",
    name: "SBS 2286-2024",
    description: "Autenticación reforzada en tarjetas: el banco responde por operaciones que el cliente no reconoce.",
    status: "Último tramo jun. 2026",
    deadline: "2026-06-01",
    deadlineLabel: "Último tramo ya vigente",
  },
  {
    slug: "sbs-01747-2026",
    countrySlug: "peru",
    name: "SBS 01747-2026",
    nickname: "El Reglamento de Quién Responde por la Fintech",
    description: "Reglamento de Banking as a Service: la responsabilidad de KYC siempre queda en la entidad supervisada.",
    status: "Vigente ~dic. 2026",
    deadline: "2026-12-28",
    deadlineLabel: "Entra en vigor",
  },
  {
    slug: "ley-fintech",
    countrySlug: "mexico",
    name: "Ley Fintech",
    description:
      "Regula a las instituciones de tecnología financiera (IFPE, IFC): quién puede operar, cómo se identifica a un cliente y qué exige la CNBV para autorizarlas.",
    status: "Vigente desde 2018",
  },
  {
    slug: "regulacion-bancaria-cnbv",
    countrySlug: "mexico",
    name: "Ley de Instituciones de Crédito (CNBV)",
    description:
      "El marco general para bancos en México: identificación de clientes, prevención de fraude y lavado de activos, supervisado por la CNBV.",
    status: "Vigente, en actualización continua",
  },
];

export function lawsByCountry(countrySlug: string): Law[] {
  return laws.filter((law) => law.countrySlug === countrySlug);
}

export function getLaw(countrySlug: string, lawSlug: string): Law | undefined {
  return laws.find((law) => law.countrySlug === countrySlug && law.slug === lawSlug);
}

export function daysUntil(dateISO: string): number {
  const target = new Date(`${dateISO}T00:00:00`);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - startOfToday.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Leyes con una fecha futura confirmada, para las cards de cuenta regresiva. Más próxima primero. */
export function upcomingLaws(): (Law & { daysLeft: number })[] {
  return laws
    .filter((law) => law.deadline && daysUntil(law.deadline) > 0)
    .map((law) => ({ ...law, daysLeft: daysUntil(law.deadline!) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
