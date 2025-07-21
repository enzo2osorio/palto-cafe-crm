import { Card } from '@/components/ui/card'
import type { ProductosProps } from '@/types/productos'

interface TopProductosABCProps{
    topProduct: ProductosProps[]
}

export const TopProductosABC = ({ topProduct }: TopProductosABCProps) => {
  return (
    <Card className="card-warm p-6 border-0">
          <div className="space-y-6">
            <h3 className="font-body text-2xl text-center text-foreground">
              Top productos bajo análisis ABC
            </h3>
            
            <div className="space-y-4">
              {/* Header de la tabla */}
              <div className="grid grid-cols-4 gap-4 font-ui font-semibold text-sm text-foreground border-b border-border pb-2">
                <span>Producto</span>
                <span className="text-center">Unidades vendidas</span>
                <span className="text-center">Ingreso generado</span>
                <span className="text-center">Ventas (%)</span>
              </div>
              
              {/* Filas de productos */}
              <div className="space-y-3">
                {topProduct.map((product, index) => (
                  <div key={index} className="bg-white dark:bg-accent rounded-lg shadow-sm p-3">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <span className="font-ui text-sm text-foreground">{product.name}</span>
                      <span className="font-ui text-sm text-foreground text-center">{product.soldToday}</span>
                      <span className="font-ui text-sm text-foreground text-center">{product.revenue}</span>
                      <div className="flex justify-center">
                        <div className="bg-primary/70 backdrop-blur-sm rounded-lg px-3 py-1">
                        {/* TODO: ver si agrego algun porcentaje pues este es parte del analisis ABC */}
                          <span className="font-ui font-medium text-sm text-white">50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
  )
}
