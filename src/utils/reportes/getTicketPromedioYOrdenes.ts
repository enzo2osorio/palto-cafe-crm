import { getMontosOfMonthsByOffsetAndMovementTypeAndOrigin } from '@/utils/registros/getRegistros';

export interface TicketPromedio {
  origen: string;
  totalIngresos: number;
  cantidadTransacciones: number;
  ticketPromedio: number;
}

export interface VentasPorDia {
  dia: string;
  totalVentas: number;
  porcentaje: number;
  cantidadOrdenes: number;
}

export const getTicketPromedioYOrdenes = async (mesesAtras: number = 3) => {
  const resultados: TicketPromedio[] = [];
  
  // Obtener datos para cada origen (fudo, bot)
  const origenes = ['fudo', 'bot'];
  
  for (const origen of origenes) {
    let totalIngresos = 0;
    let totalTransacciones = 0;
    
    // Iterar por los últimos N meses
    for (let i = -(mesesAtras - 1); i <= 0; i++) {
      const registros = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(i, 'ingreso', origen);
      
      if (registros && registros.length > 0) {
        totalIngresos += registros.reduce((sum, r) => sum + r.monto, 0);
        totalTransacciones += registros.length;
      }
    }
    
    resultados.push({
      origen,
      totalIngresos,
      cantidadTransacciones: totalTransacciones,
      ticketPromedio: totalTransacciones > 0 ? totalIngresos / totalTransacciones : 0
    });
  }
  
  return resultados;
};

export const getVentasPorDiaSemana = async (mesesAtras: number = 3) => {
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const ventasPorDia: { [key: string]: { total: number, ordenes: number } } = {};
  
  // Inicializar
  diasSemana.forEach(dia => {
    ventasPorDia[dia] = { total: 0, ordenes: 0 };
  });
  
  let totalVentasGeneral = 0;
  
  // Iterar por los últimos N meses
  for (let i = -(mesesAtras - 1); i <= 0; i++) {
    const registros = await getMontosOfMonthsByOffsetAndMovementTypeAndOrigin(i, 'ingreso');
    
    if (registros && registros.length > 0) {
      registros.forEach(registro => {
        const fecha = new Date(registro.fecha);
        const diaSemana = diasSemana[fecha.getDay()];
        
        ventasPorDia[diaSemana].total += registro.monto;
        ventasPorDia[diaSemana].ordenes += 1;
        totalVentasGeneral += registro.monto;
      });
    }
  }
  
  // Convertir a array con porcentajes
  const resultado: VentasPorDia[] = diasSemana.map(dia => ({
    dia,
    totalVentas: ventasPorDia[dia].total,
    porcentaje: totalVentasGeneral > 0 ? (ventasPorDia[dia].total / totalVentasGeneral) * 100 : 0,
    cantidadOrdenes: ventasPorDia[dia].ordenes
  }));
  
  return resultado;
};

export const getMetricasClaveVentas = async (mesesAtras: number = 3) => {
  const ticketData = await getTicketPromedioYOrdenes(mesesAtras);
  const totalTickets = ticketData.reduce((sum, t) => sum + t.cantidadTransacciones, 0);
  const totalIngresos = ticketData.reduce((sum, t) => sum + t.totalIngresos, 0);
  const diasTotales = mesesAtras * 30; // Aproximado
  
  return {
    ticketPromedio: totalTickets > 0 ? totalIngresos / totalTickets : 0,
    ordenesPorDia: totalTickets / diasTotales,
    totalOrdenes: totalTickets,
    totalIngresos,
    ticketsPorOrigen: ticketData
  };
};