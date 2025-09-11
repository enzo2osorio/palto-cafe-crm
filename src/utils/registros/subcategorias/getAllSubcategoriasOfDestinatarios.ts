import supabase from "@/lib/supabaseClient";


export const getAllSubcategoriasOfDestinatarios = async (categoryId: string): Promise<any | null> => {
    try {
        const { data, error } = await supabase.from('subcategorias')
        .select('name')
        .eq('categoria_id', categoryId)

        if (error) {
            console.error('Error fetching all subcategorias of proveedores:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error fetching all subcategorias of proveedores:", error);
        return null;
    }
}