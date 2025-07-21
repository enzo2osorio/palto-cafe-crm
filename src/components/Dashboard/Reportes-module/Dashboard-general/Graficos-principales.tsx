import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatCurrency';
import type { VentasDiariasProps, VentasPorCategoriaProps } from '@/types/reportes';
import { BarChart3, PieChart } from 'lucide-react';

interface GraficosPrincipalesProps{
    ventasPorDia : VentasDiariasProps[]
    ventasPorCategoria : VentasPorCategoriaProps[]
}

export const GraficosPrincipales = ({ventasPorDia, ventasPorCategoria} : GraficosPrincipalesProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ventas diarias */}
            <Card className="card-warm p-6 border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-body text-xl text-foreground">Ventas Diarias</h3>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                <div className="h-64 flex items-end justify-between space-x-2">
                  {ventasPorDia.map((dia, index) => {
                    const maxVentas = Math.max(...ventasPorDia.map(d => parseFloat(d.ventas)));
                    const height = (parseFloat(dia.ventas) / maxVentas) * 100;
                    
                    return (
                      <div key={index} className="flex-1 space-y-2">
                        <div className="flex flex-col items-center h-48">
                          <div className="flex-1 flex items-end">
                            <div 
                              className="bg-gradient-to-t from-primary to-primary-light rounded-t-lg w-full transition-all hover:opacity-80 cursor-pointer"
                              style={{ height: `${height}%` }}
                              title={`${dia.dia}: ${formatCurrency(dia.ventas)}`}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-ui text-sm text-foreground">{dia.dia}</p>
                          <p className="font-ui text-xs text-muted-foreground">{dia.ordenes} órdenes</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between text-muted-foreground font-ui text-sm">
                  <span>0</span>
                  <span>{formatCurrency(Math.max(...ventasPorDia.map(d => parseFloat(d.ventas))).toString())}</span>
                </div>
              </div>
            </Card>

            {/* Distribución por categorías */}
            <Card className="card-warm p-6 border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-body text-xl text-foreground">Ventas por Categoría</h3>
                <PieChart className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                {ventasPorCategoria.map((categoria, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-ui text-sm text-foreground">{categoria.categoria}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-ui font-semibold text-foreground">{formatCurrency(categoria.ventas)}</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {categoria.porcentaje}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-light rounded-full h-3 transition-all"
                        style={{ width: `${categoria.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
  )
}
