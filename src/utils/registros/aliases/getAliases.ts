import supabase from "@/lib/supabaseClient";


export const getAliasesOfDestinatarios = async (destinatarioId: string ) => {
    try {
        const { data, error } = await supabase.from('destinatario_aliases')
        .select('*')
        .eq('destinatario_id', destinatarioId)

        if (error) {
            console.error('Error fetching aliases of destinatario:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error fetching aliases of destinatario:", error);
        return null;
    }
}