import { useEffect, useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { BarChart, LineChart } from '@mui/x-charts';
import { getMargenNetoMensual } from '@/utils/reportes/getRentabilidadMetrics';
import { getMetricasClaveVentas } from '@/utils/reportes/getTicketPromedioYOrdenes';
;
import { formatCurrency } from '@/lib/formatCurrency';
import { TrendingUp, DollarSign, ShoppingCart, Percent } from 'lucide-react';
import { DistribucionGastosComponent } from './Distribucion-gastos';


export const DashboardGeneral = () => {
  const [loading, setLoading] = useState(true);
  const [margenes, setMargenes] = useState<any[]>([]);
  const [metricasVentas, setMetricasVentas] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [margenesData, ventasData] = await Promise.all([
          getMargenNetoMensual(3),
          getMetricasClaveVentas(3)
        ]);
        
        setMargenes(margenesData);
        setMetricasVentas(ventasData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ultimoMargen = margenes[margenes.length - 1];
  const margenAnterior = margenes[margenes.length - 2];

  return (
    <TabsContent value="dashboard" className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Ingresos del Mes</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {ultimoMargen ? formatCurrency(ultimoMargen.ingresos.toString()) : '$0'}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                vs mes anterior: {margenAnterior ? formatCurrency(margenAnterior.ingresos.toString()) : '$0'}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-success/10 dark:bg-success/20">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <span className="text-xs font-semibold text-success">
              {ultimoMargen && margenAnterior ? 
                `${(((ultimoMargen.ingresos - margenAnterior.ingresos) / margenAnterior.ingresos) * 100).toFixed(1)}%`
                : '+0%'
              }
            </span>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Margen Neto</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {ultimoMargen ? formatCurrency(ultimoMargen.margenNeto.toString()) : '$0'}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                {ultimoMargen ? `${ultimoMargen.margenPorcentaje.toFixed(1)}% de los ingresos` : '0%'}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <span className={`text-xs font-semibold ${ultimoMargen?.margenNeto >= 0 ? 'text-success' : 'text-destructive'}`}>
              {ultimoMargen?.margenNeto >= 0 ? '+' : ''}{ultimoMargen?.margenPorcentaje.toFixed(1) || 0}%
            </span>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Ticket Promedio</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {metricasVentas ? formatCurrency(metricasVentas.ticketPromedio.toString()) : '$0'}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Últimos 3 meses
              </p>
            </div>
            <div className="p-2 rounded-lg bg-warning/10 dark:bg-warning/20">
              <ShoppingCart className="w-5 h-5 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Órdenes por Día</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {metricasVentas ? metricasVentas.ordenesPorDia.toFixed(1) : '0'}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Promedio diario
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
        {/* Evolución de Ingresos y Margen */}
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-xl text-foreground mb-4">Evolución Mensual</h3>
          {!loading && margenes.length > 0 && (
            <LineChart
              height={300}
              series={[
                {
                  data: margenes.map(m => m.ingresos),
                  label: 'Ingresos',
                  color: '#10b981'
                },
                {
                  data: margenes.map(m => m.margenNeto),
                  label: 'Margen Neto',
                  color: '#3b82f6'
                }
              ]}
              xAxis={[{ 
                scaleType: 'point', 
                data: margenes.map(m => `${m.mes.substring(0, 3)} ${m.año}`) 
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

        {/* Comparativa Ingresos vs Egresos */}
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-xl text-foreground mb-4">Ingresos vs Egresos</h3>
          {!loading && margenes.length > 0 && (
            <BarChart
              height={300}
              series={[
                {
                  data: margenes.map(m => m.ingresos),
                  label: 'Ingresos',
                  color: '#10b981'
                },
                {
                  data: margenes.map(m => m.egresos),
                  label: 'Egresos',
                  color: '#ef4444'
                }
              ]}
              xAxis={[{ 
                scaleType: 'band', 
                data: margenes.map(m => `${m.mes.substring(0, 3)}`) 
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
      </div>

      {/* Distribución de Gastos */}
      <DistribucionGastosComponent mesesAtras={3} />
    </TabsContent>
  );
};