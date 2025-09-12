import supabase from "@/lib/supabaseClient";


export const getCategoryNameOfDestinatario = async (categoryId: string) => {
    try {
        const { data, error } = await supabase.from('categorias')
        .select('name')
        .eq('id', categoryId)
        .single();

        if (error) {
            console.error('Error fetching category name of destinatario:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error fetching category name of destinatario:", error);
        return null;
    }
}