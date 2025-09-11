import { CustomCard, type CustomCardProps } from '@/components/Reusable/CustomCard'
import { Calendar, DollarSign, FileText, Zap } from 'lucide-react'

interface KPISCardsForComprobantesProps {
  kpis: CustomCardProps[];
}

export const KPISCardsForComprobantes = ({ kpis }: KPISCardsForComprobantesProps) => {


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {
                  kpis.map((kpi, index) => (
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
