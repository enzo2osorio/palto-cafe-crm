import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'

export const Rentabilidad = () => {
  return (
    <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Análisis de Rentabilidad</h3>
              
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-4 text-center">
                  <p className="font-display text-4xl text-primary">42.5%</p>
                  <p className="font-ui text-sm text-muted-foreground">Margen Bruto</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-ui text-sm text-foreground">Ingresos Totales</span>
                    <span className="font-ui font-semibold text-success">{formatCurrency("4210000")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-ui text-sm text-foreground">Gastos Totales</span>
                    <span className="font-ui font-semibold text-destructive">{formatCurrency("2410000")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <span className="font-ui font-semibold text-foreground">Utilidad Neta</span>
                    <span className="font-ui font-bold text-primary">{formatCurrency("1800000")}</span>
                  </div>
                </div>
              </div>
            </Card>
  )
}
