import supabase from "@/lib/supabaseClient"
import { getAllOwners } from "../getOwners"
import { getAccountsAssociatedToOwners } from "../getAccountsAssociatedToOwners"
import type { GraphicProps } from "@/components/Dashboard/Inicio-module/inicio-module"

export const getMonthlyVentasToOwners = async (tipo_movimiento : string) => {
  try {
    const owners = await getAllOwners()
    if (!owners || owners.length === 0) {
      console.warn('❌ No se encontraron owners');
      return []
    }
    
    console.log('👥 Owners encontrados:', owners.length, owners.map(o => o.name));

    const accountsMap = new Map<string, string[]>()

    for (const owner of owners) {
      const rows = await getAccountsAssociatedToOwners(owner.id)
      const ids = (rows ?? [])
        .map((x: any) =>
          typeof x === "string" ? x : x?.cuenta_contable_id ?? x?.id
        )
        .filter((v: any): v is string => typeof v === "string" && v.length > 0)

      console.log(`🏦 Cuentas para ${owner.name}:`, ids.length, ids);
      accountsMap.set(owner.name, ids)
    }

    // Calcular el rango de los últimos 6 meses
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1) // inicio de 6 meses atrás
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1) // inicio del mes siguiente

    // fetch global de registros - SIN LÍMITE usando range para traer TODOS
    const { data, error, count } = await supabase
      .from("registros")
      .select("monto, tipo_movimiento, cuenta_contable_id, fecha", { count: 'exact' })
      .gte("fecha", startDate.toISOString())
      .lt("fecha", endDate.toISOString())
      .range(0, 10000) // Usar range en lugar de limit// Aumentar límite explícitamente

    if (error) {
      console.error("Error fetching monthly registros:", error)
      return []
    }

    console.log(`📊 Total registros encontrados:`, data?.length || 0);
    console.log(`� Total registros en DB (count):`, count || 'desconocido');
    console.log(`�📅 Rango de fechas: ${startDate.toISOString().split('T')[0]} hasta ${endDate.toISOString().split('T')[0]}`);
    
    // ALERTA: verificar si obtuvimos TODOS los registros
    if (count && data && data.length < count) {
      console.error(`🚨 REGISTROS FALTANTES: Se obtuvieron ${data.length} de ${count} registros totales. Faltan ${count - data.length} registros!`);
    } else if (data && data.length >= 1000) {
      console.warn(`⚠️ POSIBLE LÍMITE ALCANZADO: Se encontraron exactamente ${data.length} registros. Puede que haya más registros no incluidos.`);
    } else {
      console.log(`✅ Se obtuvieron todos los registros disponibles`);
    }
    
    // Debug: contar por tipo de movimiento
    const ingresoCount = data?.filter(r => r.tipo_movimiento === 'ingreso').length || 0;
    const egresoCount = data?.filter(r => r.tipo_movimiento === 'egreso').length || 0;
    console.log(`📈 Registros de ingreso:`, ingresoCount);
    console.log(`📉 Registros de egreso:`, egresoCount);
    
    // Debug: verificar cuentas contables únicas
    const uniqueCuentas = [...new Set(data?.map(r => r.cuenta_contable_id) || [])];
    console.log(`🏦 Cuentas contables únicas en registros:`, uniqueCuentas.length, uniqueCuentas.slice(0, 5));
    
    // Debug: verificar si hay registros SIN cuenta_contable_id
    const sinCuenta = data?.filter(r => !r.cuenta_contable_id).length || 0;
    console.log(`⚠️ Registros sin cuenta_contable_id:`, sinCuenta);

    // Debug: verificar las cuentas contables únicas en los registros
    const uniqueAccountIds = [...new Set(data?.map(r => r.cuenta_contable_id).filter(Boolean))]
    
    if (uniqueAccountIds.length === 0) {
      console.log(`⚠️ No hay cuentas contables válidas en los registros`);
      return []
    }

    console.log(`🔍 Cuentas contables únicas en registros: ${uniqueAccountIds.length}`);
    console.log(`� IDs de cuentas:`, uniqueAccountIds.slice(0, 10), uniqueAccountIds.length > 10 ? '...' : '');

    // Para debug, vamos a procesar TODOS los registros sin filtrar por owner primero
    console.log(`🔍 ANÁLISIS GENERAL DE TODOS LOS REGISTROS:`);
    
    const todosLosIngresos = data?.filter(r => r.tipo_movimiento === tipo_movimiento) || [];
    const totalGeneralIngresos = todosLosIngresos.reduce((sum, r) => sum + r.monto, 0);
    console.log(`💰 TOTAL GENERAL ${tipo_movimiento}: $${totalGeneralIngresos.toLocaleString()} (${todosLosIngresos.length} registros)`);

    const results: GraphicProps[] = []

    for (const [ownerName, accountsIds] of accountsMap) {
      if (!accountsIds || accountsIds.length === 0) continue

      // filtrar registros solo de este dueño
      const registrosOwner = (data ?? []).filter((r) =>
        accountsIds.includes(r.cuenta_contable_id)
      )

      console.log(`👤 ${ownerName}: ${registrosOwner.length} registros encontrados`);
      
      // verificar registros de ingreso para este owner
      const ingresosOwner = registrosOwner.filter(r => r.tipo_movimiento === tipo_movimiento);
      console.log(`💰 ${ownerName}: ${ingresosOwner.length} registros de ${tipo_movimiento}`);
      
      // calcular total de ingresos para este owner
      const totalIngresos = ingresosOwner.reduce((sum, r) => sum + r.monto, 0);
      console.log(`💵 ${ownerName}: Total ${tipo_movimiento} = $${totalIngresos.toLocaleString()}`);

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

    // Debug: calcular totales finales
    const totalGeneral = results.reduce((sum, owner) => {
      const totalOwner = owner.monthlyIngresos.reduce((ownerSum, month) => ownerSum + month, 0);
      return sum + totalOwner;
    }, 0);

    console.log(`📊 RESUMEN FINAL ${tipo_movimiento.toUpperCase()}:`);
    console.log(`🏪 Owners procesados: ${results.length}`);
    console.log(`💰 Total general: $${totalGeneral.toLocaleString()}`);
    
    // Debug por owner
    results.forEach(owner => {
      const totalOwner = owner.monthlyIngresos.reduce((sum, month) => sum + month, 0);
      console.log(`  👤 ${owner.owner}: $${totalOwner.toLocaleString()}`);
    });

    return results
  } catch (error) {
    console.error("Error in getMonthlyIngresosToOwners:", error)
    return []
  }
}
