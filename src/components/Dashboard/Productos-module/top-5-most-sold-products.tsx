import { Card } from '@/components/ui/card'
import { topFiveSoldProducts as topProducts } from '@/lib/topFiveSoldProducts';
import { Badge, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';

export const TopProductosMasVendidos = () => {
  return (
    <Card className="card-warm p-6 border-0">
        <h3 className="font-body text-2xl text-foreground mb-6">Top 5 productos más vendidos (Análisis ABC)</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 font-ui font-semibold text-sm text-muted-foreground border-b border-border pb-2">
            <span>Producto</span>
            <span className="text-center">Vendidos hoy</span>
            <span className="text-center">Precio</span>
            <span className="text-center">Ingresos</span>
            <span className="text-center">Tendencia</span>
          </div>
          
          {topProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-accent rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{product.imageUrl}</span>
                  <div>
                    <p className="font-ui font-medium text-foreground">{product.name}</p>
                    <p className="font-ui text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <span className="font-ui font-semibold text-foreground">{product.soldToday}</span>
                  <p className="font-ui text-xs text-muted-foreground">unidades</p>
                </div>
                
                <div className="text-center">
                  <span className="font-ui font-medium text-foreground">{formatCurrency(product.price)}</span>
                </div>
                
                <div className="text-center">
                  <span className="font-ui font-semibold text-foreground">{formatCurrency(product.revenue)}</span>
                </div>
                
                <div className="flex justify-center">
                  <Badge className={`${
                    product.trend === 'up' 
                      ? 'bg-success/10 text-success border-success/20' 
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  } font-ui`}>
                    {product.trend === 'up' 
                      ? <TrendingUp className="w-3 h-3 mr-1" />
                      : <TrendingDown className="w-3 h-3 mr-1" />
                    }
                    {product.trendValue}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
  )
}
