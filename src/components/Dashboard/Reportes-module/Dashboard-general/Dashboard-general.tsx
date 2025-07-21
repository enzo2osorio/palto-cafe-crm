import type { MetricasComparativasProps, VentasDiariasProps, VentasPorCategoriaProps } from "@/types/reportes";
import { TabsContent } from "@radix-ui/react-tabs";
import { GraficosPrincipales } from "./Graficos-principales";
import { MetricasComparativass } from "./Metricas-comparativas";

interface DashboardGeneralProps {
    metricsComparativas :MetricasComparativasProps[]
    ventasPorCategoria : VentasPorCategoriaProps[]
    ventasPorDia : VentasDiariasProps[]
}

export const DashboardGeneral = ({metricsComparativas, ventasPorCategoria, ventasPorDia} : DashboardGeneralProps) => {
  return (
    <TabsContent value="dashboard" className="space-y-6">
          {/* Métricas comparativas */}
          <MetricasComparativass
          metricsComparativas={metricsComparativas}
          />

          {/* Gráficos principales */}
          <GraficosPrincipales
          ventasPorCategoria={ventasPorCategoria}
          ventasPorDia={ventasPorDia}
          />
        </TabsContent>

  )
}
