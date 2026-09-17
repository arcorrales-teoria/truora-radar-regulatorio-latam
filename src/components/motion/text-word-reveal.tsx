"use client";

import { motion, useInView, useReducedMotion, type UseInViewOptions } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

/**
 * TextWordReveal: mismo mecanismo que el "ChromaticTextReveal" de
 * referencia (prefijo fijo + palabras que rotan, con barrido de
 * revelado y overlay de tamaño para que el layout no salte), pero sin
 * su gradiente arcoíris: la marca Truora prohíbe degradados. El barrido
 * usa un solo color sólido de marca revelado con clip-path, más el
 * mismo blur/ascenso de entrada.
 */

export type TextWordRevealProps = {
  prefix: string;
  words: string[];
  color?: string;
  duration?: number;
  delay?: number;
  pauseDuration?: number;
  loop?: boolean;
  startOnView?: boolean;
  once?: boolean;
  inViewMargin?: UseInViewOptions["margin"];
  className?: string;
  /**
   * Si se pasa, la palabra activa queda controlada desde afuera (p. ej.
   * sincronizada con el país activo de CountryTabs) y el temporizador
   * interno se desactiva por completo: ya no avanza solo, avanza cuando
   * cambia este índice.
   */
  activeIndex?: number;
};

export function TextWordReveal({
  prefix,
  words,
  color = "#4f46e5",
  duration = 0.9,
  delay = 0,
  pauseDuration = 1.8,
  loop = true,
  startOnView = true,
  once = true,
  inViewMargin,
  className,
  activeIndex: controlledIndex,
}: TextWordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once, margin: inViewMargin, amount: 0.4 });
  const shouldReveal = !startOnView || isInView || reduceMotion;
  const hasWords = words.length > 0;
  const isControlled = controlledIndex !== undefined;
  const activeIndex = hasWords ? (isControlled ? controlledIndex % words.length : wordIndex % words.length) : 0;
  const activeWord = words[activeIndex] ?? "";
  const sizingWords = Array.from(new Set(words));

  const clearPendingWord = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNextWord = useCallback(() => {
    clearPendingWord();
    if (isControlled) return; // el avance lo dispara quien controle el índice, no un timer propio
    const isLastWord = activeIndex === words.length - 1;
    if (reduceMotion || !shouldReveal || words.length < 2 || (isLastWord && !loop)) return;
    timerRef.current = window.setTimeout(() => {
      setWordIndex((index) => (index + 1) % words.length);
    }, pauseDuration * 1000);
  }, [activeIndex, clearPendingWord, isControlled, loop, pauseDuration, reduceMotion, shouldReveal, words.length]);

  useEffect(() => clearPendingWord, [clearPendingWord]);

  return (
    <span ref={ref} className={cn("inline", className)}>
      {prefix}
      {hasWords ? " " : null}
      {hasWords ? (
        <span className="relative inline-grid align-baseline">
          {sizingWords.map((word) => (
            <span key={word} aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
              {word}
            </span>
          ))}
          <motion.span
            key={`${activeWord}-${activeIndex}`}
            aria-hidden
            initial={
              reduceMotion
                ? false
                : { opacity: 0.4, filter: "blur(6px)", y: 5, clipPath: "inset(0 100% 0 0)" }
            }
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              clipPath: shouldReveal ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            }}
            transition={{
              clipPath: reduceMotion ? { duration: 0 } : { duration, delay, ease: EASE_IN_OUT },
              opacity: reduceMotion ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT },
              filter: reduceMotion ? { duration: 0 } : { duration: 0.36, ease: EASE_OUT },
              y: reduceMotion ? { duration: 0 } : { duration: 0.36, ease: EASE_OUT },
            }}
            onAnimationComplete={scheduleNextWord}
            className="absolute start-0 top-0 col-start-1 row-start-1 whitespace-nowrap [contain:paint]"
            style={{ color }}
          >
            {activeWord}
          </motion.span>
          <span className="sr-only">{activeWord}</span>
        </span>
      ) : null}
    </span>
  );
}
