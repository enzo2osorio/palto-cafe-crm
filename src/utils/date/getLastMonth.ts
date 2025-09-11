/**
 * Devuelve el rango de fechas de un mes relativo al actual:
 * - offset: 0 = mes actual, -1 = mes anterior, 1 = mes siguiente, etc.
 * - start: primer día del mes a las 00:00:00.000 (local)
 * - endExclusive: primer día del mes siguiente a las 00:00:00.000 (local)
 * Incluye el nombre del mes en español y el año.
 *
 * Útil para consultas tipo:
 *   .gte('fecha', startISO).lt('fecha', endExclusiveISO)
 */
export const getLastMonth = (
  options?: { locale?: string; capitalizar?: boolean; offset?: number }
) => {
  const locale = options?.locale ?? "es-ES";
  const capitalizar = options?.capitalizar ?? true;
  const offset = options?.offset ?? 0;

  const now = new Date();
  // Calcula el mes y año objetivo según el offset
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1, 0, 0, 0, 0);
  const start = new Date(target.getFullYear(), target.getMonth(), 1, 0, 0, 0, 0);
  const endExclusive = new Date(target.getFullYear(), target.getMonth() + 1, 1, 0, 0, 0, 0);

  const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
  let monthName = formatter.format(start);
  if (capitalizar && monthName) {
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }

  return {
    monthName,
    year: start.getFullYear(),
    start, // Date (zona horaria local)
    endExclusive, // Date (zona horaria local), límite exclusivo
    startISO: start.toISOString(), // ISO UTC para DB
    endExclusiveISO: endExclusive.toISOString(), // ISO UTC para DB
    offset,
  } as const;
};

export type LastMonthRange = ReturnType<typeof getLastMonth>;