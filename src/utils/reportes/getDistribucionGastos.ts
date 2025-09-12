import { getMontosOfMonthsByOffsetAndMovementTypeAndOrigin } from '@/utils/registros/getRegistros';
import supabase from '@/lib/supabaseClient';
import { getLastMonth } from '../date/getLastMonth';
import { getCategoriaIdByName } from '../registros/proveedores/getCategoriaProveedores';

export interface DistribucionGastos {
  categoria: string;
  totalGasto: number;
  porcentaje: number;
  subcategorias?: SubcategoriaGasto[];
}

export interface SubcategoriaGasto {
  subcategoria: string;
  totalGasto: number;
  porcentajeDelTotal: number;
  porcentajeDeLaCategoria: number;
}

export const getDistribucionGastos = async (mesesAtras: number = 3) => {
  try {
    // Obtener todas las categorías
    const {data: categorias, error: categoriasError} = await supabase
      .from('categorias')
      .select('id, name');
    
    if(!categorias || categoriasError){
      console.error('Error obteniendo categorías:', categoriasError);
      return [];
    }
    
    const distribucion: DistribucionGastos[] = [];
    let totalGastos = 0;
    
    // Primero calcular el total general
    for (let i = -(mesesAtras - 1); i <= 0; i++) {
      const registros = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(i, 'egreso');
      if (registros) {
        totalGastos += registros.reduce((sum, r) => sum + r.monto, 0);
      }
    }
    
    // Ahora calcular por categoría
    for (const categoria of categorias) {
      let totalCategoria = 0;
      
      for (let i = -(mesesAtras - 1); i <= 0; i++) {
        const { startISO, endExclusiveISO } = getLastMonth({ offset: i });
        
        // Query para obtener gastos por categoría a través del destinatario
        const { data: registros, error } = await supabase
          .from('registros')
          .select(`
            monto,
            destinatarios!inner(
              id,
              name,
              category_id,
              subcategorias(name)
            )
          `)
          .eq('tipo_movimiento', 'egreso')
          .eq('destinatarios.category_id', categoria.id)
          .gte('fecha', startISO)
          .lt('fecha', endExclusiveISO);
        
        if (registros && !error) {
          totalCategoria += registros.reduce((sum, r) => sum + r.monto, 0);
        }
      }
      
      distribucion.push({
        categoria: categoria.name,
        totalGasto: totalCategoria,
        porcentaje: totalGastos > 0 ? (totalCategoria / totalGastos) * 100 : 0
      });
    }
    
    return distribucion.sort((a, b) => b.totalGasto - a.totalGasto);
    
  } catch (error) {
    console.error('Error en getDistribucionGastos:', error);
    return [];
  }
};

export const getSubcategoriasDeCategoria = async (categoria: string, mesesAtras: number = 1) => {
  try {
    console.log('🔍 Iniciando búsqueda de subcategorías para:', categoria);
    
    const categoriaData = await getCategoriaIdByName(categoria);
    if (!categoriaData || categoriaData.length === 0) {
      return [];
    }

    const categoriaId = categoriaData[0]?.id;
    if (!categoriaId) {
      return [];
    }
    
    const subcategorias: { [key: string]: number } = {};
    let totalCategoria = 0;
    let totalGeneral = 0;
    
    // Calcular total general
    for (let i = -(mesesAtras - 1); i <= 0; i++) {
      const registros = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(i, 'egreso');
      if (registros) {
        totalGeneral += registros.reduce((sum, r) => sum + r.monto, 0);
      }
    }
    
    // ⭐ QUERY OPTIMIZADA: Una sola query con JOIN para todo el período
    const { startISO } = getLastMonth({ offset: -(mesesAtras - 1) });
    const { endExclusiveISO } = getLastMonth({ offset: 0 });
    
    const { data: registros, error } = await supabase
      .from('registros')
      .select(`
        monto,
        destinatarios!inner(
          id,
          name,
          category_id,
          subcategory_id,
          subcategorias(name)
        )
      `)
      .eq('tipo_movimiento', 'egreso')
      .eq('destinatarios.category_id', categoriaId)
      .gte('fecha', startISO)
      .lt('fecha', endExclusiveISO);
    
    if (error) {
      console.error('❌ Error en query optimizada:', error);
      return [];
    }

    console.log(`📊 Registros encontrados:`, registros?.length || 0);
    
    if (registros && registros.length > 0) {
      registros.forEach((registro: any) => {
        // Ahora manejamos la estructura correcta del JOIN
        const destinatario = Array.isArray(registro.destinatarios) 
          ? registro.destinatarios[0] 
          : registro.destinatarios;
          
        if (!destinatario) return;
        
        const subcategoria = Array.isArray(destinatario.subcategorias)
          ? destinatario.subcategorias[0]
          : destinatario.subcategorias;
          
        const subcategoriaNombre = subcategoria?.name || 'Sin subcategoría';
        
        if (!subcategorias[subcategoriaNombre]) {
          subcategorias[subcategoriaNombre] = 0;
        }
        subcategorias[subcategoriaNombre] += registro.monto;
        totalCategoria += registro.monto;
      });
    }
    
    const resultado: SubcategoriaGasto[] = Object.entries(subcategorias).map(([subcategoria, gasto]) => ({
      subcategoria,
      totalGasto: gasto,
      porcentajeDelTotal: totalGeneral > 0 ? (gasto / totalGeneral) * 100 : 0,
      porcentajeDeLaCategoria: totalCategoria > 0 ? (gasto / totalCategoria) * 100 : 0
    }));
    
    return resultado.sort((a, b) => b.totalGasto - a.totalGasto);
    
  } catch (error) {
    console.error('💥 Error en getSubcategoriasDeCategoria:', error);
    return [];
  }
};