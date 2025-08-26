import supabase from "@/lib/supabaseClient";


export const getAllSubcategoriasOfProovedores = async () => {
    try {
        const { data, error } = await supabase.from('subcategorias')
        .select('name')
        .eq('categoria_id', '3f7dd883-6be2-47a7-92a0-8bb6cde24a3c')

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