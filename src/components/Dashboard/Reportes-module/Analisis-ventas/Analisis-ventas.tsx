import { useEffect, useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { BarChart, PieChart } from '@mui/x-charts';
import { getVentasPorDiaSemana, getMetricasClaveVentas, type VentasPorDia } from '@/utils/reportes/getTicketPromedioYOrdenes';
import { formatCurrency } from '@/lib/formatCurrency';
import { ShoppingCart, Calendar, Percent, TrendingUp } from 'lucide-react';

export const AnalisisVentas = () => {
  const [loading, setLoading] = useState(true);
  const [ventasPorDia, setVentasPorDia] = useState<VentasPorDia[]>([]);
  const [metricas, setMetricas] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ventasData, metricasData] = await Promise.all([
          getVentasPorDiaSemana(3),
          getMetricasClaveVentas(3)
        ]);
        
        setVentasPorDia(ventasData);
        setMetricas(metricasData);
      } catch (error) {
        console.error('Error fetching ventas data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <TabsContent value="ventas" className="space-y-6">
      {/* Métricas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Ticket Promedio</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {metricas ? formatCurrency(metricas.ticketPromedio.toString()) : '$0'}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Últimos 3 meses
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Órdenes por Día</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {metricas ? metricas.ordenesPorDia.toFixed(1) : '0'}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Promedio diario
              </p>
            </div>
            <div className="p-2 rounded-lg bg-success/10 dark:bg-success/20">
              <Calendar className="w-5 h-5 text-success" />
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Total Órdenes</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {metricas ? metricas.totalOrdenes.toLocaleString() : '0'}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Últimos 3 meses
              </p>
            </div>
            <div className="p-2 rounded-lg bg-warning/10 dark:bg-warning/20">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {metricas ? formatCurrency(metricas.totalIngresos.toString()) : '$0'}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Período analizado
              </p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/10 dark:bg-destructive/20">
              <Percent className="w-5 h-5 text-destructive" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por Día de la Semana */}
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-xl text-foreground mb-4">Ventas por Día de la Semana</h3>
          {!loading && ventasPorDia.length > 0 && (
            <BarChart
              height={300}
              series={[
                {
                  data: ventasPorDia.map(v => v.porcentaje),
                  label: 'Porcentaje de Ventas',
                  color: '#10b981'
                }
              ]}
              xAxis={[{ 
                scaleType: 'band', 
                data: ventasPorDia.map(v => v.dia.substring(0, 3)) 
              }]}
              sx={{
                "& .MuiChartsAxis-root .MuiChartsAxis-line": {
                  stroke: "var(--muted-foreground)",
                },
                "& .MuiChartsAxis-root .MuiChartsAxis-tick": {
                  stroke: "var(--muted-foreground)",
                },
                "& .MuiChartsAxis-root .MuiChartsAxis-tickLabel": {
                  fill: "var(--foreground)",
                  fontSize: "0.75rem",
                },
                "& .MuiChartsGrid-line": {
                  stroke: "var(--border)",
                },

                "& .MuiChartsTooltip-root": {
                  background: "var(--background)",
                  color: "var(--foreground)", 
                  border: "1px solid var(--border)",
                  fontSize: "0.75rem",
                },
                "& .MuiChartsTooltip-mark": {
                  borderColor: "var(--foreground)",
                },
              }}
            />
          )}
        </Card>

        {/* Ticket por Origen */}
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-xl text-foreground mb-4">Ticket Promedio por Origen</h3>
          {!loading && metricas?.ticketsPorOrigen && (
            <PieChart
              height={300}
              series={[
                {
                  data: metricas.ticketsPorOrigen.map((item: any, index: number) => ({
                    id: index,
                    value: item.ticketPromedio,
                    label: item.origen.toUpperCase(),
                    color: item.origen === 'fudo' ? '#10b981' : '#3b82f6'
                  }))
                }
              ]}
              sx={{
                "& .MuiChartsAxis-root .MuiChartsAxis-line": {
                  stroke: "var(--muted-foreground)",
                },
                "& .MuiChartsAxis-root .MuiChartsAxis-tick": {
                  stroke: "var(--muted-foreground)",
                },
                "& .MuiChartsAxis-root .MuiChartsAxis-tickLabel": {
                  fill: "var(--foreground)",
                  fontSize: "0.75rem",
                },
                "& .MuiChartsGrid-line": {
                  stroke: "var(--border)",
                },

                "& .MuiChartsTooltip-root": {
                  background: "var(--background)",
                  color: "var(--foreground)", 
                  border: "1px solid var(--border)",
                  fontSize: "0.75rem",
                },
                "& .MuiChartsTooltip-mark": {
                  borderColor: "var(--foreground)",
                },
              }}
            />
          )}
        </Card>
      </div>

      {/* Tabla de Detalles por Día */}
      <Card className="card-warm p-6 border-0">
        <h3 className="font-body text-xl text-foreground mb-4">Detalle por Día de la Semana</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-ui font-semibold text-foreground">Día</th>
                <th className="text-right p-3 font-ui font-semibold text-foreground">Ventas</th>
                <th className="text-right p-3 font-ui font-semibold text-foreground">Porcentaje</th>
                <th className="text-right p-3 font-ui font-semibold text-foreground">Órdenes</th>
                <th className="text-right p-3 font-ui font-semibold text-foreground">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody>
              {ventasPorDia.map((dia, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-ui text-foreground font-semibold">{dia.dia}</td>
                  <td className="p-3 font-ui text-right text-success">
                    {formatCurrency(dia.totalVentas.toString())}
                  </td>
                  <td className="p-3 font-ui text-right text-primary">
                    {dia.porcentaje.toFixed(1)}%
                  </td>
                  <td className="p-3 font-ui text-right text-foreground">
                    {dia.cantidadOrdenes}
                  </td>
                  <td className="p-3 font-ui text-right text-foreground">
                    {dia.cantidadOrdenes > 0 ? formatCurrency((dia.totalVentas / dia.cantidadOrdenes).toString()) : '$0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </TabsContent>
  );
};