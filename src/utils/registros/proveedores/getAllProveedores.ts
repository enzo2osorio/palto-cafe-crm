import supabase from "@/lib/supabaseClient"


export const getCountProveedores = async () => {
    
    //traeremos solo el id para que no sea tan pesado el array
    const {data, error} = await supabase.from('destinatarios')
    .select('id')
    .eq('category_id', '3f7dd883-6be2-47a7-92a0-8bb6cde24a3c') // Reemplaza con el ID real de la categoría "proveedores";
    if (error) {
        console.error('Error fetching all proveedores:', error);
        return null;
    }
    return data;
}

export const getAllProveedoresIds = async() => {
    try {
        const { data :proveedoresData, error} = await supabase.from('destinatarios')
    .select('id')
    .eq('category_id', '3f7dd883-6be2-47a7-92a0-8bb6cde24a3c')

    if(!proveedoresData || error){
        console.error('ocurrio un error obteniendo los destintarios proveedores', error);
        return null
    }

    return proveedoresData
    } catch (error) {
        console.error("error dentor de fetch destinatarios proveedores",error);
        return null
    }

}