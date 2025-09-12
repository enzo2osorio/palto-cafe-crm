import supabase from "@/lib/supabaseClient";

export const getSubcategoryIdByName = async (subcategoryName: string) => {
    try {
        const { data, error } = await supabase.from('subcategorias')
        .select('id')
        .eq('name', subcategoryName)

        if (error) {
            console.error('Error fetching subcategory id by name:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error fetching subcategory id by name:", error);
        return null;
    }
}