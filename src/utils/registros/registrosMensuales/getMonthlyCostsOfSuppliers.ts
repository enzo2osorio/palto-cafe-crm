import { getAllDestinatariosIdsByCategoryId } from "../destinatarios-GLOBAL/getDestinatarios";
import { getRegistrosDelMesParaProveedores } from "../proveedores/getRegistrosDelMesParaProveedores";


export const getMontlyCostOfSuppliers = async () => {
    const categoriaProveedorId = import.meta.env.VITE_CATEGORIA_PROVEEDORES_UUID as string | undefined;

    if (!categoriaProveedorId) {
        console.error("Falta la env 'VITE_CATEGORIA_PROVEEDORES_UUID'. Defínela en .env/.env.local y reinicia el dev server.");
        return;
    }
    const proveedoresIds = await getAllDestinatariosIdsByCategoryId(import.meta.env.VITE_CATEGORIA_PROVEEDORES_UUID as string);

    if(!proveedoresIds){
        console.error('no existen proveedores destinatarios');
        return;
    }

    const registrosMensuales = await getRegistrosDelMesParaProveedores(proveedoresIds);

    return registrosMensuales;

}