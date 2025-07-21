import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatCurrency"

export const MetricasDeVentas = () => {
  return (
    <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Métricas Clave</h3>
              
              <div className="space-y-6">
                <div className="text-center p-4 bg-primary/5 rounded-xl">
                  <p className="font-display text-3xl text-primary">{formatCurrency("5676")}</p>
                  <p className="font-ui text-sm text-muted-foreground">Ticket Promedio</p>
                </div>
                
                <div className="text-center p-4 bg-success/5 rounded-xl">
                  <p className="font-display text-3xl text-success">18.5</p>
                  <p className="font-ui text-sm text-muted-foreground">Órdenes por Día</p>
                </div>
                
                <div className="text-center p-4 bg-warning/5 rounded-xl">
                  <p className="font-display text-3xl text-warning">67%</p>
                  <p className="font-ui text-sm text-muted-foreground">Tasa de Conversión</p>
                </div>
              </div>
            </Card>
  )
}
