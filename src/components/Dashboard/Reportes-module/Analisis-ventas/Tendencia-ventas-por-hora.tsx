import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatCurrency';

export const Tendencia = () => {
  return (
    <Card className="card-warm p-6 border-0">
            <h3 className="font-body text-xl text-foreground mb-6">Ventas por Hora del Día</h3>
            
            <div className="h-48 flex items-end justify-between space-x-1">
              {Array.from({ length: 24 }, (_, i) => {
                const hora = i;
                const ventas = Math.random() * 50000 + 10000; // Datos simulados
                const maxVentas = 60000;
                const height = (ventas / maxVentas) * 100;
                
                return (
                  <div key={i} className="flex-1 space-y-1">
                    <div className="flex flex-col items-center h-40">
                      <div className="flex-1 flex items-end">
                        <div 
                          className="bg-gradient-to-t from-accent to-accent/60 rounded-t w-full transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                          title={`${hora}:00 - ${formatCurrency(ventas.toString())}`}
                        />
                      </div>
                    </div>
                    <p className="text-center font-ui text-xs text-muted-foreground">
                      {hora.toString().padStart(2, '0')}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
  )
}
