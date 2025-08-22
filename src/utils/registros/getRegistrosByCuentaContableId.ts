import supabase from "@/lib/supabaseClient"

export const getRegistrosByCuentaContableId = async (
  cuenta_contable_ids: string[],
  range: { start: string; end: string }
) => {
  try {
    if (!cuenta_contable_ids || cuenta_contable_ids.length === 0) return []

    const { start, end } = range
    const { data, error } = await supabase
      .from("registros")
      .select("monto, tipo_movimiento, cuenta_contable_id, fecha")
      .in("cuenta_contable_id", cuenta_contable_ids)
      .gte("created_at", start)
      .lt("created_at", end)
      .throwOnError()

    if (error) {
      console.error("Error fetching registros:", error)
    }

    return data ?? []
  } catch (error) {
    console.error("Error fetching registros:", error)
    return []
  }
}

