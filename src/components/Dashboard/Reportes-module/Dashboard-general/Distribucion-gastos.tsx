import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDistribucionGastos, getSubcategoriasDeCategoria, type DistribucionGastos, type SubcategoriaGasto } from '@/utils/reportes/getDistribucionGastos';
import { formatCurrency } from '@/lib/formatCurrency';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DistribucionGastosProps {
  mesesAtras?: number;
}

export const DistribucionGastosComponent = ({ mesesAtras = 3 }: DistribucionGastosProps) => {
  const [loading, setLoading] = useState(true);
  const [gastos, setGastos] = useState<DistribucionGastos[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [subcategorias, setSubcategorias] = useState<SubcategoriaGasto[]>([]);
  const [loadingSubcategorias, setLoadingSubcategorias] = useState(false);

  useEffect(() => {
    const fetchGastos = async () => {
      setLoading(true);
      try {
        const gastosData = await getDistribucionGastos(mesesAtras);
        setGastos(gastosData);
      } catch (error) {
        console.error('Error fetching gastos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [mesesAtras]);

  const handleCategoryClick = async (categoria: string) => {
    if (expandedCategory === categoria) {
      setExpandedCategory(null);
      setSubcategorias([]);
      return;
    }

    setLoadingSubcategorias(true);
    setExpandedCategory(categoria);
    
    try {
      const subcategoriasData = await getSubcategoriasDeCategoria(categoria, mesesAtras);
      setSubcategorias(subcategoriasData);
    } catch (error) {
      console.error('Error fetching subcategorias:', error);
    } finally {
      setLoadingSubcategorias(false);
    }
  };

  const getCategoryIcon = (categoria: string) => {
    const icons: { [key: string]: string } = {
      'proveedores': '🏪',
      'empleados': '👥',
      'servicios': '⚙️',
      'colaboradores': '🤝',
      'otros': '📦'
    };
    return icons[categoria] || '📊';
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500', 
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Card className="card-warm p-6 border-0">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-4 bg-muted/70 rounded"></div>
              <div className="flex-1 h-4 bg-muted/70 rounded"></div>
              <div className="w-20 h-4 bg-muted/70 rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-warm p-6 border-0">
      <h3 className="font-body text-xl text-foreground mb-6">Distribución de Gastos</h3>
      
      <div className="space-y-4">
        {gastos.map((gasto, index) => (
          <div key={gasto.categoria}>
            {/* Categoría Principal */}
            <Button
              variant="ghost" 
              className="w-full p-0 h-auto hover:bg-muted/20"
              onClick={() => handleCategoryClick(gasto.categoria)}
            >
              <div className="flex items-center w-full p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-lg">{getCategoryIcon(gasto.categoria)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-ui font-semibold text-foreground capitalize">
                        {gasto.categoria}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-ui text-sm text-muted-foreground">
                          {gasto.porcentaje.toFixed(1)}%
                        </span>
                        <span className="font-ui font-semibold text-foreground">
                          {formatCurrency(gasto.totalGasto.toString())}
                        </span>
                        {expandedCategory === gasto.categoria ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCategoryColor(index)}`}
                        style={{ width: `${gasto.porcentaje}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Button>

            {/* Subcategorías Expandidas */}
            {expandedCategory === gasto.categoria && (
              <div className="ml-12 mt-2 space-y-2">
                {loadingSubcategorias ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-2">
                        <div className="w-32 h-3 bg-muted/50 rounded"></div>
                        <div className="flex-1 h-2 bg-muted/50 rounded"></div>
                        <div className="w-16 h-3 bg-muted/50 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  subcategorias.map((sub, subIndex) => (
                    <div key={subIndex} className="flex items-center space-x-4 p-2 rounded-lg bg-muted/10">
                      <span className="font-ui text-sm text-foreground w-32 truncate">
                        {sub.subcategoria}
                      </span>
                      <div className="flex-1">
                        <div className="w-full bg-muted/30 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full bg-primary/70"
                            style={{ width: `${sub.porcentajeDeLaCategoria}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-ui text-xs font-semibold text-foreground">
                          {formatCurrency(sub.totalGasto.toString())}
                        </span>
                        <div className="font-ui text-xs text-muted-foreground">
                          {sub.porcentajeDeLaCategoria.toFixed(1)}% de {gasto.categoria}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};