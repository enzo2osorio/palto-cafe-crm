import { CustomCard } from "@/components/Reusable/CustomCard"
import { formatCurrency } from "@/lib/formatCurrency"
import type { TransaccionesProps } from "@/types/caja"
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react"

interface KPISForCajaProps{
    transacciones : TransaccionesProps[]
}

export const KPISForCaja = ({ transacciones }: KPISForCajaProps) => {
    const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const totalEgresos = transacciones
    .filter(t => t.tipo === 'egreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const flujoNeto = totalIngresos - totalEgresos;

    const KPIsForCaja = [
        {
            title: "Total Ingresos",
            value: formatCurrency(totalIngresos.toString()),
            change: "+12%",
            changeMin: "+12%",
            bgForBadge: "bg-success/10",
            colorTextForBadge: "text-success",
            bgDarkForBadge: "dark:bg-success/20",
            colorTextDarkForBadge: "dark:text-success",
            trend: "up",
            icon: TrendingUp
        },
        {
            title: "Total Egresos",
            value: formatCurrency(totalEgresos.toString()),
            change: "+8%",
            changeMin: "+5%",
            bgForBadge: "bg-destructive/10",
            colorTextForBadge: "text-destructive",
            bgDarkForBadge: "dark:bg-destructive/20",
            colorTextDarkForBadge: "dark:text-destructive",
            trend: "down",
            icon: TrendingDown
        },
        {
            title: "Flujo Neto",
            value: formatCurrency(flujoNeto.toString()),
            change: "+15%",
            changeMin: "+20%",
            bgForBadge: "bg-primary/10",
            colorTextForBadge: "text-primary",
            bgDarkForBadge: "dark:bg-primary/20",
            colorTextDarkForBadge: "dark:text-primary",
            trend: "up",
            icon: DollarSign
        }
    ]

    return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KPIsForCaja.map((kpi, index) => (
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
