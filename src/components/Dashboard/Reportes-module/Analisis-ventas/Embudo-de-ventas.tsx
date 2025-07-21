import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/lib/formatNumber'

export const EmbudoDeVentas = () => {
  return (
     <Card className="card-warm p-6 border-0 lg:col-span-2">
              <h3 className="font-body text-xl text-foreground mb-6">Embudo de Conversión</h3>
              
              <div className="space-y-4">
                {[
                  { etapa: 'Visitantes', cantidad: "1250", porcentaje: 100, color: 'bg-blue-500' },
                  { etapa: 'Interesados', cantidad: "890", porcentaje: 71, color: 'bg-green-500' },
                  { etapa: 'Compradores', cantidad: "742", porcentaje: 59, color: 'bg-primary' },
                  { etapa: 'Recurrentes', cantidad: "456", porcentaje: 36, color: 'bg-purple-500' }
                ].map((etapa, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-ui font-medium text-foreground">{etapa.etapa}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-ui font-semibold text-foreground">{formatNumber(etapa.cantidad)}</span>
                        <Badge className="bg-muted text-muted-foreground text-xs">
                          {etapa.porcentaje}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-muted rounded-full h-8">
                        <div 
                          className={`${etapa.color} rounded-full h-8 flex items-center justify-center transition-all`}
                          style={{ width: `${etapa.porcentaje}%` }}
                        >
                          <span className="text-white font-ui text-sm font-medium">{etapa.porcentaje}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
  )
}
