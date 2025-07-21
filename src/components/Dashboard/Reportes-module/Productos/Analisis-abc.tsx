import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export const AnalisisABCForReportes = () => {
  return (
    <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Análisis ABC de Productos</h3>
              
              <div className="space-y-6">
                <div className="bg-success/10 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-success mb-2">Categoría A (Alto valor)</h4>
                  <p className="font-ui text-sm text-muted-foreground mb-3">20% de productos, 80% de ingresos</p>
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">12 productos</span>
                    <Badge className="bg-success text-white">80%</Badge>
                  </div>
                </div>
                
                <div className="bg-warning/10 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-warning mb-2">Categoría B (Valor medio)</h4>
                  <p className="font-ui text-sm text-muted-foreground mb-3">30% de productos, 15% de ingresos</p>
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">18 productos</span>
                    <Badge className="bg-warning text-white">15%</Badge>
                  </div>
                </div>
                
                <div className="bg-destructive/10 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-destructive mb-2">Categoría C (Bajo valor)</h4>
                  <p className="font-ui text-sm text-muted-foreground mb-3">50% de productos, 5% de ingresos</p>
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">30 productos</span>
                    <Badge className="bg-destructive text-white">5%</Badge>
                  </div>
                </div>
              </div>
            </Card>
  )
}
