import { proveedores, rubros } from '@/utils/proveedores-blank';
import { KPISProveedores } from './Kpis-cards';
import { ContainerListadoProveedores } from './Container-listado-proveedores';
import { ButtonCustom } from '@/components/ui/ButtonCustom';
import { Minus, Plus, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AgregarProveedor } from './Agregar-proveedor';
import { getMontlyCostOfSuppliers } from '@/utils/registros/registrosMensuales/getMonthlyCostsOfSuppliers';
import type { CustomCardProps } from '@/components/Reusable/CustomCard';
import { getCountProveedores } from '@/utils/registros/proveedores/getAllProveedores';
import { formatCurrency } from '@/lib/formatCurrency';
import { getTopProveedor } from '@/utils/registros/proveedores/getTopProveedor';

export function ProveedoresModule() {

  const [agregarProveedor, setAgregarProveedor] = useState(false);
  const [monthlyCostsForProveedores, setMonthlyCostsForProveedores] = useState<CustomCardProps[]>([]);

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
        titleForBadge: 'Es una banda',
        titleForCard: `${totalEnPesos}`,
        subtitleForCard: `Compras totales de este mes`,
        miniDescriptionForCard: 'Monto total de compras realizadas'
      };
      return customCardFormat;
    };

    const fetchAllSuppliers = async (): Promise<CustomCardProps | null> => {
      const allSuppliers = await getCountProveedores();
      if (!allSuppliers) {
        console.error('No se encontraron proveedores');
        return null;
      }
      const count = allSuppliers.length;

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

    const initAllKPIs = async () => {
      const [monthlyCosts, allSuppliers, topProveedor] = await Promise.all([
        fetchMonthlyCosts(),
        fetchAllSuppliers(),
        fetchTopProveedor()
      ]);

      const cards: CustomCardProps[] = [];
      if (monthlyCosts) cards.push(monthlyCosts);
      if (allSuppliers) cards.push(allSuppliers);
      if (topProveedor) cards.push(topProveedor);
      setMonthlyCostsForProveedores(cards);
    };

    // Ejecutar
    initAllKPIs();

  }, [])



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
         <KPISProveedores proveedores={monthlyCostsForProveedores} />

      <ContainerListadoProveedores
      proveedores={proveedores}
      rubros={rubros}
      />
        </>
      ) : (
        <AgregarProveedor
        rubros={rubros}
        />
      )
     }
      
       
    </div>
  );
}