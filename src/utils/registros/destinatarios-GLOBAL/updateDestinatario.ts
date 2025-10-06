import supabase from "@/lib/supabaseClient"

interface UpdateDestinatarioData {
  name?: string
  subcategory_id?: string
  description?: string
}



/**
 * Actualiza un destinatario por su ID
 */
export const updateDestinatarioById = async (
  id: string, 
  updateData: UpdateDestinatarioData
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('destinatarios')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error actualizando destinatario:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error actualizando destinatario:', error)
    return false
  }
}

/**
 * Obtiene un destinatario con sus aliases por ID
 */
export const getDestinatarioWithAliasesById = async (id: string) => {
  try {
    const { data: destinatario, error } = await supabase
      .from('destinatarios')
      .select(`
        id,
        name,
        category_id,
        subcategory_id,
        description,
        subcategorias!inner(name),
        destinatario_aliases(id, alias)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error obteniendo destinatario:', error)
      return null
    }

    return destinatario
  } catch (error) {
    console.error('Error obteniendo destinatario:', error)
    return null
  }
}

/**
 * Actualiza los aliases de un destinatario
 * Elimina los aliases existentes y crea los nuevos
 */
export const updateDestinatarioAliases = async (
  destinatarioId: string,
  newAliases: string[]
): Promise<boolean> => {
  try {
    // Eliminar aliases existentes
    const { error: deleteError } = await supabase
      .from('destinatario_aliases')
      .delete()
      .eq('destinatario_id', destinatarioId)

    if (deleteError) {
      console.error('Error eliminando aliases:', deleteError)
      return false
    }

    // Crear nuevos aliases solo si hay alguno
    if (newAliases.length > 0) {
      const aliasesToInsert = newAliases
        .filter(alias => alias.trim().length > 0)
        .map(alias => ({
          alias: alias.trim(),
          destinatario_id: destinatarioId
        }))

      if (aliasesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('destinatario_aliases')
          .insert(aliasesToInsert)

        if (insertError) {
          console.error('Error creando aliases:', insertError)
          return false
        }
      }
    }

    return true
  } catch (error) {
    console.error('Error actualizando aliases:', error)
    return false
  }
}

/**
 * Actualiza un destinatario completo (datos + aliases)
 */
export const updateDestinatarioComplete = async (
  id: string,
  updateData: UpdateDestinatarioData,
  newAliases: string[] = []
): Promise<boolean> => {
  try {
    // Actualizar datos del destinatario
    const destinatarioUpdated = await updateDestinatarioById(id, updateData)
    if (!destinatarioUpdated) return false

    // Actualizar aliases
    const aliasesUpdated = await updateDestinatarioAliases(id, newAliases)
    if (!aliasesUpdated) return false

    return true
  } catch (error) {
    console.error('Error actualizando destinatario completo:', error)
    return false
  }
}