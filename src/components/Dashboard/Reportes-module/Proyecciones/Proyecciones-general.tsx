import { useEffect, useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LineChart } from '@mui/x-charts';
import { getProyeccionLinealIngresos, getCashRunway, type ProyeccionLineal } from '@/utils/reportes/getProyeccionesMetrics';
import { formatCurrency } from '@/lib/formatCurrency';
import { AlertTriangle, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface ProyeccionesGeneralProps {
  selectedPeriod: string;
}

export const ProyeccionesGeneral = ({ selectedPeriod }: ProyeccionesGeneralProps) => {
  const [loading, setLoading] = useState(true);
  const [proyecciones, setProyecciones] = useState<ProyeccionLineal[]>([]);
  const [cashRunway, setCashRunway] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [proyeccionesData, runwayData] = await Promise.all([
          getProyeccionLinealIngresos(6, 3),
          getCashRunway()
        ]);
        
        setProyecciones(proyeccionesData);
        setCashRunway(runwayData);
      } catch (error) {
        console.error('Error fetching proyecciones data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const proyeccionesFuturas = proyecciones.filter(p => p.proyectado);
  const promedioMargenProyectado = proyeccionesFuturas.length > 0 
    ? proyeccionesFuturas.reduce((sum, p) => sum + p.margenNeto, 0) / proyeccionesFuturas.length 
    : 0;

  return (
    <TabsContent value="proyecciones" className="space-y-6">
      {/* Cards de Proyección */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Margen Proyectado</p>
              <p className="font-display text-2xl  text-foreground mt-1">
                {formatCurrency(promedioMargenProyectado.toString())}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Promedio próximos 3 meses
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Cash Runway</p>
              <p className="font-display text-2xl  text-foreground mt-1">
                {cashRunway?.mesesDeOperacion || 0} meses
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Con el ritmo actual
              </p>
            </div>
            <div className="p-2 rounded-lg bg-warning/10 dark:bg-warning/20">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Saldo Actual</p>
              <p className="font-display text-2xl text-foreground mt-1">
                {formatCurrency((cashRunway?.saldoActual || 0).toString())}
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                En caja total
              </p>
            </div>
            <div className="p-2 rounded-lg bg-success/10 dark:bg-success/20">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Fecha Límite</p>
              <p className="font-display text-lg text-foreground mt-1">
                {cashRunway?.fechaLimite ? 
                  cashRunway.fechaLimite.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
                  : 'N/A'
                }
              </p>
              <p className="font-ui text-xs text-muted-foreground mt-1">
                Sin nuevos ingresos
              </p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/10 dark:bg-destructive/20">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Proyecciones */}
      <Card className="card-warm p-6 border-0">
        <h3 className="font-body text-xl text-foreground mb-4">
          Proyección de Ingresos y Egresos
        </h3>
        {!loading && proyecciones.length > 0 && (
          <LineChart
            height={400}
            series={[
              {
                data: proyecciones.map(p => p.ingresos),
                label: 'Ingresos',
                color: '#10b981'
              },
              {
                data: proyecciones.map(p => p.egresos),
                label: 'Egresos',
                color: '#ef4444'
              },
              {
                data: proyecciones.map(p => p.margenNeto),
                label: 'Margen Neto',
                color: '#3b82f6'
              }
            ]}
            xAxis={[{ 
              scaleType: 'point', 
              data: proyecciones.map(p => p.mes)
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
            }}
          />
        )}
      </Card>

      {/* Tabla de Proyecciones */}
      <Card className="card-warm p-6 border-0">
        <h3 className="font-body text-xl text-foreground mb-4">Detalle de Proyecciones</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-ui font-semibold text-foreground">Período</th>
                <th className="text-left p-3 font-ui font-semibold text-foreground">Tipo</th>
                <th className="text-right p-3 font-ui font-semibold text-foreground">Ingresos</th>
                <th className="text-right p-3 font-ui font-semibold text-foreground">Egresos</th>
                <th className="text-right p-3 font-ui font-semibold text-foreground">Margen</th>
              </tr>
            </thead>
            <tbody>
              {proyecciones.slice(-6).map((proyeccion, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-ui text-foreground">{proyeccion.mes}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      proyeccion.proyectado 
                        ? 'bg-warning/20 text-warning' 
                        : 'bg-success/20 text-success'
                    }`}>
                      {proyeccion.proyectado ? 'Proyectado' : 'Real'}
                    </span>
                  </td>
                  <td className="p-3 font-ui text-right text-success">
                    {formatCurrency(proyeccion.ingresos.toString())}
                  </td>
                  <td className="p-3 font-ui text-right text-destructive">
                    {formatCurrency(proyeccion.egresos.toString())}
                  </td>
                  <td className={`p-3 font-ui text-right font-semibold ${
                    proyeccion.margenNeto >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {formatCurrency(proyeccion.margenNeto.toString())}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-warm p-6 border-0">
          <div className="text-center">
            <p className="font-ui text-sm text-muted-foreground mb-2">Próximo Mes</p>
            <p className="font-display text-3xl font-bold text-foreground mb-1">
              {proyeccionesFuturas.length > 0 ? 
                formatCurrency(proyeccionesFuturas[0]?.ingresos.toString() || '0') : 
                '$0'
              }
            </p>
            <p className="font-ui text-sm text-muted-foreground mb-3">Ingresos proyectados</p>
            <div className="flex items-center justify-center">
              <span className="text-xs font-semibold text-success px-2 py-1 bg-success/10 rounded-full">
                +10.4%
              </span>
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="text-center">
            <p className="font-ui text-sm text-muted-foreground mb-2">Próximo Trimestre</p>
            <p className="font-display text-3xl font-bold text-foreground mb-1">
              {proyeccionesFuturas.length >= 3 ? 
                formatCurrency(proyeccionesFuturas.slice(0, 3).reduce((sum, p) => sum + p.ingresos, 0).toString()) : 
                '$0'
              }
            </p>
            <p className="font-ui text-sm text-muted-foreground mb-3">Ingresos estimados</p>
            <div className="flex items-center justify-center">
              <span className="text-xs font-semibold text-success px-2 py-1 bg-success/10 rounded-full">
                +12.8%
              </span>
            </div>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="text-center">
            <p className="font-ui text-sm text-muted-foreground mb-2">ROI Proyectado</p>
            <p className="font-display text-3xl font-bold text-foreground mb-1">
              185%
            </p>
            <p className="font-ui text-sm text-muted-foreground mb-3">Retorno de inversión</p>
            <div className="flex items-center justify-center">
              <span className="text-xs font-semibold text-warning px-2 py-1 bg-warning/10 rounded-full">
                +5.2%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </TabsContent>
  );
};