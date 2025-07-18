import { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { products, categories } from '@/utils/productos-blank';
import { topFiveSoldProducts as topProducts } from '@/lib/topFiveSoldProducts';
import { formatCurrency } from '@/lib/formatCurrency';

export function ProductosModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de productos</p>
          <h1 className="font-display text-4xl text-foreground">
            PRODUCTOS
          </h1>
        </div>
        
        <Button className="button-surf text-white font-ui font-medium px-6 py-3 rounded-2xl">
          <Plus className="w-5 h-5 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Top 5 productos más vendidos */}
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
            <div key={product.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
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
                  <span className="font-ui font-semibold text-foreground">{formatCurrency(Number(product.revenue))}</span>
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

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input-background border-0 rounded-2xl font-ui"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-input-background border-0 rounded-2xl px-4 py-2 font-ui font-medium text-foreground"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
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
                  {Number(product.stock) > 0 ? `${product.stock} en stock` : 'Sin stock'}
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
                  <p className="font-ui font-semibold text-foreground">{formatCurrency(Number(product.cost))}</p>
                </div>
                
                <div className="bg-muted rounded-xl p-3">
                  <p className="font-ui text-xs text-muted-foreground mb-1">Vendidos hoy</p>
                  <p className="font-ui font-semibold text-foreground">{product.soldToday}</p>
                </div>
                
                <div className="bg-muted rounded-xl p-3">
                  <p className="font-ui text-xs text-muted-foreground mb-1">Ingresos</p>
                  <p className="font-ui font-semibold text-foreground">{formatCurrency(Number(product.revenue))}</p>
                </div>
              </div>

              {/* Margen de ganancia */}
              <div className="bg-primary/5 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="font-ui text-sm text-foreground">Margen:</span>
                  <span className="font-ui font-semibold text-primary">
                    {Math.round(((product.price - Number(product.cost)) / product.price) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${((product.price - Number(product.cost)) / product.price) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}