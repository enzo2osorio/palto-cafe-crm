import supabase from "@/lib/supabaseClient"


export const getAccountsAssociatedToOwners = async (destinatario_id : string) => {
    try {
        const {data: normalizedData, error} = await supabase.from('metodo_pago_destinatario_duenos')
        .select('id')
        .eq('destinatario_id', destinatario_id)

        if (error) {
            console.error("Error fetching accounts:", error)
            return []
        }
        return normalizedData

    } catch (error) {
        console.error("Error fetching accounts:", error)
        return []
    }
}
