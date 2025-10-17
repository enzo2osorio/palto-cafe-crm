import { getLastMonth } from "./getLastMonth"
import { getWeekly } from "./getWeekly"

export type DateRangeType = 'semanal' | 'mensual' | 'trimestral' | 'anual' | 'personalizado'

interface DateRange {
  startISO: string
  endISO: string
  periodCount: number
  labels: string[]
}

interface SinglePeriodRange {
  startISO: string
  endISO: string
  label: string
}

export interface CustomDateRange {
  startDate?: Date
  endDate?: Date
}

/**
 * Calcula el rango de fechas para un período único (último período) o rango personalizado
 */
export const getSinglePeriodRange = (type: DateRangeType, customRange?: CustomDateRange): SinglePeriodRange => {
  const now = new Date()
  
  switch (type) {
    case 'semanal': {
      // Última semana completa (lunes a domingo de la semana pasada)
      const weekData = getWeekly(-1) // Semana pasada
      return {
        startISO: weekData.startISO,
        endISO: weekData.endExclusiveISO,
        label: 'última semana completa'
      }
    }
    
    case 'mensual': {
      // Último mes completo
      const monthData = getLastMonth({ offset: -1 }) // Mes pasado
      return {
        startISO: monthData.startISO,
        endISO: monthData.endExclusiveISO,
        label: `último mes (${monthData.monthName})`
      }
    }
    
    case 'trimestral': {
      // Último trimestre completo
      const currentQuarter = Math.floor(now.getMonth() / 3)
      const lastQuarter = currentQuarter - 1
      const year = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear()
      const quarter = lastQuarter < 0 ? 3 : lastQuarter
      
      const startMonth = quarter * 3
      const startDate = new Date(year, startMonth, 1)
      const endDate = new Date(year, startMonth + 3, 1)
      
      const quarterNames = ['primer', 'segundo', 'tercer', 'cuarto']
      
      return {
        startISO: startDate.toISOString(),
        endISO: endDate.toISOString(),
        label: `último trimestre (${quarterNames[quarter]} trimestre ${year})`
      }
    }
    
    case 'anual': {
      // Último año completo
      const lastYear = now.getFullYear() - 1
      const startDate = new Date(lastYear, 0, 1) // 1 de enero del año pasado
      const endDate = new Date(lastYear + 1, 0, 1) // 1 de enero del año actual
      
      return {
        startISO: startDate.toISOString(),
        endISO: endDate.toISOString(),
        label: `último año (${lastYear})`
      }
    }
    
    case 'personalizado': {
      // Rango personalizado proporcionado por el usuario
      if (!customRange?.startDate || !customRange?.endDate) {
        // Fallback al último mes si no se proporcionan fechas
        return getSinglePeriodRange('mensual')
      }
      
      const startDate = new Date(customRange.startDate)
      startDate.setHours(0, 0, 0, 0) // Inicio del día
      
      const endDate = new Date(customRange.endDate)
      endDate.setHours(23, 59, 59, 999) // Final del día (23:59:59.999)
      
      // Crear fecha de fin exclusiva (día siguiente a las 00:00)
      const endExclusive = new Date(endDate)
      endExclusive.setDate(endExclusive.getDate() + 1)
      endExclusive.setHours(0, 0, 0, 0)
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })
      }
      
      return {
        startISO: startDate.toISOString(),
        endISO: endExclusive.toISOString(),
        label: `${formatDate(startDate)} a ${formatDate(new Date(customRange.endDate))}`
      }
    }
    
    default:
      return getSinglePeriodRange('mensual')
  }
}

/**
 * Calcula los rangos de fechas y etiquetas basado en el tipo de período
 */
export const getDateRangeByType = (type: DateRangeType): DateRange => {
  const now = new Date()
  
  switch (type) {
    case 'semanal': {
      // Últimas 6 semanas
      const periodCount = 6
      const labels: string[] = []
      
      for (let i = -(periodCount - 1); i <= 0; i++) {
        const weekData = getWeekly(i)
        labels.push(weekData.label)
      }
      
      const startWeek = getWeekly(-(periodCount - 1))
      const endWeek = getWeekly(1) // Lunes siguiente (exclusive)
      
      return {
        startISO: startWeek.startISO,
        endISO: endWeek.startISO,
        periodCount,
        labels
      }
    }
    
    case 'mensual': {
      // Últimos 6 meses
      const periodCount = 6
      const labels: string[] = []
      
      for (let i = -(periodCount - 1); i <= 0; i++) {
        const { monthName } = getLastMonth({ offset: i })
        labels.push(monthName)
      }
      
      const startMonth = new Date(now.getFullYear(), now.getMonth() - (periodCount - 1), 1)
      const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      
      return {
        startISO: startMonth.toISOString(),
        endISO: endMonth.toISOString(),
        periodCount,
        labels
      }
    }
    
    case 'trimestral': {
      // Últimos 4 trimestres
      const periodCount = 4
      const labels: string[] = []
      const currentQuarter = Math.floor(now.getMonth() / 3)
      const currentYear = now.getFullYear()
      
      for (let i = periodCount - 1; i >= 0; i--) {
        const quarter = (currentQuarter - i) % 4
        const year = currentYear - Math.floor((currentQuarter - (currentQuarter - i)) / 4)
        const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4']
        labels.push(`${quarterNames[quarter < 0 ? quarter + 4 : quarter]} ${year}`)
      }
      
      // Inicio del trimestre más antiguo
      const startQuarter = (currentQuarter - (periodCount - 1)) % 4
      const startYear = currentYear - Math.floor((periodCount - 1) / 4)
      const startMonth = (startQuarter < 0 ? startQuarter + 4 : startQuarter) * 3
      
      const startDate = new Date(startYear, startMonth, 1)
      const endDate = new Date(currentYear, (currentQuarter + 1) * 3, 1)
      
      return {
        startISO: startDate.toISOString(),
        endISO: endDate.toISOString(),
        periodCount,
        labels
      }
    }
    
    case 'anual': {
      // Últimos 3 años
      const periodCount = 3
      const labels: string[] = []
      const currentYear = now.getFullYear()
      
      for (let i = periodCount - 1; i >= 0; i--) {
        labels.push((currentYear - i).toString())
      }
      
      const startDate = new Date(currentYear - (periodCount - 1), 0, 1)
      const endDate = new Date(currentYear + 1, 0, 1)
      
      return {
        startISO: startDate.toISOString(),
        endISO: endDate.toISOString(),
        periodCount,
        labels
      }
    }
    
    case 'personalizado': {
      // Para el caso personalizado, retornamos valores por defecto
      // La lógica real del rango personalizado está en getSinglePeriodRange
      return getDateRangeByType('mensual')
    }
    
    default: {
      // Fallback al caso mensual
      return getDateRangeByType('mensual')
    }
  }
}

/**
 * Procesa registros y los agrupa por período según el tipo seleccionado
 */
export const groupRegistrosByPeriod = (
  registros: Array<{ fecha: string; monto: number }>,
  type: DateRangeType,
  dateRange: DateRange
): number[] => {
  const { startISO, periodCount } = dateRange
  const buckets = new Array(periodCount).fill(0)
  const startMs = new Date(startISO).getTime()
  
  registros.forEach(registro => {
    const fecha = new Date(registro.fecha)
    let periodIndex: number = -1 // Inicializar con valor por defecto
    
    switch (type) {
      case 'semanal': {
        const WEEK_MS = 7 * 24 * 60 * 60 * 1000
        periodIndex = Math.floor((fecha.getTime() - startMs) / WEEK_MS)
        break
      }
      
      case 'mensual': {
        const startDate = new Date(startISO)
        const diffMonths = (fecha.getFullYear() - startDate.getFullYear()) * 12 + 
                          (fecha.getMonth() - startDate.getMonth())
        periodIndex = diffMonths
        break
      }
      
      case 'trimestral': {
        const startDate = new Date(startISO)
        const startQuarter = Math.floor(startDate.getMonth() / 3)
        const fechaQuarter = Math.floor(fecha.getMonth() / 3)
        const yearDiff = fecha.getFullYear() - startDate.getFullYear()
        periodIndex = yearDiff * 4 + (fechaQuarter - startQuarter)
        break
      }
      
      case 'anual': {
        const startDate = new Date(startISO)
        periodIndex = fecha.getFullYear() - startDate.getFullYear()
        break
      }
      
      case 'personalizado': {
        // Para rangos personalizados, todos los registros van al primer bucket
        periodIndex = 0
        break
      }
    }
    
    if (periodIndex >= 0 && periodIndex < periodCount) {
      buckets[periodIndex] += registro.monto
    }
  })
  
  return buckets
}