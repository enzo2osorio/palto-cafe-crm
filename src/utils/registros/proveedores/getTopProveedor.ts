import supabase from "@/lib/supabaseClient";
import { getAllProveedoresIds } from "./getAllProveedores"
import { getLastMonth } from "../registrosMensuales/getLastMonth";

export const getTopProveedor = async () => {

    const proveedoresIds = await getAllProveedoresIds();

    if(!proveedoresIds || proveedoresIds.length === 0) {
        console.error('No se encontraron proveedores');
        return null;
    }

     const { startISO, endExclusiveISO} = getLastMonth()
    
        // Aseguramos pasar sólo los IDs primitivos a .in()
const ids = proveedoresIds.map(p => p.id);

    const {data : topRegistroData, error} = await supabase.from('registros')
    .select('destinatario_id, monto')
    .gte('fecha', startISO)
    .lt('fecha', endExclusiveISO)
    .in('destinatario_id', ids)
    .order('monto', { ascending: false })
    .limit(1)

    if(error) {
        console.error('Error fetching top proveedor:', error);
        return null;
    }

    const proveedorName = await supabase.from('destinatarios')
    .select('name')
    .eq('id', topRegistroData[0].destinatario_id)
    .single();

    if (proveedorName.error) {
        console.error('Error fetching proveedor name:', proveedorName.error);
        return null;
    }

    const montoYNombre = {
        nombre: proveedorName.data.name,
        total_gastado: topRegistroData[0].monto
    }

    return montoYNombre;
}
