import { getMargenNetoMensual } from "./getRentabilidadMetrics";


export interface ProyeccionLineal {
  mes: string;
  proyectado: boolean;
  ingresos: number;
  egresos: number;
  margenNeto: number;
}

export const getProyeccionLinealIngresos = async (mesesHistoricos: number = 6, mesesProyeccion: number = 3) => {
  const historicos = await getMargenNetoMensual(mesesHistoricos);
  
  // Calcular promedio de los últimos 3 meses para la tendencia
  const ultimos3 = historicos.slice(-3);
  const promedioIngresos = ultimos3.reduce((sum, m) => sum + m.ingresos, 0) / ultimos3.length;
  const promedioEgresos = ultimos3.reduce((sum, m) => sum + m.egresos, 0) / ultimos3.length;
  
  // Calcular tendencia de crecimiento (regresión lineal simple)
  const tendenciaIngresos = calcularTendencia(ultimos3.map(m => m.ingresos));
  const tendenciaEgresos = calcularTendencia(ultimos3.map(m => m.egresos));

  const proyecciones: ProyeccionLineal[] = [
    // Datos históricos
    ...historicos.map(h => ({
      mes: h.mes,
      proyectado: false,
      ingresos: h.ingresos,
      egresos: h.egresos,
      margenNeto: h.margenNeto
    }))
  ];

  // Generar proyecciones
  for (let i = 1; i <= mesesProyeccion; i++) {
    const fechaProyeccion = new Date();
    fechaProyeccion.setMonth(fechaProyeccion.getMonth() + i);
    const mesNombre = fechaProyeccion.toLocaleDateString('es-ES', { month: 'long' });
    
    const ingresosProyectados = promedioIngresos + (tendenciaIngresos * i);
    const egresosProyectados = promedioEgresos + (tendenciaEgresos * i);
    
    proyecciones.push({
      mes: mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1),
      proyectado: true,
      ingresos: Math.max(0, ingresosProyectados),
      egresos: Math.max(0, egresosProyectados),
      margenNeto: Math.max(0, ingresosProyectados) - Math.max(0, egresosProyectados)
    });
  }

  return proyecciones;
};

const calcularTendencia = (valores: number[]): number => {
  if (valores.length < 2) return 0;
  
  const n = valores.length;
  const sumX = (n * (n + 1)) / 2; // suma de 1,2,3...n
  const sumY = valores.reduce((a, b) => a + b, 0);
  const sumXY = valores.reduce((sum, val, idx) => sum + val * (idx + 1), 0);
  const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6; // suma de 1²+2²+3²...n²
  
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
};

export const getCashRunway = async () => {
  const ultimos3Meses = await getMargenNetoMensual(3);
  const promedioEgresosMensual = ultimos3Meses.reduce((sum, m) => sum + m.egresos, 0) / ultimos3Meses.length;
  
  // Aquí asumimos que tienes una función para obtener el saldo actual en caja
  // Por ahora usaremos un placeholder
  const saldoActualEnCaja = 500000; // Esto debería venir de otra función
  
  const mesesDeOperacion = promedioEgresosMensual > 0 ? saldoActualEnCaja / promedioEgresosMensual : 0;
  
  return {
    saldoActual: saldoActualEnCaja,
    egresosMensualesPromedio: promedioEgresosMensual,
    mesesDeOperacion: Math.floor(mesesDeOperacion),
    fechaLimite: new Date(Date.now() + (mesesDeOperacion * 30 * 24 * 60 * 60 * 1000))
  };
};