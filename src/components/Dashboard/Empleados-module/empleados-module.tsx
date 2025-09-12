import { useEffect, useState } from 'react';
import { KPISForEmpleados } from './KPISForEmpleados';
import { BotonesControlEmpleados } from './BotonesControl';
import { FiltroyBusqueda } from '@/components/Reusable/Filtrado-y-busqueda';
import { TablaEmpleados } from './Tabla-empleados';
import { getCountDestinatariosByCategoryId, getDestinatariosWithAliasesAndSubcategoriasByCategoryId } from '@/utils/registros/destinatarios-GLOBAL/getDestinatarios';
import { getActualMonthlyPayAmountOfEachEmployee, getActualMonthlyPayAmountOfEachEmployeeGivenEmployeeId } from '@/utils/registros/empleados/getTotalAmountOfMonthlyPayment';
import { useDestinatarioStore } from '@/lib/store/destinatariosStore';
import type { CustomCardProps } from '@/components/Reusable/CustomCard';
import { User } from 'lucide-react';
import { getAllSubcategoriasOfDestinatarios } from '@/utils/registros/subcategorias/getAllSubcategoriasOfDestinatarios';
import { Pagination } from '@/components/Reusable/Pagination';
import { KPISCardsSkeleton } from '../Skeletons/KpisCardsSkeleton';
import { TablaEmpleadosSkeleton } from '../Skeletons/TablaEmpleadosSkeleton';
import { formatCurrency } from '@/lib/formatCurrency';

export function EmpleadosModule() {
  const [showAgregarForm, setShowAgregarForm] = useState(false);
  const [showAsistencia, setShowAsistencia] = useState(false);
  const { setDestinatarios, setSubcategorias, setLoading, loading, subcategorias, pagination,searchTerm, setSearchTerm, selectedRubro, setSelectedRubro, setPagination } = useDestinatarioStore();
  // estado para pagos independientes y total 
  const [kpiCards, setKpiCards] = useState<CustomCardProps[]>([]);
  const [loadingKpis, setLoadingKpis] = useState<boolean>(true);
  const [empleadosLength, setEmpleadosLength] = useState<number>(0);
  const [loadingLength, setLoadingLength] = useState<boolean>(true);

  useEffect(() => {

    const getEmpleadosCount = async () => {
      const count =  await getCountDestinatariosByCategoryId(import.meta.env.VITE_CATEGORIA_EMPLEADOS_UUID as string);

      const kpiCardFormat : CustomCardProps = {
        LeftTop: User,
        titleForBadge: 'Total',
        titleForCard: `${count}`,
        subtitleForCard: `Total de empleados`,
        miniDescriptionForCard: 'Incluye todos los empleados registrados'
      };

      return kpiCardFormat;
    }

    const getAmountOfMonthlyPayments = async () => {
        // asegurarse de await la función que devuelve una Promise
        const payments = await getActualMonthlyPayAmountOfEachEmployee() as { id: any; individualPayment?: number; name: any;}[] | null | undefined;
        const total = payments?.reduce((acc, curr) => acc + (curr.individualPayment ?? 0), 0) ?? 0;

        const kpiCardFormat: CustomCardProps = {
          LeftTop: User,
          titleForBadge: 'Total',
          titleForCard: `${formatCurrency(total.toString())}`,
          subtitleForCard: `Total de pagos`,
          miniDescriptionForCard: 'Incluye todos los pagos registrados'
        };

        return kpiCardFormat;
      }

      const getAllEmpleadosWithAliasesAndSubcategories = async () => {
        const empleados = await getDestinatariosWithAliasesAndSubcategoriasByCategoryId(import.meta.env.VITE_CATEGORIA_EMPLEADOS_UUID as string, pagination, searchTerm, selectedRubro);

        if (!empleados) {
          console.error('No se encontraron empleados');
          return null;
        }

        const empleadosWithPayments = await Promise.all(
          empleados.map(async empleado => {
            const individualPayment = await getActualMonthlyPayAmountOfEachEmployeeGivenEmployeeId(empleado.id);
            return {
              ...empleado,
              individualPayment: individualPayment ?? 0,
            };
          })
        );

        if (!empleadosWithPayments) {
          console.error('No se encontraron empleados con pagos');
          return null;
        }

        return empleadosWithPayments
      }

    const firstFetch = async () => {
      setLoadingKpis(true);
      const firstResults = await Promise.all([
        getEmpleadosCount(),
        getAmountOfMonthlyPayments(),

      ]);

      const [empleadosCount, monthlyPayments] = firstResults;

      setKpiCards((prev) => [
        ...prev,
        empleadosCount,
        monthlyPayments
      ]);
      setLoadingKpis(false);
    }

    const secondFetch = async () => {
      setLoading(true);
      const [empleadosWithPayments, subcategorias] = await Promise.all([
        getAllEmpleadosWithAliasesAndSubcategories(),
        getAllSubcategoriasOfDestinatarios(import.meta.env.VITE_CATEGORIA_EMPLEADOS_UUID as string)
      ]);
      if (!empleadosWithPayments) {
        console.error('No se encontraron empleados con pagos');
        return null;
      }
      const subcats = subcategorias.map((subcat : { name: string }) => subcat.name);
      setSubcategorias(['Todos', ...subcats]);
      setDestinatarios(empleadosWithPayments);
      setLoading(false);
    }

    firstFetch();
    secondFetch();
  }, [])

  useEffect(() => {
    const fetchEmpleadosLength = async () => {
      setLoadingLength(true);
      const count = await getCountDestinatariosByCategoryId(import.meta.env.VITE_CATEGORIA_EMPLEADOS_UUID as string, searchTerm, selectedRubro);
      setEmpleadosLength(count || 0);
      setLoadingLength(false);
    }
    fetchEmpleadosLength();
  }, [pagination.page, pagination.limit, searchTerm, selectedRubro]);


   useEffect(() => {
    const updatingEmpleados = async () => {
      setLoading(true);
      const proveedores = await getDestinatariosWithAliasesAndSubcategoriasByCategoryId(import.meta.env.VITE_CATEGORIA_EMPLEADOS_UUID as string, pagination, searchTerm, selectedRubro);
      if (!proveedores) {
        console.error('No se encontraron proveedores');
        return null;
      }
      setDestinatarios(proveedores);
      setLoading(false);
    }
    updatingEmpleados();

  }, [pagination, searchTerm, selectedRubro])


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de personal</p>
          <h1 className="font-display text-4xl text-foreground">
            EMPLEADOS
          </h1>
        </div>
        
        <BotonesControlEmpleados
          setShowAsistenciaForm={setShowAsistencia}
          showAsistenciaForm={showAsistencia}
          setShowRegistrarForm={setShowAgregarForm}
          showRegistrarForm={showAgregarForm}
        />
      </div>

      {/* KPI Cards */}
      {(!showAsistencia && !showAgregarForm) && (
        <div>
          {loadingKpis ? (
            <KPISCardsSkeleton amountCards={2}/>
          ) : (
            <KPISForEmpleados KPISempleados={kpiCards} />
          )}
            <Pagination
              loadingLength={loadingLength}
              pagination={pagination}
              setPagination={setPagination}
              destinatariosLength={empleadosLength}
            />
        </div>
        //agregamos los botones para pagination en esta parte
      )}

      {/* Formulario de agregar empleado (condicional) */}
      {/* {showAgregarForm && (
        <AgregarEmpleado
        cargos={cargos}
        setShowAgregarForm={setShowAgregarForm}
        turnos={turnos}
        />
      )} */}


      {/* Filtros y búsqueda */}
      {!showAgregarForm && !showAsistencia && (
       //TODO: completar esta parte, ya globalice los destinatarios asi que se me hara mas facil
       <FiltroyBusqueda
          optionForSelect={subcategorias}
          loading={loading}
          setLoading={setLoading}
          setMainStructure={setDestinatarios}
          setSearchTermGlobal={setSearchTerm}
          setSelectedOptionGlobal={setSelectedRubro}
          categoria={import.meta.env.VITE_CATEGORIA_EMPLEADOS_UUID as string}
        />
        
      )}

      {/* Tabla de empleados */}
      {!showAgregarForm && !showAsistencia && (
       <>
       {loading ? (
         <TablaEmpleadosSkeleton/>
       ) : (
          <TablaEmpleados/>
       )}
       </>
      )}
    </div>
  );
}