"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Copiado tal cual de onboarding_dashboard/src/components/ui/texture-button.tsx
 * (el mismo componente real que usa https://truora-onboarding-dashboard.vercel.app/playground).
 * Sin tokens de marca Truora: todos los colores son Tailwind puro (indigo,
 * red, neutral, black), igual que en el original. Ese proyecto nunca usa
 * `asChild` con un <Link> (solo <button onClick>), así que el patrón de
 * dos capas (wrapper exterior + div interior) nunca choca con Radix Slot
 * ahí. En este proyecto SÍ necesitamos botones que sean enlaces, así que
 * para eso existe `LinkButton` más abajo, que aplica las mismas clases
 * directo sobre un <Link> sin pasar por Slot.
 */

const buttonVariantsOuter = cva("transition-[transform,box-shadow] duration-200 active:translate-y-[1px]", {
  variants: {
    variant: {
      primary:
        "w-full border border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out shadow-[0px_1px_1px_rgba(0,0,0,0.12),0px_6px_12px_-4px_rgba(20,21,38,0.35)] hover:shadow-[0px_1px_1px_rgba(0,0,0,0.12),0px_8px_16px_-4px_rgba(20,21,38,0.4)] active:shadow-[0px_1px_2px_rgba(0,0,0,0.2)] ",
      accent:
        "w-full border-[1px] border-black/10 bg-gradient-to-b from-indigo-300/90 to-indigo-500 p-[1px] transition duration-300 ease-in-out shadow-[0px_1px_1px_rgba(20,21,38,0.1),0px_6px_14px_-4px_rgba(79,70,229,0.45)] hover:shadow-[0px_1px_1px_rgba(20,21,38,0.1),0px_8px_20px_-4px_rgba(79,70,229,0.55)] active:shadow-[0px_1px_3px_rgba(79,70,229,0.35)] ",
      destructive:
        "w-full border-[1px] border-black/10 bg-gradient-to-b from-red-300/90 to-red-500 p-[1px] transition duration-300 ease-in-out shadow-[0px_1px_1px_rgba(20,21,38,0.1),0px_6px_14px_-4px_rgba(220,38,38,0.4)] active:shadow-[0px_1px_3px_rgba(220,38,38,0.3)] ",
      secondary:
        "w-full border-[1px] border-black/20 bg-white/50 p-[1px] transition duration-300 ease-in-out shadow-[0px_1px_1px_rgba(20,21,38,0.06),0px_4px_10px_-4px_rgba(38,36,110,0.18)] active:shadow-[0px_1px_2px_rgba(20,21,38,0.08)] ",
      minimal:
        "group/texture-button w-full border-[1px] border-black/20 bg-white/50 p-[1px] shadow-[0px_1px_1px_rgba(20,21,38,0.06),0px_4px_10px_-4px_rgba(38,36,110,0.18)] hover:shadow-[0px_1px_1px_rgba(20,21,38,0.07),0px_6px_14px_-4px_rgba(38,36,110,0.22)] active:shadow-[0px_1px_2px_rgba(20,21,38,0.08)] active:bg-neutral-200 hover:bg-gradient-to-t hover:from-neutral-100 to-white",
      inverse: "w-full border-[1px] border-black/10 bg-white p-[1px] shadow-[0px_1px_1px_rgba(20,21,38,0.06),0px_4px_10px_-4px_rgba(38,36,110,0.18)]",
      icon: "group/texture-button rounded-full border border-black/10 bg-white/50 p-[1px] shadow-[0px_1px_1px_rgba(20,21,38,0.06),0px_4px_10px_-4px_rgba(38,36,110,0.18)] active:shadow-[0px_1px_2px_rgba(20,21,38,0.08)] active:bg-neutral-200 hover:bg-gradient-to-t hover:from-neutral-100 to-white",
      /**
       * "Vidrio oscuro": mismo lenguaje que las cards de referencia
       * (borde sutil + fondo apenas más claro que el fondo azul
       * medianoche, nada de degradado brillante) — para que los botones
       * dejen de sentirse "perdidos" al lado de cards con esa misma
       * textura, en vez del contraste fuerte que traía "minimal" (blanco
       * sólido) contra un sitio ya oscuro.
       */
      glass:
        "group/texture-button w-full border-[1px] border-white/15 bg-white/5 p-[1px] transition duration-300 ease-in-out shadow-[0px_1px_1px_rgba(0,0,0,0.2),0px_6px_14px_-4px_rgba(0,0,0,0.35)] hover:border-white/25 hover:shadow-[0px_1px_1px_rgba(0,0,0,0.2),0px_8px_20px_-4px_rgba(0,0,0,0.4)] active:shadow-[0px_1px_3px_rgba(0,0,0,0.3)]",
    },
    size: {
      sm: "rounded-[6px]",
      default: "rounded-[12px]",
      lg: "rounded-[12px]",
      icon: "rounded-full",
    },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

const innerDivVariants = cva("flex h-full w-full items-center justify-center text-muted-foreground", {
  variants: {
    variant: {
      primary:
        "gap-2 bg-gradient-to-b from-neutral-800 to-black text-sm text-white/90 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.18),inset_0px_-1.5px_1px_rgba(0,0,0,0.5)] transition duration-300 ease-in-out hover:from-stone-800 hover:to-neutral-800/70 active:bg-gradient-to-b active:from-black active:to-black ",
      accent:
        "gap-2 bg-gradient-to-b from-indigo-400 to-indigo-600 text-sm text-white/90 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.4),inset_0px_-1.5px_1px_rgba(30,27,110,0.35)] transition duration-300 ease-in-out hover:bg-gradient-to-b hover:from-indigo-400/70 hover:to-indigo-600/70 active:bg-gradient-to-b active:from-indigo-400/80 active:to-indigo-600/80",
      destructive:
        "gap-2 bg-gradient-to-b from-red-400/60 to-red-500/60 text-sm text-white/90 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.35),inset_0px_-1.5px_1px_rgba(127,29,29,0.35)] transition duration-300 ease-in-out hover:bg-gradient-to-b hover:from-red-400/70 hover:to-red-600/70 active:bg-gradient-to-b active:from-red-400/80 active:to-red-600/80",
      secondary:
        "bg-gradient-to-b from-neutral-100/80 to-neutral-200/50 text-sm shadow-[inset_0px_1px_0px_rgba(255,255,255,0.9),inset_0px_-1px_1px_rgba(20,21,38,0.06)] transition duration-300 ease-in-out hover:bg-gradient-to-b hover:from-neutral-200/40 hover:to-neutral-300/60 active:bg-gradient-to-b active:from-neutral-200/60 active:to-neutral-300/70",
      minimal:
        "bg-gradient-to-b from-white to-neutral-50/50 text-sm shadow-[inset_0px_1px_0px_rgba(255,255,255,0.95),inset_0px_-1px_1px_rgba(20,21,38,0.05)] transition duration-300 ease-in-out group-hover/texture-button:bg-gradient-to-b group-hover/texture-button:from-neutral-50/50 group-hover/texture-button:to-neutral-100/60 group-active/texture-button:bg-gradient-to-b group-active/texture-button:from-neutral-100/60 group-active/texture-button:to-neutral-100/90",
      inverse: "bg-white text-sm text-black transition duration-300 ease-in-out hover:bg-neutral-50 active:bg-neutral-100",
      icon: "bg-gradient-to-b from-white to-neutral-50/50 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.95),inset_0px_-1px_1px_rgba(20,21,38,0.05)] group-active/texture-button:bg-neutral-200 rounded-full",
      glass:
        "gap-2 bg-white/5 text-sm text-white shadow-[inset_0px_1px_0px_rgba(255,255,255,0.08)] transition duration-300 ease-in-out group-hover/texture-button:bg-white/10 group-active/texture-button:bg-white/15",
    },
    size: {
      sm: "text-xs rounded-[4px] px-4 py-1",
      default: "text-sm rounded-[10px] px-4 py-2",
      lg: "text-base rounded-[10px] px-4 py-2",
      icon: "rounded-full p-1",
    },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

export interface TextureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "destructive" | "minimal" | "inverse" | "icon" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const TextureButton = React.forwardRef<HTMLButtonElement, TextureButtonProps>(
  ({ children, variant = "primary", size = "default", asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariantsOuter({ variant, size }), className)} ref={ref} {...props}>
        <div className={cn(innerDivVariants({ variant, size }))}>{children}</div>
      </Comp>
    );
  },
);
TextureButton.displayName = "TextureButton";

/**
 * Mismas clases exactas que TextureButton, pero aplicadas directo sobre un
 * <Link>, sin pasar por Slot: evita por completo el problema de que Slot
 * solo fusiona props sobre SU ÚNICO hijo (el div interior), lo que dejaba
 * el <Link> anidado dentro del botón en vez de SER el botón.
 */
import Link, { type LinkProps } from "next/link";

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "default",
  className,
  ...props
}: LinkProps & {
  href: string;
  children: React.ReactNode;
  variant?: TextureButtonProps["variant"];
  size?: TextureButtonProps["size"];
  className?: string;
}) {
  return (
    <Link href={href} className={cn(buttonVariantsOuter({ variant, size }), "inline-flex", className)} {...props}>
      <span className={cn(innerDivVariants({ variant, size }))}>{children}</span>
    </Link>
  );
}

export { TextureButton, buttonVariantsOuter, innerDivVariants };
