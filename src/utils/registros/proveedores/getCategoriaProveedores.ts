import supabase from "@/lib/supabaseClient"


export const getCategoriaIdOfProveedores = async () => {
    try {
        // Búsqueda insensible a mayúsculas/minúsculas y segura ante resultados vacíos
        const { data, error } = await supabase
            .from("categorias")
            .select("id, name")
            .ilike("name", "proveedores")
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("hubo un error al obtener la categoría 'proveedores'", error);
            return null;
        }

        if (!data) {
            console.warn("No se encontró la categoría 'proveedores' en la tabla 'categorias'. Verifica nombre/espacios/case.");
            return null;
        }

        return data.id as string;
    } catch (error) {
        console.error("error obteniendo proveedores:", error);
        return null;
    }
}