import supabase from '@/lib/supabaseClient'
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'

/**
 * Hook/Función reutilizable para obtener TODOS los registros de una consulta Supabase
 * Sin importar la cantidad (supera automáticamente el límite de 1000)
 * 
 * @param queryBuilder - El query builder de Supabase ya configurado con filtros
 * @param options - Opciones de configuración
 * @returns Array con todos los registros encontrados
 */
export const getAllRegistrosWithPagination = async <T = any>(
  queryBuilder: PostgrestFilterBuilder<any, any, T[], unknown>,
  options: {
    batchSize?: number; // Tamaño de cada lote (default: 1000)
    maxRecords?: number; // Límite máximo de registros (safety net, default: 50000)
    logProgress?: boolean; // Mostrar progreso en consola (default: false)
  } = {}
): Promise<T[]> => {
  const { 
    batchSize = 1000, 
    maxRecords = 50000, 
    logProgress = false 
  } = options;

  let allData: T[] = [];
  let rangeStart = 0;
  let hasMore = true;
  let iteration = 0;

  if (logProgress) {
    console.log('🔄 Iniciando carga paginada de registros...');
  }

  while (hasMore && allData.length < maxRecords) {
    iteration++;
    
    // Clonar el query builder y agregar paginación
    const paginatedQuery = queryBuilder.range(rangeStart, rangeStart + batchSize - 1);
    
    const { data, error } = await paginatedQuery;

    if (error) {
      console.error('❌ Error en paginación de registros:', error);
      throw error;
    }

    if (data && data.length > 0) {
      allData = [...allData, ...data];
      rangeStart += batchSize;
      hasMore = data.length === batchSize; // Si trajo menos del batchSize, ya no hay más
      
      if (logProgress) {
        console.log(`📦 Lote ${iteration}: ${data.length} registros cargados (Total: ${allData.length})`);
      }
    } else {
      hasMore = false;
    }

    // Safety net: evitar loops infinitos
    if (allData.length >= maxRecords) {
      console.warn(`⚠️ Alcanzado el límite máximo de ${maxRecords} registros por seguridad`);
      break;
    }
  }

  if (logProgress) {
    console.log(`✅ Carga completada: ${allData.length} registros totales en ${iteration} lotes`);
  }

  return allData;
};

/**
 * Función específica para consultas de la tabla "registros" con filtros comunes
 * Wrapper especializado que incluye los campos más usados
 */
export const getAllRegistros = async <T = any>(
  filters: {
    tipoMovimiento?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    origen?: string;
    destinatarioIds?: string[];
    cuentaContableIds?: string[];
  } = {},
  options: {
    campos?: string;
    batchSize?: number;
    logProgress?: boolean;
  } = {}
): Promise<T[]> => {
  const { 
    campos = 'id, tipo_movimiento, monto, fecha, destinatario_id, cuenta_contable_id, origen, created_at',
    batchSize = 1000,
    logProgress = false
  } = options;

  // Construir la consulta base
  let query = supabase
    .from('registros')
    .select(campos)
    .order('created_at', { ascending: false });

  // Aplicar filtros condicionales
  if (filters.tipoMovimiento) {
    query = query.eq('tipo_movimiento', filters.tipoMovimiento);
  }

  if (filters.fechaDesde) {
    query = query.gte('fecha', filters.fechaDesde);
  }

  if (filters.fechaHasta) {
    query = query.lt('fecha', filters.fechaHasta);
  }

  if (filters.origen) {
    query = query.eq('origen', filters.origen);
  }

  if (filters.destinatarioIds && filters.destinatarioIds.length > 0) {
    query = query.in('destinatario_id', filters.destinatarioIds);
  }

  if (filters.cuentaContableIds && filters.cuentaContableIds.length > 0) {
    query = query.in('cuenta_contable_id', filters.cuentaContableIds);
  }

  // Usar la función de paginación universal
  return getAllRegistrosWithPagination(query, { batchSize, logProgress }) as Promise<T[]>;
};

/**
 * Función para obtener el count total sin traer todos los datos
 * Útil para validaciones o métricas
 */
export const getRegistrosCount = async (
  filters: {
    tipoMovimiento?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    origen?: string;
  } = {}
): Promise<number> => {
  let query = supabase
    .from('registros')
    .select('id', { count: 'exact', head: true });

  if (filters.tipoMovimiento) {
    query = query.eq('tipo_movimiento', filters.tipoMovimiento);
  }

  if (filters.fechaDesde) {
    query = query.gte('fecha', filters.fechaDesde);
  }

  if (filters.fechaHasta) {
    query = query.lt('fecha', filters.fechaHasta);
  }

  if (filters.origen) {
    query = query.eq('origen', filters.origen);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error obteniendo count de registros:', error);
    return 0;
  }

  return count || 0;
};