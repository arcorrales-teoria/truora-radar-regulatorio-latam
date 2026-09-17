export interface CountryData {
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-3, debe existir en countries.geo.json de dotted-map. */
  code: string;
  /** Coordenadas de la capital, usadas para el mapa animado. */
  lat: number;
  lng: number;
  /** true si ya hay contenido regulatorio investigado para este país. */
  ready: boolean;
  teaser: string;
  /** Copy directo al dolor ("si tu empresa hace X, revisa tu proceso"), usado en el selector de país de la Hero — ahí no hay espacio para explicar la ley, solo para que la persona se identifique. */
  hook: string;
  /** Imagen editorial 1:1 para la card de "Señales activas por país". */
  image: string;
}

export const countries: CountryData[] = [
  {
    slug: "colombia",
    name: "Colombia",
    code: "COL",
    lat: 4.711,
    lng: -74.0721,
    ready: true,
    teaser: "La Ley 2573 de 2026 cambia quién debe probar una suplantación de identidad.",
    hook: "Si tu empresa da crédito, cobra o reporta a una central de riesgo, tienes que revisar tu proceso de verificación de identidad.",
    image: "/countries/colombia.png",
  },
  {
    slug: "chile",
    name: "Chile",
    code: "CHL",
    lat: -33.4489,
    lng: -70.6693,
    ready: true,
    teaser:
      "NCG 538 de la CMF (autenticación reforzada) y Ley 21.719 (protección de datos): dos frentes regulatorios en paralelo.",
    hook: "Si tu empresa mueve transferencias, da de alta clientes o usa biometría, tienes que revisar tu proceso de autenticación.",
    image: "/countries/chile.png",
  },
  {
    slug: "peru",
    name: "Perú",
    code: "PER",
    lat: -12.0464,
    lng: -77.0428,
    ready: true,
    teaser:
      "ID Perú, el apagado de RENIEC y las resoluciones SBS sobre autenticación y modelos BaaS: un paquete de varias piezas.",
    hook: "Si tu empresa emite tarjetas, opera BaaS o valida identidad contra RENIEC, tienes que revisar tu proceso.",
    image: "/countries/peru.png",
  },
  {
    slug: "mexico",
    name: "México",
    code: "MEX",
    lat: 19.4326,
    lng: -99.1332,
    ready: true,
    teaser: "La Ley Fintech y la Ley de Instituciones de Crédito marcan cómo se identifica a un cliente y cómo se supervisa a bancos y fintechs.",
    hook: "Si tu empresa es un banco o una fintech regulada, tienes que revisar tu proceso de identificación de clientes.",
    image: "/countries/mexico.png",
  },
];

export function getCountry(slug: string): CountryData | undefined {
  return countries.find((c) => c.slug === slug);
}
