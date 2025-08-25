import { getAllProveedoresIds } from "../proveedores/getAllProveedores";
import { getRegistrosDelMesParaProveedores } from "../proveedores/getRegistrosDelMesParaProveedores";


export const getMontlyCostOfSuppliers = async () => {
    // En Vite, las env vars deben ir con prefijo VITE_ y se acceden via import.meta.env
    const categoriaProveedorId = import.meta.env.VITE_CATEGORIA_PROVEEDORES_UUID as string | undefined;

    if (!categoriaProveedorId) {
        console.error("Falta la env 'VITE_CATEGORIA_PROVEEDORES_UUID'. Defínela en .env/.env.local y reinicia el dev server.");
        return;
    }
    const proveedoresIds = await getAllProveedoresIds()

    if(!proveedoresIds){
        console.error('no existen proveedores destinatarios');
        return;
    }

    const registrosMensuales = await getRegistrosDelMesParaProveedores(proveedoresIds);

    return registrosMensuales;

}