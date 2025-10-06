import supabase from "@/lib/supabaseClient"

/**
 * Elimina un destinatario por su ID
 * Los aliases se eliminan automáticamente por cascada
 */
export const deleteDestinatarioById = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('destinatarios')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error eliminando destinatario:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error eliminando destinatario:', error)
    return false
  }
}

/**
 * Elimina múltiples destinatarios por sus IDs
 */
export const deleteMultipleDestinatarios = async (ids: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('destinatarios')
      .delete()
      .in('id', ids)

    if (error) {
      console.error('Error eliminando destinatarios:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error eliminando destinatarios:', error)
    return false
  }
}