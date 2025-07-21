import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import { TrendingUp } from 'lucide-react'

export const Proyecciones = () => {
  return (
    <Card className="card-warm p-6 border-0">
            <h3 className="font-body text-xl text-foreground mb-6">Proyecciones y Tendencias</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-accent  rounded-xl">
                <h4 className="font-ui font-semibold text-foreground mb-2">Próximo Mes</h4>
                <p className="font-display text-2xl text-primary">{formatCurrency("4650000")}</p>
                <p className="font-ui text-sm text-muted-foreground">Ventas proyectadas</p>
                <Badge className="bg-success/10 text-success border-success/20 mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +10.4%
                </Badge>
              </div>
              
              <div className="text-center p-6 bg-accent rounded-xl">
                <h4 className="font-ui font-semibold text-foreground mb-2">Próximo Trimestre</h4>
                <p className="font-display text-2xl text-success">{formatCurrency("14200000")}</p>
                <p className="font-ui text-sm text-muted-foreground">Ingresos estimados</p>
                <Badge className="bg-success/10 text-success border-success/20 mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.8%
                </Badge>
              </div>
              
              <div className="text-center p-6 bg-accent rounded-xl">
                <h4 className="font-ui font-semibold text-foreground mb-2">ROI Proyectado</h4>
                <p className="font-display text-2xl text-warning">185%</p>
                <p className="font-ui text-sm text-muted-foreground">Retorno de inversión</p>
                <Badge className="bg-warning/10 text-warning border-warning/20 mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2%
                </Badge>
              </div>
            </div>
          </Card>
  )
}
