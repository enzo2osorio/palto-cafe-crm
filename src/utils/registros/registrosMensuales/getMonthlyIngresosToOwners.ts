import supabase from "@/lib/supabaseClient"
import { getAllOwners } from "../getOwners"
import { getAccountsAssociatedToOwners } from "../getAccountsAssociatedToOwners"
import type { GraphicProps } from "@/components/Dashboard/Inicio-module/inicio-module"

export const getMonthlyVentasToOwners = async (tipo_movimiento : string) => {
  try {
    const owners = await getAllOwners()
    if (!owners || owners.length === 0) return []

    const accountsMap = new Map<string, string[]>()

    for (const owner of owners) {
      const rows = await getAccountsAssociatedToOwners(owner.id)
      const ids = (rows ?? [])
        .map((x: any) =>
          typeof x === "string" ? x : x?.cuenta_contable_id ?? x?.id
        )
        .filter((v: any): v is string => typeof v === "string" && v.length > 0)

      accountsMap.set(owner.name, ids)
    }

    // Calcular el rango de los últimos 6 meses
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1) // inicio de 6 meses atrás
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1) // inicio del mes siguiente

    // fetch global de registros
    const { data, error } = await supabase
      .from("registros")
      .select("monto, tipo_movimiento, cuenta_contable_id, fecha")
      .gte("fecha", startDate.toISOString())
      .lt("fecha", endDate.toISOString())

    if (error) {
      console.error("Error fetching monthly registros:", error)
      return []
    }

    const results: GraphicProps[] = []

    for (const [ownerName, accountsIds] of accountsMap) {
      if (!accountsIds || accountsIds.length === 0) continue

      // filtrar registros solo de este dueño
      const registrosOwner = (data ?? []).filter((r) =>
        accountsIds.includes(r.cuenta_contable_id)
      )

      // inicializar array de 6 meses en 0
      const monthlyIngresos = Array(6).fill(0)

      registrosOwner.forEach((r) => {
        if (r.tipo_movimiento !== tipo_movimiento) return
        const date = new Date(r.fecha)
        const diffMonths =
          (now.getFullYear() - date.getFullYear()) * 12 +
          (now.getMonth() - date.getMonth())

        if (diffMonths >= 0 && diffMonths < 6) {
          // index 0 = mes más viejo, index 5 = mes actual
          const index = 5 - diffMonths
          monthlyIngresos[index] += r.monto
        }
      })

      results.push({ owner: ownerName, monthlyIngresos })
    }

    return results
  } catch (error) {
    console.error("Error in getMonthlyIngresosToOwners:", error)
    return []
  }
}
