export interface CountryData {
  slug: string;
  name: string;
  /** Coordenadas de la capital, usadas para el mapa animado. */
  lat: number;
  lng: number;
  /** true si ya hay contenido regulatorio investigado para este país. */
  ready: boolean;
  teaser: string;
  /** Imagen editorial 1:1 para la card de "Señales activas por país". */
  image: string;
}

export const countries: CountryData[] = [
  {
    slug: "colombia",
    name: "Colombia",
    lat: 4.711,
    lng: -74.0721,
    ready: true,
    teaser:
      "La Ley 2573 de 2026, la que ya venimos llamando “La Ley del Yo No Fui”, cambia quién debe probar una suplantación de identidad.",
    image: "/countries/colombia.png",
  },
  {
    slug: "chile",
    name: "Chile",
    lat: -33.4489,
    lng: -70.6693,
    ready: true,
    teaser:
      "NCG 538 de la CMF (autenticación reforzada) y Ley 21.719 (protección de datos): dos frentes regulatorios en paralelo.",
    image: "/countries/chile.png",
  },
  {
    slug: "peru",
    name: "Perú",
    lat: -12.0464,
    lng: -77.0428,
    ready: true,
    teaser:
      "ID Perú, el apagado de RENIEC y las resoluciones SBS sobre autenticación y modelos BaaS: un paquete de varias piezas.",
    image: "/countries/peru.png",
  },
  {
    slug: "mexico",
    name: "México",
    lat: 19.4326,
    lng: -99.1332,
    ready: true,
    teaser: "La Ley Fintech y la Ley de Instituciones de Crédito marcan cómo se identifica a un cliente y cómo se supervisa a bancos y fintechs.",
    image: "/countries/mexico.png",
  },
];

export function getCountry(slug: string): CountryData | undefined {
  return countries.find((c) => c.slug === slug);
}
