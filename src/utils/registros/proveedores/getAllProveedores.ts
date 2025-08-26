import supabase from "@/lib/supabaseClient"
import { getAliasesOfProveedores } from "../aliases/getAliasesOfProveedores";
import { getSubcategoryNameOfDestinatario } from "../subcategorias/getSubcategoryOfDestinatario";
import { getSubcategoryIdByName } from "../subcategorias/getSubcategoryIdByName";


export const getCountProveedores = async (searchTerm?: string, subcategory?: string) => {
  try {
    const q = (searchTerm || "").trim();
    const s = (subcategory || "").trim();

    let query = supabase
      .from('destinatarios')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', '3f7dd883-6be2-47a7-92a0-8bb6cde24a3c');

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
      console.error('Error counting proveedores:', error);
      return 0;
    }

    return typeof count === 'number' ? count : 0;
  } catch (err) {
    console.error('Error interno getCountProveedores:', err);
    return 0;
  }
}

export interface PaginationProveedores{
    page: number;
    limit: number;
}
export const getAllProveedoresOnlyIdNameAndSubcategoryId = async (pagination: PaginationProveedores, searchTerm?: string, subcategory?: string) => {
    //traeremos solo el id para que no sea tan pesado el array
    
    const page = Math.max(0, pagination.page || 0); // espera page 0-based
    const limit = Math.max(1, pagination.limit || 10);
    const start = page * limit;
    const end = start + limit - 1;
    const q = (searchTerm || "").trim();
    const s = (subcategory || "").trim();

    let query = supabase
      .from('destinatarios')
      .select('id, name, subcategory_id')
      .eq('category_id', '3f7dd883-6be2-47a7-92a0-8bb6cde24a3c')
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
        console.error('Error fetching all proveedores:', error);
        return null;
    }
    return data;
}


export const getAllProveedoresIds = async() => {
    try {
        const { data :proveedoresData, error} = await supabase.from('destinatarios')
    .select('id')
    .eq('category_id', '3f7dd883-6be2-47a7-92a0-8bb6cde24a3c')

    if(!proveedoresData || error){
        console.error('ocurrio un error obteniendo los destintarios proveedores', error);
        return null
    }

    return proveedoresData
    } catch (error) {
        console.error("error dentor de fetch destinatarios proveedores",error);
        return null
    }

}

export const getProveedoresWithAliasesAndSubcategorias = async (pagination: PaginationProveedores, searchTerm?: string, subcategory?: string) => {
    try {
         const proveedores = await getAllProveedoresOnlyIdNameAndSubcategoryId(pagination, searchTerm, subcategory);

        if (!proveedores) {
            console.error('No se encontraron proveedores');
            return null;
        }

        const proovedorWithSubcategory = await Promise.all(proveedores.map(async (proveedor) => {
            const subcategory = proveedor.subcategory_id ? await getSubcategoryNameOfDestinatario(proveedor.subcategory_id) : null;
            return {
                ...proveedor,
                subcategory: subcategory?.name || ''
            };
        }));


        const proovedorWithAliasesAndSubcategory = await Promise.all(proovedorWithSubcategory.map(async (proveedor) => {
            const aliases = await getAliasesOfProveedores(proveedor.id);
            return {
                ...proveedor,
                aliases: aliases?.map((alias) => alias.alias) || []
            };
        }));

        if (!proovedorWithAliasesAndSubcategory) {
            console.error('No se encontró ningún alias de proveedor');
            return null;
        }

        return proovedorWithAliasesAndSubcategory;

        
    } catch (error) {
        console.error("error dentor de fetch destinatarios proveedores",error);
        return null
    }
}