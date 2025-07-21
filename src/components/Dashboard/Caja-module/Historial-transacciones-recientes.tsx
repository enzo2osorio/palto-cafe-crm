import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { SelectCustom } from "@/components/ui/SelectCustom"
import { formatCurrency } from "@/lib/formatCurrency"
import type { TransaccionesProps } from "@/types/caja"
import { Filter, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"

interface HistorialTransaccionesRecientesProps{
    transacciones : TransaccionesProps[]
}

export const HistorialTransaccionesRecientes = ({ transacciones }: HistorialTransaccionesRecientesProps) => {
  
  const [selectedOption, setSelectedOption] = useState('Todas las transacciones');

  const options = [
    { value: 'Todas las transacciones', label: 'Todas' },
    { value: 'Ingresos', label: 'Ingresos' },
    { value: 'Egresos', label: 'Egresos' },
  ];

  return (
    <Card className="card-warm p-6 border-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-body text-2xl text-foreground">Transacciones recientes</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <SelectCustom
            
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            options={options}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {transacciones.slice(0, 5).map((transaccion) => (
            <div key={transaccion.id} className="bg-white dark:bg-accent rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaccion.tipo === 'ingreso' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {transaccion.tipo === 'ingreso' 
                      ? <TrendingUp className="w-6 h-6" />
                      : <TrendingDown className="w-6 h-6" />
                    }
                  </div>
                  
                  <div>
                    <h4 className="font-ui font-semibold text-foreground">{transaccion.categoria}</h4>
                    <p className="font-ui text-sm text-muted-foreground">{transaccion.descripcion}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="font-ui text-xs text-muted-foreground">{transaccion.fecha}</span>
                      <span className="font-ui text-xs text-muted-foreground">{transaccion.metodoPago}</span>
                      {transaccion.comprobante && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Con comprobante
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-ui font-bold text-lg ${
                    transaccion.tipo === 'ingreso' 
                      ? 'text-success' 
                      : 'text-destructive'
                  }`}>
                    {transaccion.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(transaccion.monto.toString())}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
  )
}
