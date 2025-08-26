import type { ProveedoresProps } from "@/types/proveedores";
import supabase from "../supabaseClient";
import { useProveedorStore } from "../store/proovedorStore";
import { getAliasesOfProveedores } from "@/utils/registros/aliases/getAliasesOfProveedores";

interface FilteringProveedoresProps{
    proveedores : ProveedoresProps[],
    searchTerm: string,
    rubroFilter: string
}

export const filteringProveedores = ({ proveedores, searchTerm, rubroFilter }: FilteringProveedoresProps) => {
  return proveedores.filter((proveedor) => {
    const matchesSearch = searchTerm
      ? proveedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesRubro = rubroFilter
      ? proveedor.subcategory.toLowerCase() === rubroFilter.toLowerCase()
      : true;

    return matchesSearch && matchesRubro;
  });
}


export const getIlikeSearch = async (searchTerm: string) => {

  const {setProveedores, setLoading} = useProveedorStore();

  setLoading(true);
  const {data , error} = await supabase.from('destinatarios')
  .select('id, name, subcategory_id')
  .ilike('name', `%${searchTerm}%`)

  if (error) {
    console.error('Error fetching all proveedores:', error);
    return null;
  }

  const dataProveedores : ProveedoresProps[] = data.map(proveedor => {
    return {
      id: proveedor.id,
      aliases: [],
      name: proveedor.name,
      subcategory: "",
      subcategory_id: proveedor.subcategory_id
    }
  })

  const dataProveedoresWithAliases = await Promise.all(dataProveedores.map(async (proveedor) => {
    const aliases = await getAliasesOfProveedores(proveedor.id);
    return {
      ...proveedor,
      aliases: aliases?.map((alias) => alias.alias) || []
    };
  }));

  if (!dataProveedoresWithAliases) {
    console.error('No se encontró ningún alias de proveedor');
    return null;
  }

  setProveedores(dataProveedores);
  setLoading(false);
}
