export const getWeekly = (offsetWeeks = 0, options?: { locale?: string; capitalizar?: boolean }) => {
  const locale = options?.locale ?? 'es-ES';
  const capitalizar = options?.capitalizar ?? true;

  // referencia al "día actual" sin hora para evitar desbordes por hora local
  const now = new Date();
  const ref = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // getDay: 0 = domingo ... 6 = sábado
  // queremos lunes como inicio -> daysSinceMonday: 0 para lunes, 6 para domingo
  const day = ref.getDay();
  const daysSinceMonday = (day + 6) % 7;

  // calcular primer día de la semana (lunes) aplicando offset de semanas
  const start = new Date(ref);
  start.setDate(ref.getDate() - daysSinceMonday + offsetWeeks * 7);
  start.setHours(0, 0, 0, 0);
  start.setMilliseconds(0);

  // endExclusive: lunes siguiente a las 00:00 (útil para queries .gte('fecha', start).lt('fecha', endExclusive))
  const endExclusive = new Date(start);
  endExclusive.setDate(start.getDate() + 7);
  endExclusive.setHours(0, 0, 0, 0);
  endExclusive.setMilliseconds(0);

  // domingo al final (útil para mostrar en UI): domingo 23:59:59.999
  const sunday = new Date(endExclusive);
  sunday.setMilliseconds(-1); // un ms antes del next monday -> domingo 23:59:59.999

  // helper para generar string con offset timezone (igual que getDates util)
  const toOffsetISOString = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const offMin = -d.getTimezoneOffset();
    const sign = offMin >= 0 ? '+' : '-';
    const abs = Math.abs(offMin);
    const offH = String(Math.floor(abs / 60)).padStart(2, '0');
    const offM = String(abs % 60).padStart(2, '0');
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}${sign}${offH}:${offM}`;
  };

  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', day: '2-digit', month: 'short' });
  const mondayLabel = formatter.format(start);
  const sundayLabel = formatter.format(sunday);
  let label = `${mondayLabel} - ${sundayLabel}`;
  if (capitalizar) label = label.charAt(0).toUpperCase() + label.slice(1);

  // array de días (Date objects) de lunes a domingo
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }

  return {
    start, // Monday 00:00 local (Date)
    endExclusive, // next Monday 00:00 local (Date) -> use as exclusive upper bound
    sunday, // Sunday 23:59:59.999 (Date) useful for display
    startISO: toOffsetISOString(start),
    endExclusiveISO: toOffsetISOString(endExclusive),
    sundayISO: toOffsetISOString(sunday),
    label,
    days, // array of Date for each day in the week (00:00 local)
  } as const;
};