import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import type { GastosPorCategoriaProps } from '@/types/reportes'

interface GastosPorCategoriaaProps{
    gastosPorCategoria : GastosPorCategoriaProps[]
}

export const GastosPorCategoriaa = ({gastosPorCategoria} : GastosPorCategoriaaProps) => {
  return (
     <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Distribución de Gastos</h3>
              
              <div className="space-y-4">
                {gastosPorCategoria.map((gasto, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-ui text-sm text-foreground">{gasto.categoria}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-ui font-semibold text-foreground">{formatCurrency(gasto.monto)}</span>
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                          {gasto.porcentaje}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-destructive to-destructive/60 rounded-full h-3 transition-all"
                        style={{ width: `${gasto.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
  )
}
