import { useEffect, useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LineChart, PieChart } from '@mui/x-charts';
import { getMargenNetoMensual, getProporcionIngresosEgresos, type MargenMensual } from '@/utils/reportes/getRentabilidadMetrics';
import { formatCurrency } from '@/lib/formatCurrency';
import { KPISCardsSkeleton } from '../../Skeletons/KpisCardsSkeleton';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface RentabilidadFlujoProps {
  selectedPeriod: string;
}

export const RentabilidadFlujo = ({ selectedPeriod }: RentabilidadFlujoProps) => {
  const [loading, setLoading] = useState(true);
  const [margenesMensuales, setMargenesMensuales] = useState<MargenMensual[]>([]);
  const [proporcionActual, setProporcionActual] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [margenes, proporcion] = await Promise.all([
          getMargenNetoMensual(6),
          getProporcionIngresosEgresos(0)
        ]);
        
        setMargenesMensuales(margenes);
        setProporcionActual(proporcion);
      } catch (error) {
        console.error('Error fetching rentabilidad data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const ultimoMargen = margenesMensuales[margenesMensuales.length - 1];
  const margenAnterior = margenesMensuales[margenesMensuales.length - 2];

  const kpis = ultimoMargen ? [
    {
      title: "Margen Neto Mensual",
      value: formatCurrency(ultimoMargen.margenNeto.toString()),
      change: `${ultimoMargen.margenPorcentaje.toFixed(1)}% del total de ingresos`,
      changeMin: margenAnterior ? `${(ultimoMargen.margenPorcentaje - margenAnterior.margenPorcentaje).toFixed(1)}%` : '0%',
      bgForBadge: ultimoMargen.margenNeto >= 0 ? "bg-success/10" : "bg-destructive/10",
      colorTextForBadge: ultimoMargen.margenNeto >= 0 ? "text-success" : "text-destructive",
      bgDarkForBadge: ultimoMargen.margenNeto >= 0 ? "dark:bg-success/20" : "dark:bg-destructive/20",
      colorTextDarkForBadge: ultimoMargen.margenNeto >= 0 ? "dark:text-success" : "dark:text-destructive",
      trend: ultimoMargen.margenNeto >= (margenAnterior?.margenNeto || 0) ? "up" : "down",
      icon: ultimoMargen.margenNeto >= 0 ? TrendingUp : TrendingDown
    },
    {
      title: "Ingresos del Mes",
      value: formatCurrency(ultimoMargen.ingresos.toString()),
      change: `vs ${formatCurrency((margenAnterior?.ingresos || 0).toString())} mes anterior`,
      changeMin: margenAnterior ? `${(((ultimoMargen.ingresos - margenAnterior.ingresos) / margenAnterior.ingresos) * 100).toFixed(1)}%` : '0%',
      bgForBadge: "bg-primary/10",
      colorTextForBadge: "text-primary",
      bgDarkForBadge: "dark:bg-primary/20",
      colorTextDarkForBadge: "dark:text-primary",
      trend: ultimoMargen.ingresos >= (margenAnterior?.ingresos || 0) ? "up" : "down",
      icon: DollarSign
    },
    {
      title: "Egresos del Mes",
      value: formatCurrency(ultimoMargen.egresos.toString()),
      change: `vs ${formatCurrency((margenAnterior?.egresos || 0).toString())} mes anterior`,
      changeMin: margenAnterior ? `${(((ultimoMargen.egresos - margenAnterior.egresos) / margenAnterior.egresos) * 100).toFixed(1)}%` : '0%',
      bgForBadge: "bg-destructive/10",
      colorTextForBadge: "text-destructive",
      bgDarkForBadge: "dark:bg-destructive/20",
      colorTextDarkForBadge: "dark:text-destructive",
      trend: ultimoMargen.egresos <= (margenAnterior?.egresos || 0) ? "up" : "down",
      icon: TrendingDown
    },
    {
      title: "Eficiencia Operativa",
      value: `${(proporcionActual?.proporcionIngresos || 0).toFixed(1)}%`,
      change: `${(proporcionActual?.proporcionEgresos || 0).toFixed(1)}% se va en egresos`,
      changeMin: `${((proporcionActual?.ingresos || 0) / (proporcionActual?.egresos || 1)).toFixed(1)}x`,
      bgForBadge: "bg-primary/10",
      colorTextForBadge: "text-primary",
      bgDarkForBadge: "dark:bg-primary/20",
      colorTextDarkForBadge: "dark:text-primary",
      trend: "up",
      icon: Percent
    }
  ] : [];

  return (
    <TabsContent value="rentabilidad" className="space-y-6">
      {/* KPIs */}
      {loading ? (
        <KPISCardsSkeleton amountCards={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <Card key={index} className="card-warm p-6 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-ui text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <p className="font-ui text-xs text-muted-foreground mt-1">{kpi.change}</p>
                </div>
                <div className={`p-2 rounded-lg ${kpi.bgForBadge} ${kpi.bgDarkForBadge}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.colorTextForBadge} ${kpi.colorTextDarkForBadge}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <span className={`text-xs font-semibold ${kpi.colorTextForBadge} ${kpi.colorTextDarkForBadge}`}>
                  {kpi.changeMin}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolución del Margen */}
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-xl text-foreground mb-4">Evolución del Margen Neto</h3>
          {!loading && margenesMensuales.length > 0 && (
            <LineChart
              height={300}
              series={[
                {
                  data: margenesMensuales.map(m => m.margenNeto),
                  label: 'Margen Neto',
                  color: '#10b981'
                }
              ]}
              xAxis={[{ 
                scaleType: 'point', 
                data: margenesMensuales.map(m => `${m.mes} ${m.año}`) 
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

        {/* Proporción Ingresos vs Egresos */}
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-xl text-foreground mb-4">Distribución del Flujo</h3>
          {!loading && proporcionActual && (
            <PieChart
              height={300}
              series={[
                {
                  data: [
                    { id: 0, value: proporcionActual.ingresos, label: 'Ingresos', color: '#10b981' },
                    { id: 1, value: proporcionActual.egresos, label: 'Egresos', color: '#ef4444' }
                  ]
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
    </TabsContent>
  );
};