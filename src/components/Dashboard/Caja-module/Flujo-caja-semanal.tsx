import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import type { DatosSemanalesProps } from "@/types/caja";

interface FlujoCajaSemanalProps{
    datosSemanales : DatosSemanalesProps[]
}

export const FlujoCajaSemanal = ({ datosSemanales }: FlujoCajaSemanalProps) => {
  return (
    <Card className="card-warm p-6 border-0">
        <h3 className="font-body text-2xl text-foreground mb-6">Flujo de caja semanal</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-end space-x-4 text-sm font-ui">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Ingresos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span>Egresos</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-4">
            {datosSemanales.map((dia, index) => {
              const maxValue = Math.max(...datosSemanales.flatMap(d => [d.ingresos, d.egresos]));
              return (
                <div key={index} className="flex-1 space-y-2">
                  <div className="flex items-end justify-center space-x-1 h-48">
                    <div 
                      className="bg-success rounded-t-lg w-6 transition-all hover:bg-success/80"
                      style={{ height: `${(dia.ingresos / maxValue) * 100}%` }}
                      title={`Ingresos: ${formatCurrency(dia.ingresos.toString())}`}
                    ></div>
                    <div 
                      className="bg-destructive rounded-t-lg w-6 transition-all hover:bg-destructive/80"
                      style={{ height: `${(dia.egresos / maxValue) * 100}%` }}
                      title={`Egresos: ${formatCurrency(dia.egresos.toString())}`}
                    ></div>
                  </div>
                  <p className="text-center font-ui text-sm text-muted-foreground">{dia.dia}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
  )
}
