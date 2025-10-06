import { getAllOwners } from "../getOwners"
import { getAccountsAssociatedToOwners } from "../getAccountsAssociatedToOwners"
import { getAllRegistros } from "../paginationHelper"
import type { GraphicProps } from "@/components/Dashboard/Inicio-module/inicio-module"
import type { DateRangeType } from "@/utils/date/getDateRangeByType"
import { getDateRangeByType, groupRegistrosByPeriod } from "@/utils/date/getDateRangeByType"

interface RegistroSimple {
  monto: number;
  tipo_movimiento: string;
  cuenta_contable_id: string;
  fecha: string;
}

/**
 * Obtiene datos de ingresos/egresos por owner con rangos de fecha dinámicos
 */
export const getDataToOwnersByDateRange = async (
  tipo_movimiento: string, 
  dateRangeType: DateRangeType
): Promise<GraphicProps[]> => {
  try {
    const owners = await getAllOwners()
    if (!owners || owners.length === 0) {
      return []
    }

    const accountsMap = new Map<string, string[]>()

    for (const owner of owners) {
      const rows = await getAccountsAssociatedToOwners(owner.id)
      const ids = (rows ?? [])
        .map((x: any) => typeof x === "string" ? x : x?.cuenta_contable_id ?? x?.id)
        .filter((v: any): v is string => typeof v === "string" && v.length > 0)
      
      accountsMap.set(owner.name, ids)
    }

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
        campos: "monto, tipo_movimiento, cuenta_contable_id, fecha",
        batchSize: 1000,
        logProgress: false
      }
    );

    const results: GraphicProps[] = []

    for (const [ownerName, accountsIds] of accountsMap) {
      if (!accountsIds || accountsIds.length === 0) continue
      
      // Filtrar registros de este owner
      const registrosOwner = allData.filter(r => 
        accountsIds.includes(r.cuenta_contable_id)
      );

      // Usar la función de agrupación dinámica
      const monthlyIngresos = groupRegistrosByPeriod(
        registrosOwner.map(r => ({ fecha: r.fecha, monto: r.monto })),
        dateRangeType,
        dateRange
      );

      results.push({ owner: ownerName, monthlyIngresos })
    }

    return results
  } catch (error) {
    console.error("Error in getDataToOwnersByDateRange:", error)
    return []
  }
}