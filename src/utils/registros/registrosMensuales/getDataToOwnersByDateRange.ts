import { getAllOwners } from "../getOwners"
import { getAccountsAssociatedToOwners } from "../getAccountsAssociatedToOwners"
import { getAllRegistros } from "../paginationHelper"
import type { GraphicProps } from "@/components/Dashboard/Inicio-module/inicio-module"
import type { DateRangeType, CustomDateRange } from "@/utils/date/getDateRangeByType"
import { getDateRangeByType, groupRegistrosByPeriod } from "@/utils/date/getDateRangeByType"

interface RegistroSimple {
  monto: number;
  tipo_movimiento: string;
  cuenta_contable_id: string;
  fecha: string;
}

/**
 * Determina la escala automática para rangos personalizados
 */
/**
 * Encuentra la mejor subdivisión para un rango de días con margen ±1
 */
const findBestSubdivision = (totalDays: number) => {
  const candidates = [7, 6, 5, 4, 3]; // Preferir divisiones más grandes
  
  console.log(`🎯 Buscando mejor subdivisión para ${totalDays} días:`);
  
  for (const divisor of candidates) {
    const quotient = Math.floor(totalDays / divisor);
    const remainder = totalDays % divisor;
    
    console.log(`  - Divisor ${divisor}: ${quotient} períodos + ${remainder} restante`);
    
    // Aceptar si el resto está dentro del margen ±1
    if (remainder <= 1) {
      console.log(`  ✅ SELECCIONADO: ${divisor} días por período`);
      return {
        divisor,
        periods: quotient + (remainder > 0 ? 1 : 0), // +1 si hay resto
        remainder
      };
    }
  }
  
  // Fallback: usar divisor que genere ~5-6 períodos
  const targetPeriods = 5;
  const fallbackDivisor = Math.ceil(totalDays / targetPeriods);
  return {
    divisor: fallbackDivisor,
    periods: Math.ceil(totalDays / fallbackDivisor),
    remainder: totalDays % fallbackDivisor
  };
};

/**
 * Agrupa registros por períodos inteligentes usando la nueva estructura de scaleInfo
 */
const groupRegistrosByIntelligentPeriods = (
  registros: { fecha: string; monto: number }[],
  scaleInfo: any
): number[] => {
  const results = new Array(scaleInfo.totalPoints).fill(0);
  
  registros.forEach(registro => {
    const fechaRegistro = new Date(registro.fecha);
    let periodIndex = -1;
    
    if (scaleInfo.scale === 'daily') {
      // Para escala diaria, calcular índice basado en días desde actualStart
      const daysDiff = Math.floor((fechaRegistro.getTime() - scaleInfo.actualStart.getTime()) / (24 * 60 * 60 * 1000));
      periodIndex = daysDiff;
    } else if (scaleInfo.scale === 'period') {
      // Para escala de períodos, calcular índice basado en períodos desde actualStart
      const daysDiff = Math.floor((fechaRegistro.getTime() - scaleInfo.actualStart.getTime()) / (24 * 60 * 60 * 1000));
      periodIndex = Math.floor(daysDiff / scaleInfo.periodDays);
    }
    
    // Solo agregar si el índice está dentro del rango válido
    if (periodIndex >= 0 && periodIndex < scaleInfo.totalPoints) {
      results[periodIndex] += registro.monto;
    }
  });
  
  return results;
};

/**
 * Determina la escala inteligente para rangos personalizados con padding contextual
 */
const determineScaleForCustomRange = (startDate: Date, endDate: Date) => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 1000)) + 1; // +1 para incluir ambos días
  
  console.log(`🔍 Analizando rango: ${startDate.toDateString()} - ${endDate.toDateString()}`);
  console.log(`📊 Total de días: ${totalDays}`);
  
  if (totalDays <= 10) {
    // Para rangos pequeños, mostrar días individuales con padding
    const targetPoints = totalDays % 2 === 0 ? 6 : 5; // Par -> 6, Impar -> 5
    const paddingNeeded = Math.max(0, targetPoints - totalDays);
    const leftPadding = Math.floor(paddingNeeded / 2);
    const rightPadding = paddingNeeded - leftPadding;
    
    console.log(`⚡ Escala DIARIA: ${totalDays} días → ${targetPoints} puntos (padding: ${leftPadding}+${rightPadding})`);
    
    return {
      scale: 'daily' as const,
      totalPoints: targetPoints,
      actualStart: new Date(startDate.getTime() - leftPadding * 24 * 60 * 60 * 1000),
      actualEnd: new Date(endDate.getTime() + rightPadding * 24 * 60 * 60 * 1000),
      originalStart: startDate,
      originalEnd: endDate,
      leftPadding,
      rightPadding,
      periodDays: 1
    };
  } else {
    // Para rangos grandes, buscar la mejor subdivisión
    const bestDivision = findBestSubdivision(totalDays);
    const periodsCount = bestDivision.periods;
    const targetPoints = periodsCount % 2 === 0 ? 6 : 5;
    const paddingNeeded = Math.max(0, targetPoints - periodsCount);
    const leftPadding = Math.floor(paddingNeeded / 2);
    const rightPadding = paddingNeeded - leftPadding;
    
    const periodDuration = bestDivision.divisor * 24 * 60 * 60 * 1000; // en milisegundos
    
    console.log(`🔥 Escala PERÍODOS: ${periodsCount} períodos de ${bestDivision.divisor} días → ${targetPoints} puntos (padding: ${leftPadding}+${rightPadding})`);
    
    return {
      scale: 'period' as const,
      totalPoints: targetPoints,
      actualStart: new Date(startDate.getTime() - leftPadding * periodDuration),
      actualEnd: new Date(endDate.getTime() + rightPadding * periodDuration),
      originalStart: startDate,
      originalEnd: endDate,
      leftPadding,
      rightPadding,
      periodsCount,
      periodDays: bestDivision.divisor
    };
  }
};

/**
 * Obtiene datos de ingresos/egresos por owner con rangos de fecha dinámicos
 */
export const getDataToOwnersByDateRange = async (
  tipo_movimiento: string, 
  dateRangeType: DateRangeType,
  customRange?: CustomDateRange | null
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

    // Calcular el rango de fechas dinámico o usar rango personalizado
    let dateRange;
    let customLabels: string[] = [];
    let scaleInfo: any = null;
    
    if (dateRangeType === 'personalizado' && customRange?.startDate && customRange?.endDate) {
      // Determinar escala automática para rango personalizado con padding inteligente
      scaleInfo = determineScaleForCustomRange(customRange.startDate, customRange.endDate);
      
      // Crear etiquetas usando el rango expandido (con padding)
      if (scaleInfo.scale === 'daily') {
        // Generar etiquetas diarias con padding
        customLabels = [];
        const current = new Date(scaleInfo.actualStart);
        for (let i = 0; i < scaleInfo.totalPoints; i++) {
          customLabels.push(current.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }));
          current.setDate(current.getDate() + 1);
        }
      } else if (scaleInfo.scale === 'period') {
        // Generar etiquetas por períodos dinámicos con padding
        customLabels = [];
        const current = new Date(scaleInfo.actualStart);
        
        for (let i = 0; i < scaleInfo.totalPoints; i++) {
          const periodEnd = new Date(current);
          periodEnd.setDate(periodEnd.getDate() + scaleInfo.periodDays - 1);
          
          if (scaleInfo.periodDays === 1) {
            // Días individuales
            customLabels.push(current.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }));
          } else if (scaleInfo.periodDays <= 7) {
            // Períodos cortos (mostrar rango de fechas)
            customLabels.push(`${current.getDate()}/${current.getMonth() + 1} - ${periodEnd.getDate()}/${periodEnd.getMonth() + 1}`);
          } else if (scaleInfo.periodDays <= 31) {
            // Períodos largos (mostrar como semanas/meses)
            const weekNumber = Math.ceil(current.getDate() / 7);
            customLabels.push(`${current.toLocaleDateString('es-PE', { month: 'short' })} S${weekNumber}`);
          } else {
            // Períodos muy largos (mostrar como meses)
            customLabels.push(current.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }));
          }
          
          current.setDate(current.getDate() + scaleInfo.periodDays);
        }
      }
      
      // Crear un rango personalizado compatible
      dateRange = {
        startISO: scaleInfo.actualStart.toISOString(),
        endISO: scaleInfo.actualEnd.toISOString(),
        periodCount: customLabels.length,
        labels: customLabels
      };
    } else {
      dateRange = getDateRangeByType(dateRangeType);
    }

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

      // Usar la función de agrupación dinámica mejorada
      let monthlyIngresos: number[];
      
      if (dateRangeType === 'personalizado' && scaleInfo) {
        // Agrupación inteligente con padding para rangos personalizados
        monthlyIngresos = groupRegistrosByIntelligentPeriods(
          registrosOwner.map(r => ({ fecha: r.fecha, monto: r.monto })),
          scaleInfo
        );
      } else {
        // Agrupación tradicional para rangos predefinidos
        monthlyIngresos = groupRegistrosByPeriod(
          registrosOwner.map(r => ({ fecha: r.fecha, monto: r.monto })),
          dateRangeType,
          dateRange
        );
      }

      results.push({ owner: ownerName, monthlyIngresos })
    }

    // Si es un rango personalizado, también queremos retornar información sobre las etiquetas
    // Para mantener compatibilidad, agregamos las etiquetas como una propiedad especial
    if (dateRangeType === 'personalizado' && scaleInfo && customLabels.length > 0) {
      // Agregar metadatos como propiedades del array
      (results as any).customLabels = customLabels;
      (results as any).scaleInfo = scaleInfo;
    }

    return results
  } catch (error) {
    console.error("Error in getDataToOwnersByDateRange:", error)
    return []
  }
}

/**
 * Función auxiliar para obtener datos agregados y etiquetas para gráficos unificados
 */
export const getAggregatedDataWithLabels = async (
  tipo_movimiento: string, 
  dateRangeType: DateRangeType,
  customRange?: CustomDateRange | null
): Promise<{ data: number[], labels: string[] }> => {
  try {
    const ownerData = await getDataToOwnersByDateRange(tipo_movimiento, dateRangeType, customRange);
    
    // Si hay metadatos de rangos personalizados, usarlos
    if ((ownerData as any).customLabels) {
      const customLabels = (ownerData as any).customLabels;
      const maxLength = Math.max(...ownerData.map(owner => owner.monthlyIngresos.length));
      
      // Agregar datos de todos los owners
      const aggregatedData: number[] = [];
      for (let i = 0; i < maxLength; i++) {
        const sum = ownerData.reduce((total, owner) => {
          return total + (owner.monthlyIngresos[i] || 0);
        }, 0);
        aggregatedData.push(sum);
      }
      
      return {
        data: aggregatedData,
        labels: customLabels
      };
    } else {
      // Para rangos normales, usar el sistema tradicional
      const dateRange = getDateRangeByType(dateRangeType);
      const maxLength = dateRange.labels.length;
      
      const aggregatedData: number[] = [];
      for (let i = 0; i < maxLength; i++) {
        const sum = ownerData.reduce((total, owner) => {
          return total + (owner.monthlyIngresos[i] || 0);
        }, 0);
        aggregatedData.push(sum);
      }
      
      return {
        data: aggregatedData,
        labels: dateRange.labels
      };
    }
  } catch (error) {
    console.error("Error in getAggregatedDataWithLabels:", error)
    return { data: [], labels: [] };
  }
}