import supabase from "@/lib/supabaseClient"
import type { RegistroFilter, PaginationForRegistros, RegistroWithDetails } from "@/lib/store/registrosStore"
import { getCategoryNameOfDestinatario } from "./getCategoryOfDestinatario"
import { getSubcategoryNameOfDestinatario } from "./subcategorias/getSubcategoryOfDestinatario"

/**
 * Obtiene registros con filtros avanzados y paginación usando queries separadas
 */
export const getRegistrosWithFilters = async (
  filters: RegistroFilter,
  pagination: PaginationForRegistros
): Promise<{ data: RegistroWithDetails[]; count: number }> => {
  try {
    const { page, limit } = pagination
    const offset = page * limit

    // PASO 1: Obtener IDs de destinatarios que coinciden con la búsqueda (si hay searchTerm)
    let destinatariosIds: string[] = []
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const { data: destinatariosMatched, error: searchError } = await supabase
        .from('destinatarios')
        .select('id')
        .ilike('name', `%${filters.searchTerm.trim()}%`)

      if (searchError) {
        console.error('Error buscando destinatarios:', searchError)
        return { data: [], count: 0 }
      }

      destinatariosIds = destinatariosMatched?.map(d => d.id) || []
      
      // Si la búsqueda no encontró destinatarios, no hay resultados
      if (destinatariosIds.length === 0) {
        return { data: [], count: 0 }
      }
    }

    // PASO 2: Construir query base para registros
    let query = supabase
      .from('registros')
      .select('id, monto, tipo_movimiento, origen, fecha, created_at, destinatario_id, metodo_pago_id, cuenta_contable_id', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Aplicar filtro de búsqueda por destinatarios
    if (destinatariosIds.length > 0) {
      query = query.in('destinatario_id', destinatariosIds)
    }

    // Aplicar filtro de tipo de movimiento
    if (filters.tipoMovimiento && filters.tipoMovimiento !== 'todos') {
      query = query.eq('tipo_movimiento', filters.tipoMovimiento)
    }

    // Aplicar filtro de origen
    if (filters.origen && filters.origen !== 'todos') {
      query = query.eq('origen', filters.origen)
    }

    // Aplicar filtros de fecha
    if (filters.fechaDesde) {
      query = query.gte('fecha', filters.fechaDesde)
    }

    if (filters.fechaHasta) {
      query = query.lte('fecha', filters.fechaHasta)
    }

    // Aplicar paginación
    query = query.range(offset, offset + limit - 1)

    // Ejecutar query principal
    const { data: registrosData, error, count } = await query

    if (error) {
      console.error('Error obteniendo registros:', error)
      return { data: [], count: 0 }
    }

    if (!registrosData || registrosData.length === 0) {
      return { data: [], count: count || 0 }
    }

    // PASO 3: Obtener detalles de destinatarios
    const destinatarios = await Promise.all(
      registrosData.map(async (registro) => {
        const { data: destinatarioData, error: destError } = await supabase
          .from('destinatarios')
          .select('id, name, subcategory_id, category_id')
          .eq('id', registro.destinatario_id)
          .single()

        if (!destinatarioData || destError) {
          return null
        }

        // Obtener subcategoría y categoría
        const [subcategory, category] = await Promise.all([
          getSubcategoryNameOfDestinatario(destinatarioData.subcategory_id),
          getCategoryNameOfDestinatario(destinatarioData.category_id)
        ])

        return {
          id: destinatarioData.id,
          name: destinatarioData.name,
          subcategory: subcategory?.name || '',
          category: category?.name || ''
        }
      })
    )

    // PASO 5: Obtener cuentas contables
    const cuentasContables = await Promise.all(
      registrosData.map(async (registro) => {
        // Validar que cuenta_contable_id no sea null/undefined
        if (!registro.cuenta_contable_id) {
          return null
        }

        const { data: cuentaContableData, error: ccError } = await supabase
          .from('metodo_pago_destinatario_duenos')
          .select('id, description')
          .eq('id', registro.cuenta_contable_id)
          .single()

        if (!cuentaContableData || ccError) {
          return null
        }

        return {
          id: cuentaContableData.id,
          name: cuentaContableData.description
        }
      })
    )

    // PASO 6: Combinar todos los datos
    const registrosConDetalles: RegistroWithDetails[] = registrosData.map((registro, index) => ({
      id: registro.id,
      monto: registro.monto,
      tipo_movimiento: registro.tipo_movimiento,
      origen: registro.origen,
      fecha: registro.fecha,
      created_at: registro.created_at,
      destinatario_id: registro.destinatario_id,
      destinatarios: destinatarios[index] ? [{
        name: destinatarios[index]!.name,
        categorias: [{
          name: destinatarios[index]!.category
        }]
      }] : [],
      cuenta_contable: cuentasContables[index] ? [{
        name: cuentasContables[index]!.name
      }] : []
    }))

    return { 
      data: registrosConDetalles, 
      count: count || 0 
    }
   
  } catch (error) {
    console.error('Error en getRegistrosWithFilters:', error)
    return { data: [], count: 0 }
  }
}

/**
 * Obtiene las opciones disponibles para los filtros
 */
export const getFilterOptions = async () => {
  try {
    // Obtener tipos de movimiento únicos
    const { data: tiposMovimiento } = await supabase
      .from('registros')
      .select('tipo_movimiento')
      .not('tipo_movimiento', 'is', null)

    // Obtener orígenes únicos
    const { data: origenes } = await supabase
      .from('registros')
      .select('origen')
      .not('origen', 'is', null)

    // Procesar y deduplicar
    const tiposUnicos = [...new Set(tiposMovimiento?.map(item => item.tipo_movimiento) || [])]
    const origenesUnicos = [...new Set(origenes?.map(item => item.origen) || [])]

    return {
      tiposMovimiento: tiposUnicos,
      origenes: origenesUnicos
    }
  } catch (error) {
    console.error('Error obteniendo opciones de filtros:', error)
    return {
      tiposMovimiento: [],
      origenes: []
    }
  }
}

/**
 * Obtiene estadísticas rápidas de registros
 */
export const getRegistrosStats = async () => {
  try {
    const [totalRegistros, registrosHoy, registrosBot, registrosFudo] = await Promise.all([
      // Total de registros
      supabase
        .from('registros')
        .select('id', { count: 'exact', head: true }),
      
      // Registros de hoy
      supabase
        .from('registros')
        .select('id', { count: 'exact', head: true })
        .gte('fecha', new Date().toISOString().split('T')[0]),
      
      // Registros del bot
      supabase
        .from('registros')
        .select('id', { count: 'exact', head: true })
        .eq('origen', 'bot'),
      
      // Registros de fudo
      supabase
        .from('registros')
        .select('id', { count: 'exact', head: true })
        .eq('origen', 'fudo')
    ])

    return {
      total: totalRegistros.count || 0,
      hoy: registrosHoy.count || 0,
      bot: registrosBot.count || 0,
      fudo: registrosFudo.count || 0
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return {
      total: 0,
      hoy: 0,
      bot: 0,
      fudo: 0
    }
  }
}

/**
 * Busca destinatarios para autocompletado
 */
export const searchDestinatarios = async (searchTerm: string, limit = 10) => {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return []
    }

    const { data, error } = await supabase
      .from('destinatarios')
      .select('id, name')
      .ilike('name', `%${searchTerm.trim()}%`)
      .limit(limit)

    if (error) {
      console.error('Error buscando destinatarios:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error en searchDestinatarios:', error)
    return []
  }
}