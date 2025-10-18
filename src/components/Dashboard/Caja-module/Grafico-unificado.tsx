import { Card } from '@/components/ui/card';
import { LineChart } from '@mui/x-charts/LineChart';

interface GraficoUnificadoProps {
  data: {
    labels: string[];
    ingresos: number[];
    egresos: number[];
  } | null;
}

const margin = { right: 24, left: 80 };

export function GraficoUnificado({ data }: GraficoUnificadoProps) {
  if (!data) {
    return (
      <Card className="card-warm p-6 border-0">
        <div className="space-y-6">
          <h3 className="font-body text-2xl text-center text-foreground">
            Flujo de Caja - Ingresos y Egresos
          </h3>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
      </Card>
    );
  }

  const series = [
    {
      data: data.ingresos,
      label: 'Ingresos',
      color: '#22c55e', // green-500
    },
    {
      data: data.egresos,
      label: 'Egresos',
      color: '#ef4444', // red-500
    },
  ];

  return (
    <Card className="card-warm p-6 border-0">
      <div className="space-y-6">
        <h3 className="font-body text-2xl text-center text-foreground">
          Flujo de Caja - Ingresos y Egresos
        </h3>
       

        {/* Gráfica */}
        <div className="w-full rounded-2xl pr-10">
          <LineChart 
            height={400}
            series={series}
            xAxis={[{ scaleType: 'point', data: data.labels }]}
            yAxis={[{ 
              width: 80,
              valueFormatter: (value: number | null) => {
                return value !== null ? `S/ ${value.toLocaleString('es-PE')}` : '';
              }
            }]}
            margin={margin}
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
                strokeDasharray: "3 3",
              },
              "& .MuiChartsLegend-row": {
                fontSize: "0.875rem",
              },
              "& .MuiChartsTooltip-root": {
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              },
            }}
            slotProps={{
              legend: {
                direction: 'horizontal',
                position: { vertical: 'top', horizontal: 'center' },

              },
            }}
          />
        </div>
      </div>
    </Card>
  );
}