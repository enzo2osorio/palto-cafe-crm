import { getAllOwners } from "../getOwners"
import { getAccountsAssociatedToOwners } from "../getAccountsAssociatedToOwners"
import { getAllRegistros } from "../paginationHelper"
import type { GraphicProps } from "@/components/Dashboard/Inicio-module/inicio-module"

interface RegistroSimple {
  monto: number;
  tipo_movimiento: string;
  cuenta_contable_id: string;
  fecha: string;
}

export const getMonthlyVentasToOwners_OPTIMIZED = async (tipo_movimiento: string) => {
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

    // Calcular rango de 6 meses
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // UNA SOLA CONSULTA optimizada con paginación automática
    const allData: RegistroSimple[] = await getAllRegistros<RegistroSimple>(
      {
        tipoMovimiento: tipo_movimiento,
        fechaDesde: startDate.toISOString(),
        fechaHasta: endDate.toISOString()
      },
      {
        campos: "monto, tipo_movimiento, cuenta_contable_id, fecha",
        batchSize: 1000,
        logProgress: false
      }
    );

    // Procesar todos los datos en memoria (mucho más rápido)
    const results: GraphicProps[] = []

    for (const [ownerName, accountsIds] of accountsMap) {
      if (!accountsIds || accountsIds.length === 0) continue

      const monthlyIngresos = Array(6).fill(0)
      
      // Filtrar registros de este owner
      const registrosOwner = allData.filter(r => 
        accountsIds.includes(r.cuenta_contable_id)
      );

      // Procesar cada registro y asignarlo al mes correcto
      registrosOwner.forEach(r => {
        const date = new Date(r.fecha)
        const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
        
        if (diffMonths >= 0 && diffMonths < 6) {
          const index = 5 - diffMonths // index 0 = mes más viejo, index 5 = mes actual
          monthlyIngresos[index] += r.monto
        }
      });

      results.push({ owner: ownerName, monthlyIngresos })
    }

    return results
  } catch (error) {
    console.error("Error in getMonthlyVentasToOwners_OPTIMIZED:", error)
    return []
  }
}