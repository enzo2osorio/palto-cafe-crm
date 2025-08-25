import { CustomCard, type CustomCardProps } from '@/components/Reusable/CustomCard';

type KPISProveedoresProps = {
  proveedores: CustomCardProps[];
};

export const KPISProveedores = ({ proveedores }: KPISProveedoresProps) => {

//   const kpisForProveedores : CustomCardProps[] = [
//   {
//     LeftTop: Building,
//     titleForBadge: 'Activos',
//     titleForCard: '3',
//     subtitleForCard: `Proveedores activos de ${totalProveedoresActivos} totales`,
//     miniDescriptionForCard: 'Incluye proveedores activos y en pausa'
//   },
//   {
//     LeftTop: User,
//     titleForBadge: 'Total',
//     titleForCard: `${proveedores.length}`,
//     subtitleForCard: 'Total de proveedores en el sistema',
//     miniDescriptionForCard: 'Incluye todos los proveedores registrados'
//   },
//   {
//     LeftTop: MapPin,
//     titleForBadge: '+15%',
//     titleForCard: `${montoEnPesos}`,
//     subtitleForCard: 'Compras totales de este mes',
//     miniDescriptionForCard: 'Monto total de compras realizadas'
//   }
// ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
          proveedores.map((kpi, index) => (
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
