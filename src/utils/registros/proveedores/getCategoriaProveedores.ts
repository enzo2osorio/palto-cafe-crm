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

export const getCategoriaIdByName = async (categoriaName : string) => {
    try {
        // Búsqueda insensible a mayúsculas/minúsculas y segura ante resultados vacíos
        const { data, error } = await supabase
            .from("categorias")
            .select("id")
            .ilike("name", categoriaName);

        if (error) {
            console.error("❌ Error al obtener la categoría:", error);
            return null;
        }

        if (!data || data.length === 0) {
            console.warn("⚠️ No se encontró la categoría en la tabla 'categorias'. Verifica nombre/espacios/case.");
            return null;
        }
        return data;
    } catch (error) {
        console.error("💥 Error obteniendo categoría:", error);
        return null;
    }
}