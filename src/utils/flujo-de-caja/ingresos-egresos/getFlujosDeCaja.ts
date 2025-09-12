import supabase from '@/lib/supabaseClient'
import {getTodayRange, getYesterdayRange} from '../../date/getDates'

export const getFlujoDiarioyDeAyer = async (tipo_movimiento: string) => {

  const {start, end} = getTodayRange()
  const {start: yesterdayStart, end: yesterdayEnd} = getYesterdayRange()

  const {data : movimientosDiarios, error: errorHoy} = await supabase
  .from('registros')
  .select('*')
  .eq('tipo_movimiento', tipo_movimiento)
  .gte("fecha", start)
  .lte("fecha", end);

  if(errorHoy) {
    console.error('Error fetching movimientos diarios:', errorHoy)
  }

  let sumaMontosDiarios = 0;

  if(movimientosDiarios) {
    sumaMontosDiarios = movimientosDiarios.reduce((acum : number, movimiento : any) => {
      return acum + movimiento.monto
    }, 0)
  }

  const {data : movimientosDiariosYesterday, error: errorAyer} = await supabase
  .from('registros')
  .select('*')
  .eq('tipo_movimiento', tipo_movimiento)
  .gte("fecha", yesterdayStart)
  .lte("fecha", yesterdayEnd)

  if(errorAyer) {
    console.error('Error fetching movimientos ayer:', errorAyer)
  }

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
