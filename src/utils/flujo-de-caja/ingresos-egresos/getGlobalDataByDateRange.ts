import { getAllRegistros } from "../../registros/paginationHelper"
import type { DateRangeType } from "@/utils/date/getDateRangeByType"
import { getDateRangeByType, groupRegistrosByPeriod } from "@/utils/date/getDateRangeByType"

interface RegistroSimple {
  monto: number;
  tipo_movimiento: string;
  fecha: string;
}

/**
 * Obtiene datos globales de ingresos/egresos con rangos de fecha dinámicos
 */
export const getGlobalDataByDateRange = async (
  tipo_movimiento: string, 
  dateRangeType: DateRangeType
): Promise<number[]> => {
  try {
    // Calcular el rango de fechas dinámico
    const dateRange = getDateRangeByType(dateRangeType)

    // UNA SOLA CONSULTA optimizada con paginación automática
    const allData: RegistroSimple[] = await getAllRegistros<RegistroSimple>(
      {
        tipoMovimiento: tipo_movimiento,
        fechaDesde: dateRange.startISO,
        fechaHasta: dateRange.endISO
      },
      {
        campos: "monto, tipo_movimiento, fecha",
        batchSize: 1000,
        logProgress: false
      }
    );

    // Usar la función de agrupación dinámica
    const periodData = groupRegistrosByPeriod(
      allData.map(r => ({ fecha: r.fecha, monto: r.monto })),
      dateRangeType,
      dateRange
    );

    return periodData
  } catch (error) {
    console.error("Error in getGlobalDataByDateRange:", error)
    return []
  }
}