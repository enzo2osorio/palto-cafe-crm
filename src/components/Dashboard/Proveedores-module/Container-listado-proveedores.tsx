import { useEffect, useState } from "react";
import { FiltroyBusqueda } from "@/components/Reusable/Filtrado-y-busqueda";
import { ListadoProveedores } from "./Listado-proveedores";
import { useDestinatarioStore } from "@/lib/store/destinatariosStore";
import { ListadoProveedoresSkeleton } from "../Skeletons/ListadoProveedoresSkeleton";
import { getCountDestinatariosByCategoryId } from "@/utils/registros/destinatarios-GLOBAL/getDestinatarios";
import { Pagination } from "@/components/Reusable/Pagination";

export const ContainerListadoProveedores = () => {
  const [proveedoresLength , setProveedoresLength] = useState(0);
  const [loadingLength, setLoadingLength] = useState(true);
  const { pagination, setPagination, loading, setLoading ,subcategorias, searchTerm, selectedRubro, setSelectedRubro ,setDestinatarios, setSearchTerm } = useDestinatarioStore();

  useEffect(() => {
    const fetchProovedoresLength = async () => {
      setLoadingLength(true);
      const count = await getCountDestinatariosByCategoryId('3f7dd883-6be2-47a7-92a0-8bb6cde24a3c', searchTerm, selectedRubro);
      setProveedoresLength(count || 0);
      setLoadingLength(false);
    }
    fetchProovedoresLength();

    return () => {
      setProveedoresLength(0);
      setLoadingLength(true);
    }
    // recalcular cuando cambie paginación o filtros
  }, [pagination.page, pagination.limit, searchTerm, selectedRubro]);

  return (
    <>
     <FiltroyBusqueda
     optionForSelect={subcategorias}
     loading={loading}
     setLoading={setLoading}
     setMainStructure={setDestinatarios}
     setSearchTermGlobal={setSearchTerm}
     setSelectedOptionGlobal={setSelectedRubro}
     categoria="3f7dd883-6be2-47a7-92a0-8bb6cde24a3c"
     />

        {/* Lista de proveedores */}
        {
          loading ? (
            <ListadoProveedoresSkeleton/>

          ) : (
            <ListadoProveedores/>
          )
        }

        
            <Pagination
            loadingLength={loadingLength}
              pagination={pagination}
              setPagination={setPagination}
              destinatariosLength={proveedoresLength}
            />
        
        

    </>
  );
};
