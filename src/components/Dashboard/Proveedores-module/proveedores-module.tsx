import { KPISProveedores } from './Kpis-cards';
import { ContainerListadoProveedores } from './Container-listado-proveedores';
import { ButtonCustom } from '@/components/ui/ButtonCustom';
import { Minus, Plus, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AgregarProveedor } from './Agregar-proveedor';
import { getMontlyCostOfSuppliers } from '@/utils/registros/registrosMensuales/getMonthlyCostsOfSuppliers';
import type { CustomCardProps } from '@/components/Reusable/CustomCard';
import { getCountProveedores, getProveedoresWithAliasesAndSubcategorias, type PaginationProveedores } from '@/utils/registros/proveedores/getAllProveedores';
import { formatCurrency } from '@/lib/formatCurrency';
import { getTopProveedor } from '@/utils/registros/proveedores/getTopProveedor';
import { KPISCardsSkeleton } from '../Skeletons/KpisCardsSkeleton';
import { getAllSubcategoriasOfProovedores } from '@/utils/registros/subcategorias/getAllSubcategoriasOfProovedores';
import { useProveedorStore } from '@/lib/store/proovedorStore';


export function ProveedoresModule() {

  const [agregarProveedor, setAgregarProveedor] = useState(false);
  const [monthlyCostsForProveedores, setMonthlyCostsForProveedores] = useState<CustomCardProps[]>([]);
  const [isLoadingCosts, setIsLoadingCosts] = useState(true);
  const { setProveedores, setSubcategorias, proveedores, subcategorias, setLoading, pagination } = useProveedorStore();

  const handleAgregarProveedor = () => {
    setAgregarProveedor(!agregarProveedor);
  }

  useEffect(() => {
    const fetchMonthlyCosts = async (): Promise<CustomCardProps | null> => {
      const costs = await getMontlyCostOfSuppliers();
      if (!costs || costs.length === 0) {
        console.error('No se encontraron costos mensuales para proveedores');
        return null;
      }

      // costs: Array<{ monto: number }>
      const totalMonto = costs.reduce((acc: number, cost: { monto: number }) => acc + (Number(cost.monto) || 0), 0);
      const totalEnPesos = formatCurrency(totalMonto.toString())

      const customCardFormat: CustomCardProps = {
        LeftTop: Plus,
        titleForBadge: 'Amigo es una banda',
        titleForCard: `${totalEnPesos}`,
        subtitleForCard: `Compras totales de este mes`,
        miniDescriptionForCard: 'Monto total de compras realizadas'
      };
      return customCardFormat;
    };

    const fetchAllSuppliers = async (): Promise<CustomCardProps | null> => {
      const allSuppliersCount = await getCountProveedores(); // devuelve number
      if (typeof allSuppliersCount !== 'number') {
        console.error('No se pudieron contar los proveedores');
        return null;
      }
      const count = allSuppliersCount;

      const customCardFormat: CustomCardProps = {
        LeftTop: User,
        titleForBadge: 'Total',
        titleForCard: `${count}`,
        subtitleForCard: `Total de proveedores`,
        miniDescriptionForCard: 'Incluye todos los proveedores registrados'
      };

      return customCardFormat;
    };

    const fetchTopProveedor = async(): Promise<CustomCardProps | null> => {
      const topProveedor = await getTopProveedor();
      if (!topProveedor) {
        console.error('No se encontró el proveedor principal');
        return null;
      }

      const customCardFormat: CustomCardProps = {
        LeftTop: User,
        titleForBadge: 'Top Proveedor',
        titleForCard: `${topProveedor.nombre}`,
        subtitleForCard: `Gasto más alto: ${formatCurrency(topProveedor.total_gastado)}`,
        miniDescriptionForCard: 'Proveedor con pico de gasto en el mes'
      };

      return customCardFormat;
    }

    const initProveedoresAliases = async (pagination : PaginationProveedores) => {
      const proveedoresAliases = await getProveedoresWithAliasesAndSubcategorias(pagination);
      if (!proveedoresAliases) {
        console.error('No se encontraron proveedores con alias');
        return null;
      }
      return proveedoresAliases
    }

    const initAllKPIs = async () => {
      setIsLoadingCosts(true);
      const [monthlyCosts, allSuppliers, topProveedor] = await Promise.all([
        fetchMonthlyCosts(),
        fetchAllSuppliers(),
        fetchTopProveedor(),
      ]);

      const cards: CustomCardProps[] = [];
      if (monthlyCosts) cards.push(monthlyCosts);
      if (allSuppliers) cards.push(allSuppliers);
      if (topProveedor) cards.push(topProveedor);
      setMonthlyCostsForProveedores(cards);
      setIsLoadingCosts(false);
    };

    const initListadoProveedores = async () => {
      setLoading(true);
      const [proovedores , subcategorias] = await Promise.all([
        initProveedoresAliases({page:0, limit:10}),
        getAllSubcategoriasOfProovedores()
      ]);

      if (subcategorias) {
        const subcats = subcategorias.map((subcat) => subcat.name);
        setSubcategorias(['Todos', ...subcats]);
      }
      if (proovedores) setProveedores(proovedores);
      setLoading(false);
    };

    initAllKPIs();
    initListadoProveedores();

  }, [])

  useEffect(() => {
    const updatingProveedores = async () => {
      setLoading(true);
      const proveedores = await getProveedoresWithAliasesAndSubcategorias(pagination);
      if (!proveedores) {
        console.error('No se encontraron proveedores');
        return null;
      }
      setProveedores(proveedores);
      setLoading(false);
    }
    updatingProveedores();

  }, [pagination])


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de proveedores</p>
          <h1 className="font-display text-4xl text-foreground">
            PROVEEDORES
          </h1>
        </div>
        <ButtonCustom
          onClick={handleAgregarProveedor}
          >
          {agregarProveedor ? <Minus className="w-5 h-5 mr-2"/> : <Plus className="w-5 h-5 mr-2" />}
          {agregarProveedor ? 'Cancelar' : 'Agregar proveedor'}
        </ButtonCustom>
      </div>

      {/* KPI Cards */}
     {
      !agregarProveedor ? (
        <>
       {isLoadingCosts ? <KPISCardsSkeleton/> : (
         <KPISProveedores proveedores={monthlyCostsForProveedores} />
       )}

      <ContainerListadoProveedores/>
        </>
      ) : (
        <AgregarProveedor
        rubros={subcategorias}
        />
      )
     }
      
       
    </div>
  );
}