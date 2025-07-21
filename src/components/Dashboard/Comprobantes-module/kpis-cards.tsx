import { CustomCard, type CustomCardProps } from '@/components/Reusable/CustomCard'
import { Calendar, DollarSign, FileText, Zap } from 'lucide-react'

interface KPISCardsForComprobantesProps {
  totalComprobantes: number;
  totalHoy: number;
  montoTotal: number;
  procesadosConIA: number;
}

export const KPISCardsForComprobantes = ({ totalComprobantes, totalHoy, montoTotal, procesadosConIA }: KPISCardsForComprobantesProps) => {

    const kpisForComprobantes : CustomCardProps[] = [
      {
        LeftTop : FileText,
        titleForBadge: 'Total',
        titleForCard: `${totalComprobantes}`, // Example total, replace with actual prop if needed
        subtitleForCard: 'Total Comprobantes',
        miniDescriptionForCard: 'En el sistema',
      },
      {
        LeftTop : Calendar,
        titleForBadge: 'Hoy',
        titleForCard: `${totalHoy}`,
        subtitleForCard: 'Subidos Hoy',
        miniDescriptionForCard: 'Nuevos documentos',
      },
      {
        LeftTop : DollarSign,
        titleForBadge: 'Total',
        titleForCard: `${montoTotal}`,
        subtitleForCard: 'Monto Total',
        miniDescriptionForCard: 'Documentados',
      },
      {
        LeftTop : Zap,
        titleForBadge: 'IA',
        titleForCard: `${procesadosConIA}`,
        subtitleForCard: 'Procesados con IA',
        miniDescriptionForCard: 'Automatizados',
      },
    ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {
                  kpisForComprobantes.map((kpi, index) => (
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
