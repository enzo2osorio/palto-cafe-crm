import { TabsContent } from "@radix-ui/react-tabs"
import { GastosPorCategoriaa } from "./GastosPorCategoria"
import { gastosPorCategoria } from "@/utils/reportes-blank"
import { Rentabilidad } from "./Rentabilidad"
import { Proyecciones } from "./Proyecciones"

export const FinancieroGeneral = () => {
  return (
    <TabsContent value="financiero" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gastos por categoría */}
           <GastosPorCategoriaa
           gastosPorCategoria={gastosPorCategoria}
           />

            {/* Rentabilidad */}
            <Rentabilidad/>
          </div>

          {/* Proyecciones */}
          <Proyecciones/> 
        </TabsContent>
  )
}
