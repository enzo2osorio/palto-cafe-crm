import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatCurrency"
import type { TopProductosProps } from "@/types/reportes"

interface TopProductossProps{
    topProductos : TopProductosProps[]
}

export const TopProductoss = ({topProductos} : TopProductossProps) => {
  return (
    <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Top Productos por Ventas</h3>
              
              <div className="space-y-4">
                {topProductos.map((producto, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-ui font-semibold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-ui font-medium text-foreground">{producto.producto}</p>
                        <p className="font-ui text-sm text-muted-foreground">{producto.unidades} unidades</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-ui font-semibold text-foreground">{formatCurrency(producto.ventas)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
  )
}
