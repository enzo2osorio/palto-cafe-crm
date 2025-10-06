import {getTodayRange, getYesterdayRange} from '../../date/getDates'

export const getFlujoDiarioyDeAyer = async (tipo_movimiento: string) => {

  const {start, end} = getTodayRange()
  const {start: yesterdayStart, end: yesterdayEnd} = getYesterdayRange()

  // Usar paginación optimizada para obtener todos los registros
  const { getAllRegistros } = await import('../../registros/paginationHelper');
  
  const movimientosDiarios = await getAllRegistros(
    {
      tipoMovimiento: tipo_movimiento,
      fechaDesde: start,
      fechaHasta: end
    },
    {
      campos: 'monto, tipo_movimiento, fecha',
      batchSize: 1000,
      logProgress: false
    }
  ).catch(error => {
    console.error('Error fetching movimientos diarios:', error);
    return [];
  });

  // El error ya se maneja en el catch del getAllRegistros

  let sumaMontosDiarios = 0;

  if(movimientosDiarios) {
    sumaMontosDiarios = movimientosDiarios.reduce((acum : number, movimiento : any) => {
      return acum + movimiento.monto
    }, 0)
  }

  const movimientosDiariosYesterday = await getAllRegistros(
    {
      tipoMovimiento: tipo_movimiento,
      fechaDesde: yesterdayStart,
      fechaHasta: yesterdayEnd
    },
    {
      campos: 'monto, tipo_movimiento, fecha',
      batchSize: 1000,
      logProgress: false
    }
  ).catch(error => {
    console.error('Error fetching movimientos ayer:', error);
    return [];
  });

  let sumaMontosYesterday = 0;

  if(movimientosDiariosYesterday) {
    sumaMontosYesterday = movimientosDiariosYesterday.reduce((acum : number, movimiento : any) => {
      return acum + movimiento.monto
    }, 0)
  }


  return {
    sumaMontosDiarios,
    sumaMontosYesterday
  }
}
