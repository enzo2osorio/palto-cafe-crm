import supabase from "@/lib/supabaseClient"

export const getAllOwners = async () => {
    try {
        const { data } = await supabase
            .from('destinatarios')
            // Selecting only what we need keeps payloads small and avoids ambiguous columns
            .select('id, name, category_id, subcategory_id')
            .eq('category_id', '0ba7b565-e067-4411-9061-caa7d4f6ac83')
            .eq('subcategory_id', '0d4fad94-6106-49e9-832e-3c94548996a7')
            .throwOnError();

        if (!data) {
            // When RLS blocks access you get no error, just 0 rows
            console.warn("No owners rows returned (check RLS policies and session)");
            return [];
        }

        return data;
    } catch (error) {
        console.error("Error fetching owners:", error);
        return [];
    }
}