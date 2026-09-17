/**
 * Marca de "aquí empieza una sección nueva" sobre los PageRails: una línea
 * horizontal fina de punta a punta (entre los dos rails verticales) más dos
 * escuadras en las esquinas superior izquierda/derecha, alineadas con el
 * mismo x que las líneas verticales. No necesita saber la posición real en
 * píxeles del rail (que corre por todo el documento): como cada sección
 * arranca justo donde termina la anterior en el flujo normal, un tick en
 * `top-0` de su propia sección cae exactamente donde el rail continuo pasa
 * por ese punto — así la línea horizontal divide visualmente cada sección
 * de la anterior en toda la página, sin tocar cada sección una por una.
 * Un solo tono (claro sobre el fondo azul medianoche): ya no hace falta un
 * modo "light"/"dark" separado ahora que TODO el sitio es oscuro.
 */
export function SectionTick() {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute top-0 right-3 left-3 h-px bg-white/15 md:right-7 md:left-7 lg:right-10 lg:left-10" />
      <span aria-hidden className="pointer-events-none absolute top-0 left-3 h-3 w-3 border-t border-l border-white/25 md:left-7 lg:left-10" />
      <span aria-hidden className="pointer-events-none absolute top-0 right-3 h-3 w-3 border-t border-r border-white/25 md:right-7 lg:right-10" />
    </>
  );
}
