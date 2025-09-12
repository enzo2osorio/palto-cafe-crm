import supabase from "@/lib/supabaseClient";
import { getSubcategoryIdByName } from "../subcategorias/getSubcategoryIdByName";
import type { PaginationForDestinatarios } from "@/types/pagination";
import { getAliasesOfDestinatarios } from "../aliases/getAliases";
import { getSubcategoryNameOfDestinatario } from "../subcategorias/getSubcategoryOfDestinatario";


// obtener todos los destinatarios de una categoria
export const getDestinatariosByCategoryId = async (categoryId: string) => {
    try {
        const { data, error } = await supabase
            .from('destinatarios')
            .select('id, name, subcategory_id')
            .eq('category_id', categoryId)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching all destinatarios:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error fetching all destinatarios:", error);
        return null;
    }
}


export const getCountDestinatariosByCategoryId = async (categoryId: string, searchTerm?: string, subcategory?: string) => {
    try {

         const q = (searchTerm || "").trim();
        const s = (subcategory || "").trim();

        let query = supabase
          .from('destinatarios')
          .select('id', { count: 'exact', head: true })
          .eq('category_id', categoryId);

        if (s.length > 0) {
            const response = await getSubcategoryIdByName(s);
            const subcategoryId = response?.[0]?.id;
            if (subcategoryId) {
                query = query.eq('subcategory_id', subcategoryId);
            }
        }

        if (q.length > 0) {
            query = query.ilike('name', `%${q}%`);
        }

        const { count, error } = await query;
        if (error) {
            console.error('Error counting destinatarios:', error);
            return 0;
        }

        return typeof count === 'number' ? count : 0;

    } catch (err) {
        console.error('Error interno getCountDestinatariosByCategoryId:', err);
        return 0;
    }
}

export const getAllDestinatariosIdsByCategoryId = async (categoryId: string) => {
    try {
        const { data, error } = await supabase.from('destinatarios')
        .select('id')
        .eq('category_id', categoryId)

        if(!data || error){
            console.error('ocurrio un error obteniendo los destintarios proveedores', error);
            return null
        }

        return data
    } catch (error) {
        console.error("error dentor de fetch destinatarios proveedores",error);
        return null
    }

}

export const getAllDestinatariosOnlyIdNameAndSubcategoryIdByCategoryId = async (categoryId: string, pagination: PaginationForDestinatarios, searchTerm?: string, subcategory?: string) => {
    const page = Math.max(0, pagination.page || 0); 
    const limit = Math.max(1, pagination.limit || 10);
    const start = page * limit;
    const end = start + limit - 1;
    const q = (searchTerm || "").trim();
    const s = (subcategory || "").trim();

    let query = supabase
      .from('destinatarios')
      .select('id, name, subcategory_id')
      .eq('category_id', categoryId)
      .order('name', { ascending: true });

    if (s.length > 0) {
        const response = await getSubcategoryIdByName(s);
        const subcategoryId = response?.[0]?.id;
        if (subcategoryId) {
          query = query.eq('subcategory_id', subcategoryId);
        }
    }

    if (q.length > 0) {
      query = query.ilike('name', `%${q}%`);
    }

    const { data, error } = await query.range(start, end);

    if (error) {
        console.error('Error fetching all destinatarios:', error);
        return null;
    }
    return data;
}


export const getDestinatariosWithAliasesAndSubcategoriasByCategoryId = async (categoryId: string, pagination: PaginationForDestinatarios, searchTerm?: string, subcategory?: string) => {
    try {
         const destinatarios = await getAllDestinatariosOnlyIdNameAndSubcategoryIdByCategoryId(categoryId, pagination, searchTerm, subcategory);

        if (!destinatarios) {
            console.error('No se encontraron destinatarios');
            return null;
        }

        const proovedorWithSubcategory = await Promise.all(destinatarios.map(async (destinatario) => {
            const subcategory = destinatario.subcategory_id ? await getSubcategoryNameOfDestinatario(destinatario.subcategory_id) : null;
            return {
                ...destinatario,
                subcategory: subcategory?.name || ''
            };
        }));


        const proovedorWithAliasesAndSubcategory = await Promise.all(proovedorWithSubcategory.map(async (destinatario) => {
            const aliases = await getAliasesOfDestinatarios(destinatario.id);
            return {
                ...destinatario,
                aliases: aliases?.map((alias) => alias.alias) || []
            };
        }));

        if (!proovedorWithAliasesAndSubcategory) {
            console.error('No se encontró ningún alias de destinatario');
            return null;
        }

        return proovedorWithAliasesAndSubcategory;

        
    } catch (error) {
        console.error("error dentor de fetch destinatarios",error);
        return null
    }
}