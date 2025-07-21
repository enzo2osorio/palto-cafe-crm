import type { TopProductosProps } from "@/types/reportes"
import { TabsContent } from "@radix-ui/react-tabs"
import { AnalisisABCForReportes } from "./Analisis-abc"
import { TopProductoss } from "./TopProductos"

interface ProductosGeneralProps{
    topProductos : TopProductosProps[]
}

export const ProductosGeneral = ({topProductos} : ProductosGeneralProps) => {
  return (
        <TabsContent value="productos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top productos */}
            <TopProductoss
            topProductos={topProductos}
            />

            {/* Análisis ABC */}
            <AnalisisABCForReportes/>
          </div>
        </TabsContent>
  )
}
