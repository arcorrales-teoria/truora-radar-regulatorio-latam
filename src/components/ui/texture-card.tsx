import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Adaptado de la referencia "TextureCard" que compartió el usuario: mismo
 * truco de bordes anidados (4 capas, cada una un pelo más chica) para dar
 * una sensación de bisel/profundidad. Un solo tema oscuro (índigo, para
 * coherencia con el resto de tarjetas oscuras del sitio) en vez del
 * light/dark de la referencia, porque estas cards siempre van sobre fondo
 * claro como elementos oscuros intencionales, no cambian con el tema.
 */

const TextureCardStyled = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-[24px] border border-black/40 bg-gradient-to-b from-indigo-900 to-indigo-950",
        className,
      )}
      {...props}
    >
      {/*
        `h-full flex flex-col` en CADA anillo, no solo en el más externo:
        si solo el div raíz tiene `h-full`, los anillos internos (sin
        altura propia) se quedan del alto de su contenido, así que el
        contenido real (header/content/footer) nunca llega a estirarse
        hasta el fondo de la card. Eso hacía que las cards con menos texto
        (como Chile) mostraran el pie más arriba que las demás.
      */}
      <div className="flex h-full flex-col rounded-[23px] border border-black/30">
        <div className="flex h-full flex-col rounded-[22px] border border-white/10">
          <div className="flex h-full flex-col rounded-[21px] border border-black/20">
            <div className="flex h-full w-full flex-col rounded-[20px] border border-white/5 text-white">
              {children}
            </div>
          </div>
        </div>
      </div>
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
