"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Aparición suave al entrar al viewport: leve ascenso, desenfoque que se
 * disipa y fade. Una sola vez por elemento; sin efecto si el usuario
 * prefiere movimiento reducido. (Mismo patrón que onboarding_dashboard/
 * src/components/dashboard/reveal.tsx, para transiciones consistentes
 * entre secciones del sitio.)
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
