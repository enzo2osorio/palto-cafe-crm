import supabase from '@/lib/supabaseClient'
import type { MovimientosSemanales } from '@/types/movimientosSemanales'
import { getWeekly } from "@/utils/date/getWeekly"

const WEEK_MS = 7 * 24 * 60 * 60 * 1000


// obtiene movimientos agrupados por semana (oldest -> newest)
// weeks: cantidad de semanas a devolver (por defecto 7)
export const getMovimientosSemanales = async (tipo_movimiento: string, weeks = 7) : Promise<MovimientosSemanales> => {
  try {
    // rango: desde el lunes de (weeks-1) semanas atrás hasta el lunes siguiente (exclusive)
    const startWeek = getWeekly(-(weeks - 1)) // lunes de la semana más antigua
    const endNextWeek = getWeekly(1) // lunes siguiente a la actual (exclusive)
    const startISO = startWeek.startISO
    const endISO = endNextWeek.startISO

    const { data : rows, error } = await supabase
      .from('registros')
      .select('monto, tipo_movimiento, fecha')
      .eq('tipo_movimiento', tipo_movimiento)
      .gte('fecha', startISO)
      .lt('fecha', endISO)

    if (error) {
      console.error('Error fetching weekly registros:', error)
      return { labels: [], buckets: [], raw: [], startISO, endISO }
    }



    // preparar buckets y etiquetas
    const buckets = new Array<number>(weeks).fill(0)
    const labels: string[] = []
    for (let i = 0; i < weeks; i++) {
      const w = getWeekly(-(weeks - 1) + i)
      labels.push(w.label)
    }

    const startMs = new Date(startISO).getTime()
    rows.forEach((r: any) => {
      const fecha = new Date(r.fecha)
      const idx = Math.floor((fecha.getTime() - startMs) / WEEK_MS)
      if (idx >= 0 && idx < weeks) {
        buckets[idx] += Number(r.monto) || 0
      }
    })

    return {
      labels,      // etiquetas por semana (oldest -> newest)
      buckets,     // totales por semana (same order)
      raw: rows,
      startISO,
      endISO
    }
  } catch (err) {
    console.error('Error in getMovimientosSemanales:', err)
    return { labels: [], buckets: [], raw: [], startISO: '', endISO: '' }
  }
}