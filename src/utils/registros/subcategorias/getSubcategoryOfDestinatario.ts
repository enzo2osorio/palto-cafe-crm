import supabase from "@/lib/supabaseClient";


export const getSubcategoryNameOfDestinatario = async (subcategoryId: string) => {
    try {
        const { data, error } = await supabase.from('subcategorias')
        .select('name')
        .eq('id', subcategoryId)
        .single();

        if (error) {
            console.error('Error fetching subcategory name of destinatario:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error fetching subcategory name of destinatario:", error);
        return null;
    }
}