import supabase from "@/lib/supabaseClient"
import { getLastMonth } from "../registrosMensuales/getLastMonth"

interface Proveedores{
    id: string
}

export const getRegistrosDelMesParaProveedores = async (proveedoresIds: Proveedores[]) => {

    try {
        const { startISO, endExclusiveISO} = getLastMonth()

    // Aseguramos pasar sólo los IDs primitivos a .in()
    const ids = proveedoresIds.map(p => p.id);

    const {data, error} = await supabase.from('registros')
    .select('monto')
    .in('destinatario_id', ids)
    .eq('tipo_movimiento', 'egreso')
    .gte('fecha', startISO)
    .lt('fecha', endExclusiveISO)
    
    if(error){
        console.error('error obteniendo los registros del mes para proveedores', error);
        return null
    }

    return data

    } catch (error) {
        console.log("error", error)
        return null;
    }

}