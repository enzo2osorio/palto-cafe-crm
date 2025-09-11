import { getMontosOfMonthsByOffsetAndMovementTypeAndOrigin } from '@/utils/registros/getRegistros';
import { getLastMonth } from '@/utils/date/getLastMonth';

export interface MargenMensual {
  mes: string;
  año: number;
  ingresos: number;
  egresos: number;
  margenNeto: number;
  margenPorcentaje: number;
}

export const getMargenNetoMensual = async (mesesAtras: number = 6) => {
  const margenes: MargenMensual[] = [];

  for (let i = -(mesesAtras - 1); i <= 0; i++) {
    const { monthName, year } = getLastMonth({ offset: i });
    
    const ingresos = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(i, 'ingreso');
    const egresos = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(i, 'egreso');
    
    const totalIngresos = ingresos?.reduce((sum, r) => sum + r.monto, 0) || 0;
    const totalEgresos = egresos?.reduce((sum, r) => sum + r.monto, 0) || 0;
    
    const margenNeto = totalIngresos - totalEgresos;
    const margenPorcentaje = totalIngresos > 0 ? (margenNeto / totalIngresos) * 100 : 0;

    margenes.push({
      mes: monthName,
      año: year,
      ingresos: totalIngresos,
      egresos: totalEgresos,
      margenNeto,
      margenPorcentaje
    });
  }

  return margenes;
};

export const getProporcionIngresosEgresos = async (offset: number = 0) => {
  const ingresos = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(offset, 'ingreso');
  const egresos = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(offset, 'egreso');
  
  const totalIngresos = ingresos?.reduce((sum, r) => sum + r.monto, 0) || 0;
  const totalEgresos = egresos?.reduce((sum, r) => sum + r.monto, 0) || 0;
  const total = totalIngresos + totalEgresos;

  return {
    ingresos: totalIngresos,
    egresos: totalEgresos,
    proporcionIngresos: total > 0 ? (totalIngresos / total) * 100 : 0,
    proporcionEgresos: total > 0 ? (totalEgresos / total) * 100 : 0
  };
};