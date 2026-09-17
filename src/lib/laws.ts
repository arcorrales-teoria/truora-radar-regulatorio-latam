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
  /** Qué cambia en la práctica frente al régimen anterior. */
  whatChanged?: string;
  /** A quién le toca cumplirla (sujetos obligados). */
  whoItAffects?: string;
  /** Consecuencia concreta de no cumplir / qué está en juego. */
  impact?: string;
  /** Copy directo al problema (formato "si haces/no haces X, no cumples. Descubre cómo Y"), usado en la card de cuenta regresiva de la home — ahí no hay espacio para explicar la ley, solo para golpear el dolor. */
  urgentPitch?: string;
}

export const laws: Law[] = [
  {
    slug: "ley-2573",
    countrySlug: "colombia",
    name: "Ley 2573 de 2026",
    nickname: "Ley de Suplantación de Identidad",
    description:
      "Cambia quién debe probar una suplantación de identidad: ya no es la víctima, es la entidad la que debe demostrar que verificó bien.",
    status: "Vigencia parcial desde may. 2026",
    deadline: "2026-11-19",
    deadlineLabel: "Entra en vigor general",
    whatChanged:
      "Se invierte la carga de la prueba: ya no es la víctima quien debe demostrar que fue suplantada, es la entidad la que debe probar que verificó bien la identidad. El cobro y el servicio se suspenden de inmediato desde el aviso, sin esperar a que se resuelva el reclamo.",
    whoItAffects:
      "Entidades financieras y crediticias (bancos, cooperativas, fondos de empleados, fintechs de crédito, aseguradoras), operadores de telecomunicaciones (Claro, Movistar, Tigo, WOM, MVNO) y cualquier comercio que dé crédito, cobre o reporte a una central de riesgo.",
    impact:
      "Si la entidad no puede demostrar una verificación de identidad suficiente y razonable, pierde el derecho de cobro, debe devolver el dinero y corregir el reporte en la central de riesgo, con plazos cortos de 10 a 20 días hábiles.",
    urgentPitch:
      "Si no puedes probar cómo verificaste la identidad de un cliente, ya no cumples. Descubre cómo blindar tu proceso.",
  },
  {
    slug: "ncg-538",
    countrySlug: "chile",
    name: "NCG 538 (CMF)",
    nickname: "Norma de Autenticación Reforzada",
    description:
      "Autenticación reforzada del cliente: dos factores independientes en onboarding, transferencias y cambio de datos.",
    status: "Obligatoria desde jul. 2026",
    deadline: "2026-07-01",
    deadlineLabel: "Ya es obligatoria",
    whatChanged:
      "Ya no basta una sola clave: se exige autenticación con dos factores independientes (algo que sabes + algo que tienes o eres) para transferencias, alta de clientes, cambio de datos y enrolamiento de dispositivos. La tarjeta de coordenadas deja de contar como método válido, salvo excepciones puntuales notificadas a la CMF.",
    whoItAffects:
      "Bancos, emisores de tarjetas de pago, cooperativas de ahorro y crédito, sociedades de apoyo al giro y fintechs supervisadas por la CMF.",
    impact:
      "Si el emisor no implementó la autenticación reforzada y ocurre un fraude, es el emisor quien responde por el daño al usuario: la responsabilidad se mueve del cliente hacia la entidad.",
    urgentPitch: "Si tus clientes siguen entrando y transfiriendo con una sola clave, tu banco ya no cumple. Descubre cómo pasar a doble factor.",
  },
  {
    slug: "ley-21719",
    countrySlug: "chile",
    name: "Ley 21.719",
    description: "Nueva ley de protección de datos personales: la biometría pasa a ser un dato sensible.",
    status: "Entra en vigor dic. 2026",
    deadline: "2026-12-01",
    deadlineLabel: "Entra en vigor",
    whatChanged:
      "Los datos biométricos (rostro, huella, voz, iris) pasan a ser 'datos sensibles', igual categoría que salud o vida sexual: se exige consentimiento expreso y separado para tratarlos, informar la finalidad y el plazo de uso, y permitir que el titular lo revoque en cualquier momento.",
    whoItAffects:
      "Bancos, cajas de compensación, corredoras y fintechs ya regulados por la CMF, y cualquier entidad que use biometría para verificar identidad o que segmente personas según su capacidad de pago.",
    impact:
      "No basta con cumplir la autenticación reforzada de la NCG 538: hay que poder demostrar consentimiento explícito sobre los datos biométricos, ante una nueva Agencia de Protección de Datos Personales con multas de hasta 20.000 UTM.",
    urgentPitch: "Si usas biometría sin consentimiento explícito y separado, no cumples. Descubre cómo cerrar esa brecha.",
  },
  {
    slug: "id-peru",
    countrySlug: "peru",
    name: "ID Perú / RENIEC",
    description: "Migración hacia la validación oficial con DNI electrónico y biometría facial de RENIEC.",
    status: "En migración durante 2026",
    whatChanged:
      "La validación de identidad deja de depender de consultas masivas a RENIEC por línea dedicada (un canal que se está apagando por uso irregular) y pasa a hacerse a través de ID Perú: leyendo el chip del DNI electrónico y comparando biometría facial en vivo.",
    whoItAffects:
      "Cualquier empresa privada o pública que hoy valide identidad contra RENIEC para confirmar un DNI: bancos, fintechs, telcos, aseguradoras y retail.",
    impact:
      "Quien siga dependiendo del canal tradicional se queda sin forma de validar identidad contra la fuente oficial en cuanto RENIEC lo apague, y esa migración por sí sola no incluye prueba de vida ni detección de fraude: esa capa sigue siendo responsabilidad de la entidad.",
  },
  {
    slug: "sbs-2286-2024",
    countrySlug: "peru",
    name: "SBS 2286-2024",
    description: "Autenticación reforzada en tarjetas: el banco responde por operaciones que el cliente no reconoce.",
    status: "Último tramo jun. 2026",
    deadline: "2026-06-01",
    deadlineLabel: "Último tramo ya vigente",
    whatChanged:
      "Se exige un segundo factor de autenticación en operaciones con tarjeta, presente y no presente, y esa exigencia ya alcanza también a tarjetas emitidas antes de julio de 2025 desde el 1 de junio de 2026.",
    whoItAffects: "Bancos, financieras y emisores de tarjetas de crédito o débito supervisados por la SBS.",
    impact:
      "Si el banco no exigió el segundo factor y el cliente reporta una operación que no reconoce, es el banco quien responde por la pérdida, salvo que pruebe la responsabilidad del usuario.",
    urgentPitch:
      "Si no exiges un segundo factor en cada operación con tarjeta, tu banco responde por el fraude. Descubre cómo evitarlo.",
  },
  {
    slug: "sbs-01747-2026",
    countrySlug: "peru",
    name: "SBS 01747-2026",
    nickname: "Reglamento de Responsabilidad en la Fintech",
    description: "Reglamento de Banking as a Service: la responsabilidad de KYC siempre queda en la entidad supervisada.",
    status: "Vigente ~dic. 2026",
    deadline: "2026-12-28",
    deadlineLabel: "Entra en vigor",
    whatChanged:
      "Se regula el modelo Banking as a Service: un banco/entidad supervisada le presta su infraestructura regulada a una fintech (que puede no estar supervisada) para ofrecer productos financieros a nombre de ese banco.",
    whoItAffects:
      "Bancos y entidades del sistema financiero, de seguros y AFP que actúan como proveedores de servicios BaaS, y las fintechs o apps que operan como receptores bajo su licencia.",
    impact:
      "La responsabilidad frente al cliente y ante la SBS, incluida la debida diligencia del cliente y la prevención de lavado de activos, siempre queda en la entidad supervisada, aunque la cara visible del servicio sea la fintech.",
    urgentPitch: "Si eres el banco detrás de una fintech sin el contrato claro, no cumples. Descubre cómo prepararte.",
  },
  {
    slug: "ley-fintech",
    countrySlug: "mexico",
    name: "Ley Fintech",
    description:
      "Regula a las instituciones de tecnología financiera (IFPE, IFC): quién puede operar, cómo se identifica a un cliente y qué exige la CNBV para autorizarlas.",
    status: "Vigente desde 2018",
    whatChanged:
      "Establece qué instituciones de tecnología financiera (IFPE, IFC) pueden operar en México y qué debe autorizar y supervisar la CNBV antes de que empiecen a prestar servicios.",
    whoItAffects: "Instituciones de fondos de pago electrónico y de financiamiento colectivo (fintechs) que buscan operar formalmente en México.",
    impact:
      "Define cómo se identifica a un cliente y qué requisitos de autorización debe cumplir una fintech para operar dentro del marco regulado, en vez de hacerlo fuera de cualquier supervisión.",
  },
  {
    slug: "regulacion-bancaria-cnbv",
    countrySlug: "mexico",
    name: "Ley de Instituciones de Crédito (CNBV)",
    description:
      "El marco general para bancos en México: identificación de clientes, prevención de fraude y lavado de activos, supervisado por la CNBV.",
    status: "Vigente, en actualización continua",
    whatChanged:
      "Marco general que regula a los bancos en México: identificación de clientes, prevención de fraude y lavado de activos, supervisado de forma continua por la CNBV.",
    whoItAffects: "Bancos y entidades de crédito que operan en México.",
    impact:
      "Mantiene un estándar de identificación de clientes y prevención de fraude que se actualiza de forma continua, por lo que los procesos de verificación de identidad deben seguir el ritmo de esas actualizaciones.",
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
