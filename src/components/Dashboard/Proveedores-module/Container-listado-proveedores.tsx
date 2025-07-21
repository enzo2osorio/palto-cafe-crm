import { useState } from "react";
import { filteringProveedores } from "@/lib/proveedores/filteredProveedores";
import type { ProveedoresProps } from "@/types/proveedores";
import { FiltroyBusqueda } from "@/components/Reusable/Filtrado-y-busqueda";
import { ListadoProveedores } from "./Listado-proveedores";

interface ListadoProveedoresProps {
  proveedores: ProveedoresProps[];
  rubros: string[];
}

export const ContainerListadoProveedores = ({
  rubros,
  proveedores,
}: ListadoProveedoresProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRubro, setSelectedRubro] = useState("Todos");

  const filteredProveedores = filteringProveedores({
    proveedores,
    searchTerm,
    rubroFilter: selectedRubro === "Todos" ? "" : selectedRubro,
  });


  return (
    <>
     <FiltroyBusqueda          
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedOption={selectedRubro}
          setSelectedOption={setSelectedRubro}
          optionForSelect={rubros.map(rubro => ({ value: rubro, label: rubro }))}
        />

        {/* Lista de proveedores */}
        <ListadoProveedores
        filteredProveedores={filteredProveedores}
        />
    </>
  );
};
