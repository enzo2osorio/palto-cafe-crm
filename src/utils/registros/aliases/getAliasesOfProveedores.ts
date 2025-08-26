import supabase from "@/lib/supabaseClient"


export const getAliasesOfProveedores = async (proveedorId: string) => {
    try {
        const { data, error } = await supabase.from('destinatario_aliases')
        .select('*')
        .eq('destinatario_id', proveedorId)

        if (error) {
            console.error('Error fetching aliases of proveedor:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error fetching aliases of proveedor:", error);
        return null;
    }
}