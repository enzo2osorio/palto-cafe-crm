import type { ProveedoresProps } from "@/types/proveedores";

interface FilteringProveedoresProps{
    proveedores : ProveedoresProps[],
    searchTerm: string,
    rubroFilter: string
}

export const filteringProveedores = ({ proveedores, searchTerm, rubroFilter }: FilteringProveedoresProps) => {
  return proveedores.filter((proveedor) => {
    const matchesSearch = searchTerm
      ? proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.rubro.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesRubro = rubroFilter
      ? proveedor.rubro === rubroFilter
      : true;

    return matchesSearch && matchesRubro;
  });
}

