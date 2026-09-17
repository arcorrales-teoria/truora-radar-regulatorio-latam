"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, FolderLock, IdCard, Server, ShieldCheck } from "lucide-react";
import { TextureCardStyled } from "@/components/ui/texture-card";
import { LinkButton, TextureButton } from "@/components/ui/texture-button";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/ease";
import { HubSpotForm } from "@/components/HubSpotForm";
import { countryToHubSpot } from "@/lib/hubspot";
import {
  FINANCIAL_SUBCATEGORY_OPTIONS,
  HUBSPOT_INDUSTRY_FINANCIAL_SERVICES,
  PRODUCT_OPTIONS,
  ROLE_OPTIONS,
  firstName,
  flattenQuestions,
  isInScope,
  maxScore,
  type CountryAssessment,
  type FinancialSubcategory,
  type ModuleIcon,
  type ProductArea,
  type Role,
} from "@/lib/assessment";

/**
 * Wizard de una sola pregunta por pantalla:
 * Intro -> Intake (Nombre + Cargo) -> Empresa (Empresa + Sector, siempre se
 * visita — el sector se salta si ya llegó resuelto por query param desde el
 * banner de home, pero el nombre de la empresa se pregunta siempre porque
 * determina el nivel de cumplimiento, no solo el sector) -> Producto (su
 * propia pantalla, es la pregunta GATE: determina si el proceso aplica) ->
 * [Fuera de alcance si no aplica] -> 10 preguntas -> Procesando -> Hallazgos.
 */

type Phase = "intro" | "intake" | "company" | "product" | "outOfScope" | "question" | "processing" | "results";

const MODULE_ICONS: Record<ModuleIcon, typeof ShieldCheck> = {
  "id-card": IdCard,
  "shield-check": ShieldCheck,
  "folder-lock": FolderLock,
  clock: Clock,
  server: Server,
};

/**
 * Misma construcción de "textura" que TextureButton (capa exterior con
 * borde + sombra, capa interior con degradado + resalte inset) para que
 * los pills del wizard no se sientan planos al lado del botón — pedido
 * explícito de coherencia visual. El activo usa blanco sólido (no otro
 * indigo): la card ya es bg-indigo-600, así que un pill activo también
 * indigo-600 se volvía invisible contra su propio fondo.
 */
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border p-[1px] transition-[background-color,border-color,box-shadow,transform] duration-150 active:scale-[0.96]",
        active
          ? "border-black/10 bg-white shadow-[0px_1px_1px_rgba(20,21,38,0.1),0px_4px_10px_-4px_rgba(0,0,0,0.35)]"
          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
          active
            ? "bg-gradient-to-b from-white to-neutral-50 text-indigo-600 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.9)]"
            : "text-white/70",
        )}
      >
        {children}
      </span>
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email";
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold tracking-[0.08em] text-white/50 uppercase">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-indigo-400"
      />
    </label>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full bg-indigo-500"
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      />
    </div>
  );
}

/**
 * Animación nativa de "procesando" (breathing orb), sin dependencias
 * nuevas: solo motion/react, que ya usa todo el sitio. No se instaló el
 * paquete de terceros que llegó sugerido en un mensaje anterior del usuario
 * ("Add the Orb effect from Libraries.dev... npm install thinking-orbs") —
 * es un paquete no verificado y el pedido llegó con el patrón típico de una
 * instrucción inyectada, no como un pedido de diseño normal.
 */
function ProcessingOrb() {
  const reduced = useReducedMotion();
  return (
    <div className="relative flex size-16 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-indigo-400/50"
          animate={reduced ? {} : { scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5, ease: EASE_OUT }}
        />
      ))}
      <motion.span
        className="size-6 rounded-full bg-indigo-400"
        animate={reduced ? {} : { scale: [1, 1.15, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: EASE_OUT }}
      />
    </div>
  );
}

export function AssessmentWizard({
  assessment,
  countrySlug,
  availableCountries,
  initialSubcategory,
}: {
  assessment: CountryAssessment;
  countrySlug: string;
  availableCountries: { slug: string; name: string }[];
  initialSubcategory?: FinancialSubcategory;
}) {
  const questions = useMemo(() => flattenQuestions(assessment), [assessment]);
  const total = maxScore(assessment);
  const moduleByQuestionId = useMemo(() => {
    const map = new Map<string, { label: string; icon: ModuleIcon; index: number }>();
    assessment.modules.forEach((m, mi) => m.questions.forEach((q) => map.set(q.id, { label: m.label, icon: m.icon, index: mi })));
    return map;
  }, [assessment]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [product, setProduct] = useState<ProductArea | null>(null);
  const [company, setCompany] = useState("");
  const [subcategory, setSubcategory] = useState<FinancialSubcategory | null>(initialSubcategory ?? null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ref, bounds] = useMeasure();

  // La industria llega resuelta por query param cuando se entra desde el
  // banner de home (`TestCta`). Si alguien entra directo a esta página (ej.
  // desde "Iniciar diagnóstico" en `[pais]/page.tsx`, o la URL a pelo), ese
  // dato nunca se capturó — hay que preguntarlo acá mismo, si no se pierde.
  const industryAlreadyKnown = Boolean(initialSubcategory);

  const canContinueIntake = name.trim().length > 0 && role !== null;
  const canContinueCompany = company.trim().length > 0 && (industryAlreadyKnown || subcategory !== null);

  const goTo = (next: Phase, dir: number) => {
    setDirection(dir);
    setPhase(next);
  };

  const handleContinueIntake = () => {
    if (!canContinueIntake) return;
    goTo("company", 1);
  };

  const handleContinueCompany = () => {
    if (!canContinueCompany) return;
    goTo("product", 1);
  };

  const handleChooseProduct = (chosen: ProductArea) => {
    setProduct(chosen);
    if (!isInScope(chosen)) {
      goTo("outOfScope", 1);
      return;
    }
    setQuestionIndex(0);
    goTo("question", 1);
  };

  const answerQuestion = (points: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = points;
      return next;
    });
    if (questionIndex < questions.length - 1) {
      setDirection(1);
      setQuestionIndex((i) => i + 1);
    } else {
      goTo("processing", 1);
    }
  };

  const goBackQuestion = () => {
    if (questionIndex === 0) {
      goTo("product", -1);
      return;
    }
    setDirection(-1);
    setQuestionIndex((i) => i - 1);
  };

  const hubspotPrefill = {
    firstname: name,
    company,
    jobTitle: ROLE_OPTIONS.find((r) => r.value === role)?.hubspotJobTitle,
    industry: HUBSPOT_INDUSTRY_FINANCIAL_SERVICES,
    product: product ? PRODUCT_OPTIONS.find((p) => p.value === product)?.hubspotProduct : undefined,
    country: countryToHubSpot(countrySlug),
  };

  // "Generando tu reporte": pausa breve y puramente visual antes de revelar
  // los Hallazgos — no hay envío a correo todavía (no hay backend), es la
  // animación de procesamiento que se pidió.
  useEffect(() => {
    if (phase !== "processing") return;
    const timer = window.setTimeout(() => goTo("results", 1), 1800);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Advertencia nativa del navegador si cierran/recargan la pestaña con el
  // diagnóstico ya empezado y sin terminar. Nota real: desde hace años,
  // Chrome/Firefox/Safari IGNORAN cualquier texto personalizado acá por
  // seguridad — solo muestran su propio mensaje genérico ("¿Salir del
  // sitio? Es posible que los cambios no se guarden"). No hay forma de
  // poner nuestra copy en ese diálogo específico; sí se puede (y se hace)
  // mostrar un mensaje propio cuando la salida es DENTRO de la app (botón
  // "Volver al radar"), ver `confirmLeave`.
  useEffect(() => {
    const inProgress = phase !== "intro" && phase !== "results";
    if (!inProgress) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  const confirmLeave = () => {
    const inProgress = phase !== "intro" && phase !== "results";
    if (!inProgress) return true;
    return window.confirm("Todavía no terminaste el diagnóstico. Si sales ahora, se pierden tus respuestas. ¿Salir de todos modos?");
  };

  const score = answers.reduce((sum: number, a) => sum + (a ?? 0), 0);
  const gaps = questions.filter((q, i) => (answers[i] ?? 0) < q.points);
  const minimumGaps = gaps.filter((q) => q.isMinimum);
  const name1 = firstName(name);

  const variants = {
    initial: (dir: number) => ({ x: 24 * dir, opacity: 0, filter: "blur(4px)" }),
    active: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({ x: -24 * dir, opacity: 0, filter: "blur(4px)" }),
  };

  const progress =
    phase === "intro"
      ? 0
      : phase === "intake"
        ? 0.02
        : phase === "company"
          ? 0.04
          : phase === "product" || phase === "outOfScope"
            ? 0.06
            : phase === "question"
              ? 0.08 + (questionIndex / questions.length) * 0.72
              : 1;

  const currentModule = phase === "question" ? moduleByQuestionId.get(questions[questionIndex].id) : undefined;
  const CurrentModuleIcon = currentModule ? MODULE_ICONS[currentModule.icon] : null;

  return (
    <TextureCardStyled className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-6 p-8 md:p-10">
        <ProgressBar progress={progress} />

        <MotionConfig transition={{ duration: 0.35, ease: EASE_OUT }}>
          <motion.div animate={{ height: bounds.height }}>
            <div ref={ref}>
              <AnimatePresence custom={direction} mode="popLayout" initial={false}>
                {phase === "intro" && (
                  <motion.div key="intro" custom={direction} variants={variants} initial="initial" animate="active" exit="exit">
                    <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/5 p-[1px] shadow-[0px_1px_1px_rgba(0,0,0,0.12)]">
                      <span className="rounded-full bg-gradient-to-b from-white/15 to-white/5 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-indigo-100 uppercase shadow-[inset_0px_1px_0px_rgba(255,255,255,0.25)]">
                        {assessment.lawLabel}
                      </span>
                    </span>
                    <h2 className="mt-4 text-2xl leading-snug font-medium text-white md:text-3xl">
                      ¿Listo para saber qué tan preparada está tu empresa frente a {assessment.lawLabel} {assessment.flag}?
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{assessment.intro}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {["~3 minutos", "10 preguntas", "Resultado inmediato"].map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-white/15 bg-white/5 p-[1px] shadow-[0px_1px_1px_rgba(0,0,0,0.12)]"
                        >
                          <span className="block rounded-full bg-gradient-to-b from-white/15 to-white/5 px-3 py-1 text-xs font-medium text-white/85 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.25)]">
                            {label}
                          </span>
                        </span>
                      ))}
                    </div>

                    <TextureButton variant="minimal" size="lg" className="mt-8 w-fit text-neutral-900" onClick={() => goTo("intake", 1)}>
                      Comenzar diagnóstico
                      <ArrowRight className="size-4" aria-hidden />
                    </TextureButton>
                  </motion.div>
                )}

                {phase === "intake" && (
                  <motion.div key="intake" custom={direction} variants={variants} initial="initial" animate="active" exit="exit">
                    {availableCountries.length > 1 && (
                      <div className="mb-6 flex flex-wrap gap-2">
                        {availableCountries.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/radar-regulatorio/${c.slug}/assessment`}
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                              c.slug === countrySlug
                                ? "border-indigo-400 bg-indigo-600 text-white"
                                : "border-white/15 text-white/60 hover:border-white/30 hover:bg-white/5 hover:text-white",
                            )}
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    <span className="text-xs font-semibold tracking-[0.08em] text-indigo-300 uppercase">
                      {assessment.lawLabel}
                    </span>
                    <h2 className="mt-2 text-2xl font-medium text-white">Pon tu proceso bajo la lupa</h2>
                    <p className="mt-2 text-sm text-white/60">
                      Solo 2 preguntas antes de empezar: necesitamos esto para personalizar el diagnóstico.
                    </p>

                    <div className="mt-6">
                      <TextField label="Nombre" value={name} onChange={setName} placeholder="Tu nombre" />
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <span className="text-xs font-semibold tracking-[0.08em] text-white/50 uppercase">Cargo</span>
                      <div className="flex flex-wrap gap-2">
                        {ROLE_OPTIONS.map((opt) => (
                          <Pill key={opt.value} active={role === opt.value} onClick={() => setRole(opt.value)}>
                            {opt.label}
                          </Pill>
                        ))}
                      </div>
                    </div>

                    <TextureButton
                      variant="minimal"
                      size="lg"
                      className="mt-8 w-fit text-neutral-900 disabled:pointer-events-none disabled:opacity-40"
                      disabled={!canContinueIntake}
                      onClick={handleContinueIntake}
                    >
                      Continuar
                      <ArrowRight className="size-4" aria-hidden />
                    </TextureButton>
                  </motion.div>
                )}

                {phase === "company" && (
                  <motion.div key="company" custom={direction} variants={variants} initial="initial" animate="active" exit="exit">
                    <span className="text-xs font-semibold tracking-[0.08em] text-indigo-300 uppercase">
                      {assessment.lawLabel}
                    </span>
                    <h2 className="mt-2 text-2xl font-medium text-white">Cuéntanos de tu empresa</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      Las leyes, aunque aplican para tu sector, varían mucho según el tipo de empresa y su producto, lo
                      que determina el nivel de cumplimiento que deben tener. Por eso nos gustaría saber el nombre de tu
                      empresa y el sector en el que están.
                    </p>

                    <div className="mt-6">
                      <TextField label="Empresa" value={company} onChange={setCompany} placeholder="Nombre de tu empresa" />
                    </div>

                    {industryAlreadyKnown && subcategory ? (
                      <p className="mt-4 text-xs text-white/40">
                        Sector: Servicios Financieros ·{" "}
                        {FINANCIAL_SUBCATEGORY_OPTIONS.find((s) => s.value === subcategory)?.label}
                      </p>
                    ) : (
                      <div className="mt-6 flex flex-col gap-2">
                        <span className="text-xs font-semibold tracking-[0.08em] text-white/50 uppercase">Sector</span>
                        <div className="flex flex-wrap gap-2">
                          {FINANCIAL_SUBCATEGORY_OPTIONS.map((opt) => (
                            <Pill key={opt.value} active={subcategory === opt.value} onClick={() => setSubcategory(opt.value)}>
                              {opt.label}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex gap-3">
                      <TextureButton variant="minimal" size="lg" className="w-fit text-neutral-900" onClick={() => goTo("intake", -1)}>
                        <ArrowLeft className="size-4" aria-hidden />
                        Atrás
                      </TextureButton>
                      <TextureButton
                        variant="minimal"
                        size="lg"
                        className="w-fit text-neutral-900 disabled:pointer-events-none disabled:opacity-40"
                        disabled={!canContinueCompany}
                        onClick={handleContinueCompany}
                      >
                        Continuar
                        <ArrowRight className="size-4" aria-hidden />
                      </TextureButton>
                    </div>
                  </motion.div>
                )}

                {phase === "product" && (
                  <motion.div key="product" custom={direction} variants={variants} initial="initial" animate="active" exit="exit">
                    <span className="text-xs font-semibold tracking-[0.08em] text-indigo-300 uppercase">
                      {assessment.lawLabel}
                    </span>
                    <h2 className="mt-2 text-2xl leading-snug font-medium text-white">
                      ¿Qué proceso quieres poner bajo la lupa?
                    </h2>
                    <p className="mt-2 text-sm text-white/60">Esto confirma si el diagnóstico aplica a tu proceso.</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {PRODUCT_OPTIONS.map((opt) => (
                        <Pill key={opt.value} active={product === opt.value} onClick={() => handleChooseProduct(opt.value)}>
                          {opt.label}
                        </Pill>
                      ))}
                    </div>

                    <TextureButton variant="minimal" size="lg" className="mt-8 w-fit text-neutral-900" onClick={() => goTo("company", -1)}>
                      <ArrowLeft className="size-4" aria-hidden />
                      Atrás
                    </TextureButton>
                  </motion.div>
                )}

                {phase === "outOfScope" && (
                  <motion.div key="outOfScope" custom={direction} variants={variants} initial="initial" animate="active" exit="exit">
                    <span className="text-xs font-semibold tracking-[0.08em] text-indigo-300 uppercase">Fuera de alcance</span>
                    <h2 className="mt-2 text-2xl font-medium text-white">Este diagnóstico es específico</h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                      Este diagnóstico está construido para procesos de validación de identidad y verificación de
                      antecedentes. Para lo que buscas, un especialista de Truora te puede orientar mejor.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <LinkButton href="https://www.truora.com" variant="minimal" size="lg" className="w-fit text-neutral-900">
                        Hablar con un especialista
                      </LinkButton>
                      <TextureButton variant="minimal" size="lg" className="w-fit text-neutral-900" onClick={() => goTo("product", -1)}>
                        <ArrowLeft className="size-4" aria-hidden />
                        Atrás
                      </TextureButton>
                    </div>
                  </motion.div>
                )}

                {phase === "question" && (
                  <motion.div
                    key={`question-${questionIndex}`}
                    custom={direction}
                    variants={variants}
                    initial="initial"
                    animate="active"
                    exit="exit"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-indigo-300 uppercase">
                        {CurrentModuleIcon && <CurrentModuleIcon className="size-3.5" aria-hidden />}
                        {currentModule?.label}
                      </span>
                      <span className="text-xs font-medium text-white/40">
                        {questionIndex + 1} / {questions.length}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl leading-snug font-medium text-white md:text-2xl">
                      {questions[questionIndex].question}
                    </h2>

                    <div className="mt-8 flex flex-col gap-2">
                      {questions[questionIndex].answers.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => answerQuestion(opt.points)}
                          className="flex items-center justify-between gap-4 rounded-xl border border-white/15 px-5 py-3.5 text-left text-sm font-medium text-white/85 transition-[color,background-color,border-color,transform] duration-150 hover:border-indigo-400 hover:bg-white/5 active:scale-[0.96]"
                        >
                          {opt.label}
                          <ArrowRight className="size-4 shrink-0 text-white/30" aria-hidden />
                        </button>
                      ))}
                    </div>

                    <TextureButton variant="minimal" size="sm" className="mt-6 w-fit text-neutral-900" onClick={goBackQuestion}>
                      <ArrowLeft className="size-4" aria-hidden />
                      Atrás
                    </TextureButton>
                  </motion.div>
                )}

                {phase === "processing" && (
                  <motion.div
                    key="processing"
                    custom={direction}
                    variants={variants}
                    initial="initial"
                    animate="active"
                    exit="exit"
                    className="flex flex-col items-center gap-5 py-10 text-center"
                  >
                    <ProcessingOrb />
                    <div>
                      <p className="text-base font-medium text-white">Generando tu reporte, {name1}...</p>
                      <p className="mt-1 text-sm text-white/50">Estamos cruzando tus respuestas con {assessment.lawLabel}.</p>
                    </div>
                  </motion.div>
                )}

                {phase === "results" && (
                  <motion.div key="results" custom={direction} variants={variants} initial="initial" animate="active" exit="exit">
                    <span className="text-xs font-semibold tracking-[0.08em] text-indigo-300 uppercase">
                      Hallazgos para {name1}
                    </span>

                    {!formSubmitted ? (
                      <>
                        <h2 className="mt-2 text-2xl font-medium text-white">Tu resultado está listo</h2>
                        <p className="mt-2 text-sm text-white/60">
                          Completa tus datos y te mostramos el detalle completo frente a {assessment.lawLabel}.
                        </p>

                        <ul className="mt-6 flex flex-col gap-2.5">
                          {["Nivel de impacto", "Áreas a revisar", "Recomendaciones"].map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" aria-hidden />
                              {item}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 rounded-2xl bg-white p-4 md:p-6">
                          <HubSpotForm prefill={hubspotPrefill} onFormSubmitted={() => setFormSubmitted(true)} />
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="mt-2 text-2xl font-medium text-white">
                          {score} / {total} puntos
                        </h2>
                        <p className="mt-2 text-sm text-white/60">
                          Esto no es un veredicto de cumplimiento legal: son brechas operativas frente a {assessment.lawLabel}.
                          Te enviamos una copia de este detalle a tu correo.
                        </p>

                        {minimumGaps.length > 0 && (
                          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden />
                            <span>
                              {minimumGaps.length === 1 ? "Este punto es" : "Estos puntos son"} un requisito mínimo regulatorio de{" "}
                              {assessment.lawLabel} — son los más urgentes de cerrar.
                            </span>
                          </div>
                        )}

                        {gaps.length > 0 ? (
                          <ul className="mt-4 flex flex-col gap-3">
                            {gaps.map((f) => (
                              <li key={f.id} className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80">
                                <span
                                  className={cn("mt-0.5 size-1.5 shrink-0 rounded-full", f.isMinimum ? "bg-amber-400" : "bg-white/30")}
                                  aria-hidden
                                />
                                <span>
                                  {f.finding}
                                  {f.isMinimum && (
                                    <span className="ml-2 inline-block rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold tracking-[0.06em] text-amber-300 uppercase">
                                      Mínimo regulatorio
                                    </span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-6 flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                            No se identificaron brechas en las 10 preguntas de este diagnóstico.
                          </div>
                        )}

                        <div className="mt-8 flex flex-wrap gap-3">
                          <LinkButton href="https://www.truora.com" variant="minimal" size="lg" className="w-fit text-neutral-900">
                            Hablar con un especialista
                          </LinkButton>
                          <LinkButton href="/radar-regulatorio" variant="minimal" size="lg" className="w-fit text-neutral-900">
                            Volver al radar
                          </LinkButton>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </MotionConfig>
      </div>
    </TextureCardStyled>
  );
}
