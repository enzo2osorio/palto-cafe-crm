import { Card } from "@/components/ui/card"
import { LineChart } from '@mui/x-charts/LineChart';
// import { getLast6Months } from "@/utils/date/getLast6Months";
// import type { GraphicProps } from "../Inicio-module/inicio-module";
import type { MovimientosSemanales } from "@/types/movimientosSemanales";

const margin = { right: 24 };

interface GraficoIngresosSemanalesProps {
  data: MovimientosSemanales | undefined;
}

export const GraficoIngresosSemanales = ({ data }: GraficoIngresosSemanalesProps) => {
  
    if(!data){
      return null;
    }

    const singleSeries = [
    {
      data: data.buckets ?? [],
      label: "Ingresos"
    }
  ];

    return (
    <Card className="card-warm p-6 border-0">
          <div className="space-y-6">
            <h3 className="font-body text-2xl text-center text-foreground">
              Ingresos semanales totales
            </h3>
            <div className="w-full e rounded-2xl pr-10">
              <LineChart 
                height={300}
                series={singleSeries}
                xAxis={[{ scaleType: 'point', data: data?.labels }]}
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
