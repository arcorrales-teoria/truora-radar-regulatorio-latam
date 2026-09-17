import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * "Vidrio oscuro": borde sutil + relleno apenas más claro que el fondo azul
 * medianoche (`bg-white/5`, sin color sólido) — mismo lenguaje que
 * `TextureButton`'s `variant="glass"`, para que botones y cards dejen de
 * sentirse como dos sistemas distintos ("los botones no parecen iguales,
 * se sienten un poco perdidos"). Reemplaza el relleno sólido `indigo-950`
 * que se usó cuando el fondo de página recién había vuelto a azul
 * medianoche — con la página ya oscura, un panel también sólido se comía
 * el contraste que sí tiene un borde translúcido.
 */

const TextureCardStyled = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-[24px] border border-white/15 bg-white/5 shadow-[0px_1px_1px_rgba(0,0,0,0.2),0px_6px_14px_-4px_rgba(0,0,0,0.35)] text-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
TextureCardStyled.displayName = "TextureCardStyled";

const TextureCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("px-5 pt-5 pb-3", className)} {...props} />,
);
TextureCardHeader.displayName = "TextureCardHeader";

const TextureCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-base font-semibold leading-tight text-white", className)} {...props} />
  ),
);
TextureCardTitle.displayName = "TextureCardTitle";

const TextureCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-white/80", className)} {...props} />,
);
TextureCardDescription.displayName = "TextureCardDescription";

const TextureCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-1 px-5 py-4", className)} {...props} />,
);
TextureCardContent.displayName = "TextureCardContent";

const TextureCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between gap-2 px-5 py-4", className)} {...props} />
  ),
);
TextureCardFooter.displayName = "TextureCardFooter";

function TextureSeparator({ className }: { className?: string }) {
  return <div className={cn("border-t border-white/10", className)} />;
}

export {
  TextureCardStyled,
  TextureCardHeader,
  TextureCardTitle,
  TextureCardDescription,
  TextureCardContent,
  TextureCardFooter,
  TextureSeparator,
};
