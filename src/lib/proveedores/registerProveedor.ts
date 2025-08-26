import type { ProveedoresPropsWithoutId } from "@/types/proveedores";
import supabase from "../supabaseClient";
import { getSubcategoryIdByName } from "@/utils/registros/subcategorias/getSubcategoryIdByName";

type InsertedProveedor = {
  id: string;
  name: string;
  subcategory_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export const registerProveedor = async (proveedor: ProveedoresPropsWithoutId, subcategoryId: string): Promise<InsertedProveedor | null> => {
    try {
        // pedir el registro insertado con .select().single() para obtener el id
        const { data, error } = await supabase
          .from('destinatarios')
          .insert({
              name: proveedor.name,
              subcategory_id: subcategoryId
          })
          .select()
          .single();

        if (error) {
            console.error('Error registering proveedor:', error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error("Error registering proveedor:", error);
        return null;
    }
}

export const registerAliases = async (proveedorId: string, aliases: string[]) => {
    try {
        if (!Array.isArray(aliases) || aliases.length === 0) return [];

        const payload = aliases.map(alias => ({
            destinatario_id: proveedorId,
            alias
        }));

        const { data, error } = await supabase
          .from('destinatario_aliases')
          .insert(payload)
          .select();

        if (error) {
            console.error('Error registering aliases of proveedor:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error registering aliases of proveedor:", error);
        return null;
    }
}

export const registeringProveedor = async (proveedorr: ProveedoresPropsWithoutId) => {
    try {
        const ss = proveedorr.subcategory
        console.log({ss})
        const subcategory = await getSubcategoryIdByName(proveedorr.subcategory);
        console.log({subcategory})
        if (!subcategory || !subcategory[0]?.id) {
            console.error('No se encontró subcategoryId para proveedor:', proveedorr);
            return {error: 'No se encontró subcategoryId para proveedor'};
        }
        const subcategoryId = subcategory[0].id;

        const proveedor = await registerProveedor(proveedorr, subcategoryId);
        if (!proveedor) {
            console.error('No se registró proveedor:', proveedor);
            return {error: 'No se registró proveedor'};
        }

        // proveedor.id ahora existe y está tipado
        const aliasesForProveedor = await registerAliases(proveedor.id, proveedorr.aliases || []);
       
        if (aliasesForProveedor === null) {
            console.error('No se registraron aliases del proveedor:', aliasesForProveedor);
            return {error : 'No se registraron aliases del proveedor'};
        }
        
        return {success: "Proveedor registrado correctamente"};
    } catch (error) {
        console.error("Error registering proveedor:", error);
        return null;
    }
}