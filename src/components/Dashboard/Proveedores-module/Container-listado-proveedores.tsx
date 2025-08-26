import { useEffect, useState } from "react";
import { FiltroyBusqueda } from "@/components/Reusable/Filtrado-y-busqueda";
import { ListadoProveedores } from "./Listado-proveedores";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCountProveedores } from "@/utils/registros/proveedores/getAllProveedores";
import { useProveedorStore } from "@/lib/store/proovedorStore";
import { ListadoProveedoresSkeleton } from "../Skeletons/ListadoProveedoresSkeleton";

export const ContainerListadoProveedores = () => {
  const [proveedoresLength , setProveedoresLength] = useState(0);
  const [loadingLength, setLoadingLength] = useState(true);
  const { pagination, setPagination, loading, setLoading ,subcategorias, searchTerm, selectedRubro, setSelectedRubro ,setProveedores, setSearchTerm } = useProveedorStore();

  useEffect(() => {
    const fetchProovedoresLength = async () => {
      setLoadingLength(true);
      const count = await getCountProveedores(searchTerm, selectedRubro);
      setProveedoresLength(count || 0);
      setLoadingLength(false);
    }
    fetchProovedoresLength();
    // recalcular cuando cambie paginación o filtros
  }, [pagination.page, pagination.limit, searchTerm, selectedRubro]);

  return (
    <>
     <FiltroyBusqueda
     optionForSelect={subcategorias}
     loading={loading}
     setLoading={setLoading}
     setMainStructure={setProveedores}
     setSearchTermGlobal={setSearchTerm}
     setSelectedOptionGlobal={setSelectedRubro}
     />

        {/* Lista de proveedores */}
        {
          loading ? (
            <ListadoProveedoresSkeleton/>

          ) : (
            <ListadoProveedores/>
          )
        }

        {
          loadingLength ? (
            <div>
              <p className="font-ui text-base text-muted-foreground">
                Cargando proveedores...
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center w-full h-40">
          <div className="flex justify-between gap-10 items-center px-4 py-2">
            <button 
            disabled={pagination.page === 0}
            onClick={() => setPagination({page: pagination.page - 1, limit: pagination.limit})}
            className={`bg-primary/50 rounded-full w-max 
            disabled:bg-muted/50 disabled:cursor-not-allowed
            h-max p-2 cursor-pointer group/leftGroup`}>
              <ChevronLeft className="w-8 h-8 text-foreground group-hover/leftGroup:scale-110 mr-[2px] transition-all" />
            </button>
            <div>
              <p className="font-ui text-base text-muted-foreground">
                Página {pagination.page + 1} de {Math.ceil(proveedoresLength / pagination.limit)}
              </p>
            </div>
            <button 
            disabled={pagination.page === Math.ceil(proveedoresLength / pagination.limit) - 1}
            onClick={() => setPagination({page: pagination.page + 1, limit: pagination.limit})}
            className={`bg-primary/50 rounded-full w-max 
            disabled:bg-muted/50 disabled:cursor-not-allowed
            h-max p-2 text-foreground cursor-pointer group/rightGroup`}>
              <ChevronRight className="w-8 h-8 group-hover/rightGroup:scale-110 ml-[2px] transition-all" />
            </button>

          </div>
        </div>
          )
        }

    </>
  );
};
