import { Card } from '@/components/ui/card';
import { getLast6Months } from '@/utils/registros/registrosMensuales/getLast6Months';
import { LineChart } from '@mui/x-charts';
import type { GraficoVentasMensualesProps } from './Grafico-egresos-mensuales';

const margin = { right: 24 };

export const GraficoIngresosMensuales = ({ data }: GraficoVentasMensualesProps) => {
 const xLabels : string[] = getLast6Months();

  return (
    <Card className="card-warm p-6 border-0">
          <div className="space-y-6">
            <h3 className="font-body text-2xl text-center text-foreground">
              Ingresos mensuales de cada dueño
            </h3>
            <div className="w-full e rounded-2xl pr-10">
              <LineChart
                
                height={300}
                series={(data ?? []).map((owner) => ({
                  data: owner.monthlyIngresos,
                  label: owner.owner,
                }))}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                yAxis={[{ width: 50 }]}
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
            </div>
          </div>
        </Card>
  )
}
