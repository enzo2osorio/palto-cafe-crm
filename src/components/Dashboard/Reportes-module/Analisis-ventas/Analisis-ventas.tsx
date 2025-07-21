
import { TabsContent } from "@radix-ui/react-tabs";
import { EmbudoDeVentas } from "./Embudo-de-ventas";
import { MetricasDeVentas } from "./Metricas-de-ventas";
import { Tendencia } from "./Tendencia-ventas-por-hora";

export const AnalisisVentas = () => {
  return (
    <TabsContent value="ventas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Embudo de ventas */}
            <EmbudoDeVentas/>

            {/* Métricas de ventas */}
            <MetricasDeVentas/>
          </div>

          {/* Tendencia de ventas por hora */}
          <Tendencia/>
        </TabsContent>
  )
}
