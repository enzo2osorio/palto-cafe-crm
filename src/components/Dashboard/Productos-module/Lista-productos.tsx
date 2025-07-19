import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import type { ProductosProps } from '@/types/productos'
import { Badge } from 'lucide-react'

interface ListadoProductosProps {
  filteredProducts:ProductosProps[]
}

export const ListadoProductos = ({ filteredProducts }: ListadoProductosProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="card-warm border-0 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6 space-y-4">
              {/* Header del producto */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{product.imageUrl}</span>
                  <div>
                    <h4 className="font-ui font-semibold text-foreground">{product.name}</h4>
                    <p className="font-ui text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                
                <Badge className={`${
                  Number(product.stock) > 10 
                    ? 'bg-success/10 text-success border-success/20' 
                    : Number(product.stock) > 0
                    ? 'bg-warning/10 text-warning border-warning/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                } font-ui text-xs`}>
                  {parseFloat(product.stock) > 0 ? `${product.stock} en stock` : 'Sin stock'}
                </Badge>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-xl p-3">
                  <p className="font-ui text-xs text-muted-foreground mb-1">Precio</p>
                  <p className="font-ui font-semibold text-foreground">{formatCurrency(product.price)}</p>
                </div>
                
                <div className="bg-muted rounded-xl p-3">
                  <p className="font-ui text-xs text-muted-foreground mb-1">Costo</p>
                  <p className="font-ui font-semibold text-foreground">{formatCurrency(product.cost)}</p>
                </div>
                
                <div className="bg-muted rounded-xl p-3">
                  <p className="font-ui text-xs text-muted-foreground mb-1">Vendidos hoy</p>
                  <p className="font-ui font-semibold text-foreground">{product.soldToday}</p>
                </div>
                
                <div className="bg-muted rounded-xl p-3">
                  <p className="font-ui text-xs text-muted-foreground mb-1">Ingresos</p>
                  <p className="font-ui font-semibold text-foreground">{formatCurrency(product.revenue)}</p>
                </div>
              </div>

              {/* Margen de ganancia */}
              <div className="bg-primary/5 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="font-ui text-sm text-foreground">Margen:</span>
                  <span className="font-ui font-semibold text-primary">
                    {Math.round(((parseFloat(product.price) - Number(product.cost)) / parseFloat(product.price)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${((parseFloat(product.price) - Number(product.cost)) / parseFloat(product.price)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
  )
}
