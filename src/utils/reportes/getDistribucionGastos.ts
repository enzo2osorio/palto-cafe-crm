import { getMontosOfMonthsByOffsetAndMovementTypeAndOrigin } from '@/utils/registros/getRegistros';
import supabase from '@/lib/supabaseClient';
import { getLastMonth } from '../date/getLastMonth';

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
  const categorias = ['proveedores', 'empleados', 'servicios', 'colaboradores', 'otros'];
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
      
      // Query para obtener gastos por categoría
      const { data: registros } = await supabase
        .from('registros')
        .select('monto, subcategoria')
        .eq('tipo_movimiento', 'egreso')
        .eq('categoria', categoria)
        .gte('fecha', startISO)
        .lt('fecha', endExclusiveISO);
      
      if (registros) {
        totalCategoria += registros.reduce((sum, r) => sum + r.monto, 0);
      }
    }
    
    distribucion.push({
      categoria,
      totalGasto: totalCategoria,
      porcentaje: totalGastos > 0 ? (totalCategoria / totalGastos) * 100 : 0
    });
  }
  
  return distribucion.sort((a, b) => b.totalGasto - a.totalGasto);
};

export const getSubcategoriasDeCategoria = async (categoria: string, mesesAtras: number = 3) => {
  const subcategorias: { [key: string]: number } = {};
  let totalCategoria = 0;
  let totalGeneral = 0;
  
  // Obtener total general primero
  for (let i = -(mesesAtras - 1); i <= 0; i++) {
    const registros = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(i, 'egreso');
    if (registros) {
      totalGeneral += registros.reduce((sum, r) => sum + r.monto, 0);
    }
  }
  
  for (let i = -(mesesAtras - 1); i <= 0; i++) {
    const { startISO, endExclusiveISO } = getLastMonth({ offset: i });
    
    const { data: registros } = await supabase
      .from('registros')
      .select('monto, subcategoria')
      .eq('tipo_movimiento', 'egreso')
      .eq('categoria', categoria)
      .gte('fecha', startISO)
      .lt('fecha', endExclusiveISO);
    
    if (registros) {
      registros.forEach(registro => {
        if (!subcategorias[registro.subcategoria]) {
          subcategorias[registro.subcategoria] = 0;
        }
        subcategorias[registro.subcategoria] += registro.monto;
        totalCategoria += registro.monto;
      });
    }
  }
  
  const resultado: SubcategoriaGasto[] = Object.entries(subcategorias).map(([subcategoria, gasto]) => ({
    subcategoria,
    totalGasto: gasto,
    porcentajeDelTotal: totalGeneral > 0 ? (gasto / totalGeneral) * 100 : 0,
    porcentajeDeLaCategoria: totalCategoria > 0 ? (gasto / totalCategoria) * 100 : 0
  }));
  
  return resultado.sort((a, b) => b.totalGasto - a.totalGasto);
};