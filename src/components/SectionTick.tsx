/**
 * Marca de "aquí empieza una sección nueva" sobre los PageRails: dos
 * escuadras finas en la esquina superior izquierda/derecha de la sección,
 * alineadas con el mismo x que las líneas verticales. No necesita saber la
 * posición real en píxeles del rail (que corre por todo el documento):
 * como cada sección arranca justo donde termina la anterior en el flujo
 * normal, un tick en `top-0` de su propia sección cae exactamente donde el
 * rail continuo pasa por ese punto.
 */
export function SectionTick({ tone = "light" }: { tone?: "light" | "dark" }) {
  const color = tone === "dark" ? "border-white/25" : "border-indigo-700/55";

  return (
    <>
      <span aria-hidden className={`pointer-events-none absolute top-0 left-3 h-3 w-3 border-t border-l md:left-7 lg:left-10 ${color}`} />
      <span aria-hidden className={`pointer-events-none absolute top-0 right-3 h-3 w-3 border-t border-r md:right-7 lg:right-10 ${color}`} />
    </>
  );
}
