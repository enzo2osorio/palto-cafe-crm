import { CustomCard } from "@/components/Reusable/CustomCard"
import type { KPISProps } from "@/types/inicio"
import {  TrendingDown, TrendingUp } from "lucide-react"

interface KPISForCajaProps{
    kpisCards : KPISProps[]
}

export const KPISForCaja = ({ kpisCards }: KPISForCajaProps) => {
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpisCards.map((kpi, index) => (
            <CustomCard
            key={index}
            LeftTop={kpi.icon}
            CompleteBadge={
                <span className={`${kpi.bgForBadge} ${kpi.colorTextForBadge} dark:${kpi.bgDarkForBadge} dark:${kpi.colorTextDarkForBadge} font-ui font-semibold px-3 py-1 rounded-lg flex items-center`}>
                {kpi.trend === 'up' ? (
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                ) : (
                    <TrendingDown className="inline w-4 h-4 mr-1" />
                )}
                {kpi.changeMin}
                </span>
            }
            titleForCard={kpi.value}
            subtitleForCard={kpi.title}
            miniDescriptionForCard={kpi.change}
            />
        ))}
        
        
      </div>
  )
}
