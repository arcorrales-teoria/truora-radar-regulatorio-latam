export interface AnswerOption {
  label: string;
  points: number;
}

export interface AssessmentQuestion {
  id: string;
  /** Pregunta única, en lenguaje simple — sin capa técnica separada, a propósito. */
  question: string;
  /** Siempre 3: la peor práctica, un término medio, y la mejor práctica. */
  answers: [AnswerOption, AnswerOption, AnswerOption];
  /** Frase de Hallazgo si la respuesta elegida no es la de mejor práctica — nunca un veredicto de cumplimiento. */
  finding: string;
  /** Requisito mínimo regulatorio: no cambia el scoring, pero se resalta aparte en los Hallazgos. */
  isMinimum?: boolean;
  points: number;
}

export type ModuleIcon = "id-card" | "shield-check" | "folder-lock" | "clock" | "server";

export interface AssessmentModule {
  id: string;
  label: string;
  icon: ModuleIcon;
  questions: AssessmentQuestion[];
}

export interface CountryAssessment {
  countrySlug: string;
  countryName: string;
  flag: string;
  lawLabel: string;
  intro: string;
  modules: AssessmentModule[];
}

/**
 * Producto de interés: es la pregunta GATE del intake — determina si el
 * proceso de la persona cae dentro de lo que cubre este diagnóstico. Vive
 * en el intake inicial (junto a Nombre y Cargo) porque tiene que resolverse
 * ANTES de arrancar las 10 preguntas, no después.
 */
export const PRODUCT_OPTIONS = [
  { value: "identidad", label: "Validación de identidad", inScope: true },
  { value: "antecedentes", label: "Verificación de antecedentes", inScope: true },
  { value: "firma", label: "Firma electrónica", inScope: false },
  { value: "whatsapp", label: "Agentes por WhatsApp", inScope: false },
  { value: "otro", label: "Otro", inScope: false },
] as const;

export type ProductArea = (typeof PRODUCT_OPTIONS)[number]["value"];

export function isInScope(product: ProductArea): boolean {
  return PRODUCT_OPTIONS.find((p) => p.value === product)?.inScope ?? false;
}

/**
 * Industria: se pregunta en el BANNER de home (`TestCta.tsx`), junto con el
 * país, antes de entrar al assessment — no dentro del wizard, para no
 * preguntarla dos veces. Viaja a la página de destino como query param
 * (`?industria=<subcategoría>`) y el wizard la recibe ya resuelta.
 *
 * Alcance acotado a pedido del usuario ("que no sea tan extenso, pero que
 * sí haga match con las propiedades de HubSpot"): la industria queda fija
 * en "Servicios Financieros" (coincide con los sujetos obligados reales de
 * estas leyes — bancos/financieras) y solo se pregunta la subcategoría,
 * usando los valores reales de HubSpot `Subcategory` (ver memoria
 * hubspot-reglas-y-buenas-practicas) para Banks/Fintechs/Cooperativa.
 */
export const INDUSTRY_NORMALIZED = "Servicios Financieros";

export const FINANCIAL_SUBCATEGORY_OPTIONS = [
  { value: "banco", label: "Banco", hubspotSubcategory: "Banks" },
  { value: "fintech", label: "Fintech", hubspotSubcategory: "Fintechs" },
  { value: "cooperativa", label: "Cooperativa", hubspotSubcategory: "Cooperativa" },
  { value: "otra", label: "Otra", hubspotSubcategory: undefined },
] as const;

export type FinancialSubcategory = (typeof FINANCIAL_SUBCATEGORY_OPTIONS)[number]["value"];

export function subcategoryLabel(value: string | undefined): string | undefined {
  return FINANCIAL_SUBCATEGORY_OPTIONS.find((s) => s.value === value)?.label;
}

/**
 * Cargo del intake, con su equivalencia exacta a `job_title_normalized` de
 * HubSpot (ver memoria hubspot-reglas-y-buenas-practicas) para que este dato
 * quede listo para conectarse el día que se integre el formulario. El
 * mapeo lo dio el usuario directamente:
 * Analista -> Colaborador Individual/Especialista, Manager -> Gerente/Manager,
 * Head -> Director, Founder -> Founder/Co-Founder.
 *
 * PENDIENTE (marcado explícitamente por el usuario, no resuelto en este
 * archivo): "a partir del cargo que tenga cambia la estructura de las
 * preguntas" — no se implementó todavía porque no está definido QUÉ cambia
 * exactamente (¿menos preguntas para Founder? ¿otro orden de módulos para
 * Analista vs Head?). Antes de construirlo hace falta que el usuario
 * concrete la regla — evita adivinar y autorar contenido que después haya
 * que rehacer.
 */
export const ROLE_OPTIONS = [
  { value: "analista", label: "Analista", hubspotJobTitle: "Colaborador Individual/Especialista" },
  { value: "manager", label: "Manager", hubspotJobTitle: "Gerente/Manager" },
  { value: "head", label: "Head", hubspotJobTitle: "Director" },
  { value: "founder", label: "Founder", hubspotJobTitle: "Founder/Co-Founder" },
] as const;

export type Role = (typeof ROLE_OPTIONS)[number]["value"];

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

/** Aplana los módulos de un país a una sola lista de 10 preguntas en orden. */
export function flattenQuestions(assessment: CountryAssessment): AssessmentQuestion[] {
  return assessment.modules.flatMap((m) => m.questions);
}

export function maxScore(assessment: CountryAssessment): number {
  return flattenQuestions(assessment).reduce((sum, q) => sum + q.points, 0);
}

// ---------------------------------------------------------------------------
// Colombia — Ley 2573 de 2026 ("La Ley del Yo No Fui"). Preguntas y
// respuestas reales, tomadas tal cual del diagnóstico de referencia que
// pasó el usuario (screenshots de la versión más madura de esta misma
// pieza) — incluye qué preguntas son "Mínimo Regulatorio" (co-4 a co-7).
// ---------------------------------------------------------------------------
const colombia: CountryAssessment = {
  countrySlug: "colombia",
  countryName: "Colombia",
  flag: "🇨🇴",
  lawLabel: "Ley 2573 de 2026",
  intro:
    "Un autodiagnóstico corto para medir el nivel de madurez de tu compañía en validación de identidad, expediente digital, gestión de reclamaciones y arquitectura, frente a la Ley 2573 de 2026.",
  modules: [
    {
      id: "onboarding",
      label: "Onboarding y Validación",
      icon: "id-card",
      questions: [
        {
          id: "co-1",
          question: "¿Validan la identidad con biometría facial en tiempo real y prueba de vida (liveness) en transacciones críticas?",
          answers: [
            { label: "No usamos biometría o solo usamos fotocopia/PDF de la cédula", points: 0 },
            { label: "Usamos foto selfie estática", points: 1 },
            { label: "Biometría facial con prueba de vida pasiva/activa automatizada", points: 2 },
          ],
          finding: "No hay confirmación de que la verificación facial incluya prueba de vida (liveness) en momentos críticos.",
          points: 2,
        },
        {
          id: "co-2",
          question: "¿Someten el documento de identidad físico a validaciones de seguridad documental automáticas?",
          answers: [
            { label: "Revisión visual básica o guardamos solo el número de cédula", points: 0 },
            { label: "OCR simple para extraer texto", points: 1 },
            { label: "Validación documental biométrica y de hologramas/formato en tiempo real", points: 2 },
          ],
          finding: "La validación de documentos de identidad depende de revisión manual, sin controles automáticos de autenticidad.",
          points: 2,
        },
        {
          id: "co-3",
          question: "¿La autenticación de identidad se realiza de forma continua en momentos de alto riesgo (desembolsos, cambio de SIM, cambio de datos)?",
          answers: [
            { label: "Solo en el registro inicial", points: 0 },
            { label: "Usamos OTP por SMS/Correo", points: 1 },
            { label: "Validación biométrica reincidente en cada punto crítico", points: 2 },
          ],
          finding: "La verificación de identidad no se repite en momentos de alto riesgo como desembolsos o cambios de SIM.",
          points: 2,
        },
      ],
    },
    {
      id: "expediente",
      label: "Expediente Digital",
      icon: "folder-lock",
      questions: [
        {
          id: "co-4",
          question: "¿El sistema genera un Expediente Digital Auditable inalterable por cada transacción?",
          answers: [
            { label: "No se genera expediente; hay logs dispersos en distintas bases de datos", points: 0 },
            { label: "Se consolidan carpetas digitales manualmente cuando hay un reclamo", points: 1 },
            { label: "Generación e inmutabilidad automática del expediente al finalizar cada flujo", points: 2 },
          ],
          finding: "No existe un expediente digital auditable e inalterable por transacción.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "co-5",
          question:
            "¿El expediente captura la trazabilidad técnica completa (IP, metadatos, dispositivo, hash, resultado biométrico)?",
          answers: [
            { label: "Guardamos datos comerciales básicos, no metadatos técnicos", points: 0 },
            { label: "Guardamos solo la hora y la IP", points: 1 },
            { label: "Trazabilidad técnica forense completa empaquetada", points: 2 },
          ],
          finding: "El expediente de cada transacción no registra el detalle técnico completo (IP, dispositivo, resultado biométrico).",
          isMinimum: true,
          points: 2,
        },
      ],
    },
    {
      id: "reclamaciones",
      label: "Gestión de Reclamaciones",
      icon: "clock",
      questions: [
        {
          id: "co-6",
          question: "Ante una denuncia de suplantación, ¿en cuánto tiempo pueden consolidar y entregar el expediente digital al usuario?",
          answers: [
            { label: "Más de 10 días hábiles (o requiere búsqueda en archivos físicos)", points: 0 },
            { label: "Entre 5 y 10 días hábiles mediante búsqueda e integración manual", points: 1 },
            { label: "Entrega inmediata / en minutos vía exportación automática", points: 2 },
          ],
          finding: "No hay un tiempo definido para entregar el expediente digital ante una denuncia de suplantación.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "co-7",
          question: "¿Tienen un flujo para suspender cobros e intereses inmediatamente tras recibir la denuncia de suplantación?",
          answers: [
            { label: "Proceso manual que toma semanas en reflejarse en el sistema core", points: 0 },
            { label: "Requiere autorizaciones manuales entre áreas (2 a 5 días)", points: 1 },
            { label: "Congelamiento automático o parametrizado en <24 horas", points: 2 },
          ],
          finding: "Los cobros e intereses no se suspenden de inmediato al recibir una denuncia de suplantación.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "co-8",
          question: "¿Tienen un proceso prioritario para marcar al usuario como \"víctima de falsedad\" ante Centrales de Riesgo?",
          answers: [
            { label: "No tenemos un protocolo claro", points: 0 },
            { label: "Proceso manual en reportes periódicos de fin de mes", points: 1 },
            { label: "Flujo automático o de prioridad alta para actualización inmediata", points: 2 },
          ],
          finding: "No hay un proceso prioritario para marcar a alguien como víctima de falsedad sin afectar su score.",
          points: 2,
        },
      ],
    },
    {
      id: "arquitectura",
      label: "Arquitectura e Integración",
      icon: "server",
      questions: [
        {
          id: "co-9",
          question: "¿Los controles de validación de identidad y generación de expediente están integrados vía API a su sistema core?",
          answers: [
            { label: "Operación 100% desconectada / manual", points: 0 },
            { label: "Integración parcial (requiere descargas y cargas de archivos masivos)", points: 1 },
            { label: "Integración nativa vía API plug-and-play", points: 2 },
          ],
          finding: "La verificación de identidad y el expediente no están integrados al sistema core: dependen de procesos manuales.",
          points: 2,
        },
        {
          id: "co-10",
          question: "¿Cuentan con un sistema de alertas para detectar intentos de fraude recurrente en tiempo real?",
          answers: [
            { label: "Nos enteramos cuando el usuario real reclame la deuda", points: 0 },
            { label: "Detección posterior mediante auditorías mensuales", points: 1 },
            { label: "Bloqueo preventivo en tiempo real ante patrones sospechosos", points: 2 },
          ],
          finding: "No hay un sistema que detecte automáticamente intentos de fraude recurrente en tiempo real.",
          points: 2,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Chile — NCG 538 (CMF) + Ley 21.719. BORRADOR: respuestas concretas de
// 3 opciones (peor/media/mejor práctica) escritas por el asistente
// siguiendo el mismo criterio y estructura del diagnóstico de Colombia —
// pendiente de confirmación antes de tratarse como definitivo.
// ---------------------------------------------------------------------------
const chile: CountryAssessment = {
  countrySlug: "chile",
  countryName: "Chile",
  flag: "🇨🇱",
  lawLabel: "NCG 538 y Ley 21.719",
  intro:
    "Un autodiagnóstico corto para medir el nivel de madurez de tu compañía en autenticación reforzada, dispositivos, datos sensibles e incidentes, frente a la NCG 538 de la CMF y la Ley 21.719.",
  modules: [
    {
      id: "autenticacion",
      label: "Autenticación en momentos críticos",
      icon: "shield-check",
      questions: [
        {
          id: "cl-1",
          question: "¿Qué le piden a un cliente para transferir plata o abrir un producto nuevo?",
          answers: [
            { label: "Solo una clave o PIN", points: 0 },
            { label: "Clave + tarjeta de coordenadas", points: 1 },
            { label: "Dos factores de categorías distintas (ej. clave + biometría o clave + token del celular)", points: 2 },
          ],
          finding: "No se exigen dos factores de categorías distintas en transferencias o alta de clientes.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "cl-2",
          question:
            "Si todavía usan la tarjeta de coordenadas para algunos clientes (adultos mayores, sin acceso a canales digitales), ¿ya lo notificaron a la CMF?",
          answers: [
            { label: "La seguimos usando para varios clientes y no hemos notificado nada", points: 0 },
            { label: "Estamos preparando la notificación, todavía no la enviamos", points: 1 },
            { label: "Ya la eliminamos del todo, o notificamos las excepciones a la CMF antes del plazo", points: 2 },
          ],
          finding: "Se sigue usando tarjeta de coordenadas para algunos clientes sin haber notificado la excepción a la CMF.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "cl-3",
          question: "Cuando un cliente activa un celular nuevo, ¿qué hacen antes de confiar en ese equipo?",
          answers: [
            { label: "Queda confiado automáticamente sin verificación adicional", points: 0 },
            { label: "Se envía un aviso o notificación, pero sin pedir un segundo factor", points: 1 },
            { label: "Se exige la misma autenticación reforzada que en una transferencia", points: 2 },
          ],
          finding: "Un dispositivo nuevo puede quedar \"de confianza\" sin repetir la autenticación reforzada.",
          points: 2,
        },
      ],
    },
    {
      id: "dispositivos",
      label: "Dispositivos y datos",
      icon: "id-card",
      questions: [
        {
          id: "cl-4",
          question: "¿Cómo queda registrado que un dispositivo pasó a ser \"de confianza\"?",
          answers: [
            { label: "No queda un registro claro de cuándo o cómo se autorizó", points: 0 },
            { label: "Queda un registro básico, sin poder reconstruir el detalle", points: 1 },
            { label: "Queda un registro verificable, con fecha, factor usado y resultado", points: 2 },
          ],
          finding: "El enrolamiento de dispositivos de confianza no queda registrado de forma verificable.",
          points: 2,
        },
        {
          id: "cl-5",
          question: "Cambiar el correo o el número de un cliente, ¿qué tan fácil es comparado con hacer una transferencia?",
          answers: [
            { label: "Es más fácil: no pide los mismos factores", points: 0 },
            { label: "Pide algo más que una clave, pero no el mismo nivel", points: 1 },
            { label: "Exige exactamente el mismo nivel de verificación que una transferencia", points: 2 },
          ],
          finding: "Cambiar datos personales o credenciales exige menos verificación que una transferencia.",
          points: 2,
        },
      ],
    },
    {
      id: "datos-sensibles",
      label: "Datos sensibles y consentimiento",
      icon: "folder-lock",
      questions: [
        {
          id: "cl-6",
          question: "Si un cliente pide que borren su huella o su cara del sistema, ¿qué pasa?",
          answers: [
            { label: "No hay un proceso para hacerlo, el dato queda guardado", points: 0 },
            { label: "Se puede hacer, pero es un trámite manual y lento", points: 1 },
            { label: "Hay un mecanismo claro y rápido para eliminar o revocar ese dato", points: 2 },
          ],
          finding: "No hay un mecanismo para eliminar o revocar los datos biométricos de un cliente a pedido suyo.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "cl-7",
          question: "Antes de escanear una cara o una huella, ¿cómo piden el consentimiento?",
          answers: [
            { label: "Va incluido en los términos y condiciones generales", points: 0 },
            { label: "Se menciona, pero no es un paso separado y explícito", points: 1 },
            { label: "Es un consentimiento explícito y separado, específico para datos biométricos", points: 2 },
          ],
          finding: "No se pide un consentimiento explícito y separado antes de usar datos biométricos.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "cl-8",
          question: "Si la Agencia de Protección de Datos pide la prueba, ¿pueden mostrar cuándo y para qué aceptó cada cliente?",
          answers: [
            { label: "No tenemos ese registro", points: 0 },
            { label: "Tenemos algo, pero incompleto o disperso", points: 1 },
            { label: "Tenemos el registro exacto, con fecha y finalidad, por cliente", points: 2 },
          ],
          finding: "No hay un registro que demuestre cuándo y para qué dio consentimiento cada cliente.",
          points: 2,
        },
      ],
    },
    {
      id: "incidentes",
      label: "Gestión de incidentes y arquitectura",
      icon: "server",
      questions: [
        {
          id: "cl-9",
          question: "Si un cliente dice \"yo no hice esa transferencia\", ¿en cuánto tiempo pueden confirmar si tuvo autenticación reforzada?",
          answers: [
            { label: "No es posible saberlo con certeza", points: 0 },
            { label: "Se puede revisar, pero toma días", points: 1 },
            { label: "Se puede confirmar en minutos", points: 2 },
          ],
          finding: "No se puede confirmar rápidamente si una operación reclamada tuvo autenticación reforzada.",
          points: 2,
        },
        {
          id: "cl-10",
          question: "¿La doble verificación vive conectada a su sistema principal, o es un proceso aparte?",
          answers: [
            { label: "Es un proceso manual, separado del sistema principal", points: 0 },
            { label: "Está parcialmente conectado, con pasos manuales", points: 1 },
            { label: "Está integrado vía API a su sistema principal", points: 2 },
          ],
          finding: "La verificación de identidad no está integrada al sistema principal: depende de revisión manual aparte.",
          points: 2,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Perú — Resolución SBS 2286-2024 + Reglamento BaaS + ID Perú. BORRADOR:
// mismo criterio que Chile — respuestas concretas de 3 opciones escritas
// por el asistente, pendiente de confirmación.
// ---------------------------------------------------------------------------
const peru: CountryAssessment = {
  countrySlug: "peru",
  countryName: "Perú",
  flag: "🇵🇪",
  lawLabel: "Normativa SBS y BaaS",
  intro:
    "Un autodiagnóstico corto para medir el nivel de madurez de tu compañía en autenticación de operaciones, gestión de reclamos, migración a ID Perú y modelos BaaS, frente a la normativa de la SBS.",
  modules: [
    {
      id: "autenticacion-operaciones",
      label: "Autenticación de operaciones",
      icon: "shield-check",
      questions: [
        {
          id: "pe-1",
          question: "Si alguien compra con la tarjeta de un cliente sin tenerla en la mano, ¿qué le piden además del número y la fecha?",
          answers: [
            { label: "Nada más, con esos datos basta", points: 0 },
            { label: "A veces se pide un código adicional, pero no siempre", points: 1 },
            { label: "Siempre se exige un segundo factor (código dinámico, token, etc.)", points: 2 },
          ],
          finding: "No se exige un segundo factor en operaciones con tarjeta no presente.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "pe-2",
          question: "Cuando un cliente paga desde Apple Pay o Google Pay, ¿qué pasa con el dato real de su tarjeta?",
          answers: [
            { label: "El dato real de la tarjeta viaja tal cual", points: 0 },
            { label: "Hay alguna protección, pero no tokenización real", points: 1 },
            { label: "El dato real queda protegido: solo viaja un token", points: 2 },
          ],
          finding: "Los datos reales de la tarjeta no quedan protegidos en pagos desde billeteras móviles de terceros.",
          points: 2,
        },
        {
          id: "pe-3",
          question: "Si el titular le presta su tarjeta adicional a otra persona autorizada, ¿esa operación pide lo mismo que la tarjeta principal?",
          answers: [
            { label: "No, la tarjeta adicional pide menos verificación", points: 0 },
            { label: "Depende del canal o del monto", points: 1 },
            { label: "Sí, exige exactamente el mismo segundo factor", points: 2 },
          ],
          finding: "Las tarjetas de crédito adicionales no exigen el mismo segundo factor que la tarjeta principal.",
          points: 2,
        },
      ],
    },
    {
      id: "operaciones-no-reconocidas",
      label: "Gestión de operaciones no reconocidas",
      icon: "clock",
      questions: [
        {
          id: "pe-4",
          question: "Si un cliente dice \"yo no hice esa compra\", ¿pueden probar si esa operación tuvo segundo factor?",
          answers: [
            { label: "No queda un registro que lo demuestre", points: 0 },
            { label: "Se puede revisar, pero con esfuerzo manual", points: 1 },
            { label: "Queda registrado y se puede confirmar de inmediato", points: 2 },
          ],
          finding: "No se puede demostrar si una operación reclamada se protegió con segundo factor.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "pe-5",
          question: "Si confirman que la operación no tuvo segundo factor, ¿ya saben qué hacer y en cuánto tiempo?",
          answers: [
            { label: "No hay un flujo definido", points: 0 },
            { label: "Hay un proceso, pero sin plazos claros", points: 1 },
            { label: "Hay un flujo y un plazo definidos para responder y devolver", points: 2 },
          ],
          finding: "No hay un flujo definido de responsabilidad y devolución cuando falló el segundo factor.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "pe-6",
          question: "Si un cliente reclama por una tarjeta emitida antes de julio de 2025, ¿el banco responde igual que con una nueva?",
          answers: [
            { label: "No, esas tarjetas quedan fuera de la política actual", points: 0 },
            { label: "Se evalúa caso por caso", points: 1 },
            { label: "Sí, responde exactamente igual que con una tarjeta nueva", points: 2 },
          ],
          finding: "La responsabilidad por operaciones no reconocidas no se aplica todavía a tarjetas emitidas antes de julio de 2025.",
          points: 2,
        },
      ],
    },
    {
      id: "id-peru",
      label: "Migración a ID Perú",
      icon: "id-card",
      questions: [
        {
          id: "pe-7",
          question: "¿Qué tan dependiente es su verificación de identidad del canal tradicional de RENIEC?",
          answers: [
            { label: "Depende completamente de ese canal", points: 0 },
            { label: "Lo usan como respaldo, pero no como único canal", points: 1 },
            { label: "Ya no dependen de ese canal", points: 2 },
          ],
          finding: "La validación de identidad sigue dependiendo del canal tradicional de RENIEC que va a apagarse.",
          isMinimum: true,
          points: 2,
        },
        {
          id: "pe-8",
          question: "¿Cómo validan hoy la identidad contra el DNI de una persona?",
          answers: [
            { label: "Alguien revisa el documento a simple vista", points: 0 },
            { label: "Usan alguna validación automática, pero no vía ID Perú", points: 1 },
            { label: "Ya está integrado con ID Perú (chip DNIe + biometría facial)", points: 2 },
          ],
          finding: "La validación de identidad no está integrada con ID Perú (chip DNIe + biometría facial).",
          points: 2,
        },
      ],
    },
    {
      id: "baas",
      label: "Modelo BaaS",
      icon: "server",
      questions: [
        {
          id: "pe-9",
          question: "Si operan en un modelo Banking as a Service, ¿qué tan clara es la responsabilidad en el contrato?",
          answers: [
            { label: "No está claramente definida", points: 0 },
            { label: "Está mencionada, pero sin todas las cláusulas mínimas", points: 1 },
            { label: "Está completamente clara, con las cláusulas mínimas del Reglamento", points: 2 },
          ],
          finding: "El contrato del modelo Banking as a Service no tiene claras las cláusulas mínimas de responsabilidad.",
          points: 2,
        },
        {
          id: "pe-10",
          question: "Si un cliente llega a través de la app de una fintech (no directo al banco), ¿lo conocen con el mismo rigor?",
          answers: [
            { label: "No, el filtro es más débil por ese canal", points: 0 },
            { label: "Parcialmente, hay algunas verificaciones", points: 1 },
            { label: "Sí, con exactamente el mismo rigor que un cliente directo", points: 2 },
          ],
          finding: "La debida diligencia del cliente se debilita cuando llega a través de un canal de un tercero (receptor BaaS).",
          points: 2,
        },
      ],
    },
  ],
};

export const assessments: Record<string, CountryAssessment> = { colombia, chile, peru };

export function getAssessment(countrySlug: string): CountryAssessment | undefined {
  return assessments[countrySlug];
}
