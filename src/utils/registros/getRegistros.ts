import supabase from "@/lib/supabaseClient"
import { getSubcategoryNameOfDestinatario } from "./subcategorias/getSubcategoryOfDestinatario"
import { getTodayRange, getYesterdayRange } from "../date/getDates"
import { getLastMonth } from "../date/getLastMonth"
import { getCategoryNameOfDestinatario } from "./getCategoryOfDestinatario"


export const getRegistrosOfToday = async () => {

    const {start, end} = getTodayRange()

    const {data, error} = await supabase.from('registros')
    .select('tipo_movimiento, monto, fecha, destinatario_id, metodo_pago_id, origen, cuenta_contable_id, created_at')
    .order('created_at', { ascending: false }) 
    .gte('fecha', start)
    .lt('fecha', end)


    if (error || !data) {
        console.error('Error fetching registros:', error)
        return []
    }
    return data

}

export const getRegistrosOfYesterday = async () => {

    const {start, end} = getYesterdayRange()

    const {data, error} = await supabase.from('registros')
    .select('tipo_movimiento, monto, fecha, destinatario_id, metodo_pago_id, origen, cuenta_contable_id, created_at')
    .order('created_at', { ascending: false }) 
    .gte('fecha', start)
    .lt('fecha', end)


    if (error || !data) {
        console.error('Error fetching registros:', error)
        return []
    }
    return data

}

export const getLastLimitRegistros = async (limit?: number, movementType?: string) => {

    let query = supabase.from('registros')
    .select('id, tipo_movimiento, monto, fecha, destinatario_id,status, metodo_pago_id, origen, cuenta_contable_id, created_at')
    .order('created_at', { ascending: false })
    

    if(limit && limit > 0 ){
        query = query.limit(6);
    }

    if(movementType && movementType.length > 0){
        query = query.eq('tipo_movimiento', movementType);
    }

    const {data, error} = await query;

    if (error || !data) {
        console.error('Error fetching registros:', error)
        return []
    }

    return data
}


export interface LastRegistrosProps{
    id:string;
    tipo_movimiento: string;
    monto: number;  
    fecha: string;
    status?:string;
    origen?:string;
    categoria:string;
    destinatario_id: string;
    metodo_pago_id: string;
    cuenta_contable_id: string;
    created_at: string;
    subcategoria: string;
    destinatario: string;
    cuentaContable: string;
    metodoPago: string;
}

export const getMontosOfMonthsByOffsetAndMovementTypeAndOrigin = async (
  offset: number,
  movementType?: string,
  origin?: string
) => {
  const { startISO, endExclusiveISO } = getLastMonth({ offset });

  let query = supabase
    .from('registros')
    .select('tipo_movimiento, monto, fecha, destinatario_id, metodo_pago_id, origen, cuenta_contable_id, created_at')
    .order('created_at', { ascending: false })
    .gte('fecha', startISO)
    .lt('fecha', endExclusiveISO);

  if (movementType && movementType.length > 0) {
    query = query.eq('tipo_movimiento', movementType);
  }

  if (origin && origin.length > 0) {
    query = query.eq('origen', origin);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching registros:', error);
    return [];
  }

  return data ?? [];
};

export const getRegistrosWithDestinatariosAndMetodoPagoAndCuentaContable = async (limit? : number, movementType?: string) : Promise<LastRegistrosProps[]> => {

    const last6Registros = await getLastLimitRegistros(limit, movementType)

    if(!last6Registros){
        console.warn('No se encontraron registros / last6Registros');
        return []
    }

    const destinatarios = await Promise.all(last6Registros.map(async (r) => {
        const {data : destinatarioData, error} = await supabase
        .from('destinatarios')
        .select('id, name, subcategory_id, category_id')
        .eq('id', r.destinatario_id)
        .single()
        ;

        if(!destinatarioData || error){
            return null
        }

        const subcategory = await getSubcategoryNameOfDestinatario(destinatarioData.subcategory_id)
        const category = await getCategoryNameOfDestinatario(destinatarioData.category_id)
        const destinatarioName = destinatarioData.name
        return {
            destinatarioName,
            subcategory: subcategory?.name || '',
            category: category?.name || ''
        }
    }))

    if(!destinatarios){
        console.warn('No se encontraron destinatarios');
        return []
    }

    const metodosPago = await Promise.all(last6Registros.map(async (r) => {
        const {data : metodoPago, error} = await supabase
        .from('metodos_pago')
        .select('id, name')
        .eq('id', r.metodo_pago_id);

        if(!metodoPago || error){
            console.error('ocurrio un error obteniendo los metodos de pago', error);
            return null
        }

        const metodoPagoName = metodoPago[0]?.name || '';

        return metodoPagoName;
    }))

    if(!metodosPago){
        console.warn('No se encontraron metodos de pago');
        return []
    }

    const cuentasContables = await Promise.all(last6Registros.map(async (r) => {
        const {data : cuentaContable, error} = await supabase.from('metodo_pago_destinatario_duenos')
        .select('id, description')
        .eq('id', r.cuenta_contable_id);

        if(!cuentaContable || error){
            console.error('ocurrio un error obteniendo las cuentas contables', error);
            return null
        }
        const cuentaContableDescription = cuentaContable[0]?.description || '';

        return cuentaContableDescription;
    }))



    const result = last6Registros.map((r, index) => {
        return {
            ...r,
            destinatario: destinatarios[index]?.destinatarioName,
            subcategoria: destinatarios[index]?.subcategory,
            categoria: destinatarios[index]?.category,
            metodoPago: metodosPago[index],
            cuentaContable: cuentasContables[index]
        }
    })

    if(!result){
        console.warn('No se encontraron registros');
        return []
    }
    
    return result

}