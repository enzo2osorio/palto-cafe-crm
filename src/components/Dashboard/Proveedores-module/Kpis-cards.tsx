import { CustomCard, type CustomCardProps } from '@/components/Reusable/CustomCard';
import { formatCurrency } from '@/lib/formatCurrency';
import type { ProveedoresProps } from '@/types/proveedores';
import { Building, MapPin, User } from 'lucide-react'

interface KPISProveedoresProps {
  proveedores: ProveedoresProps[]
};


export const KPISProveedores = ({ proveedores }: KPISProveedoresProps) => {

  const totalProveedoresActivos = proveedores.filter(p => p.estado === 'activo').length;
  const montoTotalCompras = proveedores.reduce((sum, p) => sum + parseFloat(p.montoTotal), 0)  
  const montoEnPesos = formatCurrency(montoTotalCompras.toString())
  const kpisForProveedores : CustomCardProps[] = [
  {
    LeftTop: Building,
    titleForBadge: 'Activos',
    titleForCard: '3',
    subtitleForCard: `Proveedores activos de ${totalProveedoresActivos} totales`,
    miniDescriptionForCard: 'Incluye proveedores activos y en pausa'
  },
  {
    LeftTop: User,
    titleForBadge: 'Total',
    titleForCard: `${proveedores.length}`,
    subtitleForCard: 'Total de proveedores en el sistema',
    miniDescriptionForCard: 'Incluye todos los proveedores registrados'
  },
  {
    LeftTop: MapPin,
    titleForBadge: '+15%',
    titleForCard: `${montoEnPesos}`,
    subtitleForCard: 'Compras totales de este mes',
    miniDescriptionForCard: 'Monto total de compras realizadas'
  }
]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
          kpisForProveedores.map((kpi, index) => (
            <CustomCard
            key={index}
            LeftTop={kpi.LeftTop}
            RightTop={kpi.RightTop}
            miniDescriptionForCard={kpi.miniDescriptionForCard}
            subtitleForCard={kpi.subtitleForCard}
            titleForCard={kpi.titleForCard}
            titleForBadge={kpi.titleForBadge}
            />
          ))
        }
      </div>
  )
}
