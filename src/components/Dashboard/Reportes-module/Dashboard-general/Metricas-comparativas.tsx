import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatCurrency"
import { formatNumber } from "@/lib/formatNumber"
import type { MetricasComparativasProps } from "@/types/reportes"
import { TrendingDown, TrendingUp } from "lucide-react"

interface MetricasComparativassProps{
    metricsComparativas : MetricasComparativasProps[]
}

export const MetricasComparativass = ({metricsComparativas} : MetricasComparativassProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metricsComparativas.map((metric, index) => (
              <Card key={index} className="card-warm p-6 border-0">
                <div className="flex items-center justify-between mb-4">
                  {metric.trending === 'up' ? (
                    <TrendingUp className="w-6 h-6 text-success" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-destructive" />
                  )}
                  <Badge className={`${
                    metric.trending === 'up' 
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  } font-ui text-xs`}>
                    {metric.trending === 'up' ? '+' : ''}{metric.cambio}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display text-2xl text-foreground">
                    {metric.titulo.includes('Ventas') || metric.titulo.includes('Ticket') 
                      ? formatCurrency(metric.actual)
                      : metric.titulo.includes('Margen')
                      ? `${metric.actual}%`
                      : formatNumber(metric.actual)
                    }
                  </h3>
                  <p className="font-ui font-semibold text-foreground">{metric.titulo}</p>
                  <p className="font-ui text-sm text-muted-foreground">
                    vs. período anterior: {
                      metric.titulo.includes('Ventas') || metric.titulo.includes('Ticket') 
                        ? formatCurrency(metric.anterior)
                        : metric.titulo.includes('Margen')
                        ? `${metric.anterior}%`
                        : formatNumber(metric.anterior)
                    }
                  </p>
                </div>
              </Card>
            ))}
          </div>
  )
}
