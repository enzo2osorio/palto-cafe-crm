import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getDistribucionGastos, getSubcategoriasDeCategoria, type DistribucionGastos, type SubcategoriaGasto } from '@/utils/reportes/getDistribucionGastos';
import { formatCurrency } from '@/lib/formatCurrency';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DateRangeSelector, type DateRangeType } from '@/components/Reusable/DateRangeSelector';
import { getSinglePeriodRange } from '@/utils/date/getDateRangeByType';

interface DistribucionGastosProps {
  // Props futuras si se necesitan
}

export const DistribucionGastosComponent = ({}: DistribucionGastosProps = {}) => {
  const [loading, setLoading] = useState(true);
  const [gastos, setGastos] = useState<DistribucionGastos[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [subcategorias, setSubcategorias] = useState<SubcategoriaGasto[]>([]);
  const [loadingSubcategorias, setLoadingSubcategorias] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>('mensual');

  useEffect(() => {
    const fetchGastos = async () => {
      setLoading(true);
      try {
        const gastosData = await getDistribucionGastos(selectedDateRange);
        setGastos(gastosData);
      } catch (error) {
        console.error('Error fetching gastos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [selectedDateRange]);

  const handleCategoryClick = async (e: React.MouseEvent, categoria: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (expandedCategory === categoria) {
      setExpandedCategory(null);
      setSubcategorias([]);
      return;
    }

    setLoadingSubcategorias(true);
    setExpandedCategory(categoria);
    
    try {
      const subcategoriasData = await getSubcategoriasDeCategoria(categoria, selectedDateRange);
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
    return icons[categoria.toLowerCase()] || '📊';
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

  const getPeriodLabel = (dateRange: DateRangeType) => {
    // Usar la función de utilidad para obtener etiquetas más descriptivas
    const { label } = getSinglePeriodRange(dateRange);
    return label;
  };

  if (loading) {
    return (
      <Card className="card-warm p-6 border-0">
        <h3 className="font-body text-xl text-foreground mb-6">Distribución de Gastos</h3>
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-body text-xl text-foreground">Distribución de Gastos</h3>
        <DateRangeSelector 
          value={selectedDateRange}
          onValueChange={setSelectedDateRange}
          label="Período"
        />
      </div>
      
      <div className="space-y-4">
        {gastos.map((gasto, index) => (
          <div key={gasto.categoria}>
            {/* Categoría Principal */}
            <div
              className="w-full cursor-pointer hover:bg-muted/20 transition-colors rounded-lg"
              onClick={(e) => handleCategoryClick(e, gasto.categoria)}
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
            </div>

            {/* Subcategorías Expandidas */}
            {expandedCategory === gasto.categoria && (
              <div className="ml-12 mt-2 space-y-2">
                {loadingSubcategorias ? (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground/50 mb-2 px-2 animate-pulse">
                      Cargando subcategorías...
                    </div>
                    {/* Skeleton de 2 subcategorías */}
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/10 border border-muted/20 animate-pulse">
                        {/* Nombre de subcategoría */}
                        <div className="w-40 h-4 bg-muted/40 rounded"></div>
                        
                        {/* Barra de progreso */}
                        <div className="flex-1">
                          <div className="w-full bg-muted/30 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-muted/50 w-3/4"></div>
                          </div>
                        </div>
                        
                        {/* Información de montos */}
                        <div className="text-right min-w-[100px] space-y-1">
                          <div className="w-20 h-3 bg-muted/40 rounded ml-auto"></div>
                          <div className="w-16 h-2 bg-muted/30 rounded ml-auto"></div>
                          <div className="w-14 h-2 bg-muted/25 rounded ml-auto"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : subcategorias.length > 0 ? (
                  <>
                    <div className="text-xs text-muted-foreground mb-2 px-2">
                      Desglose de subcategorías para {gasto.categoria} ({getPeriodLabel(selectedDateRange)}):
                    </div>
                    {subcategorias.map((sub, subIndex) => (
                      <div key={subIndex} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/10 border border-muted/20">
                        <span className="font-ui text-sm text-foreground w-40 truncate">
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
                        <div className="text-right min-w-[100px]">
                          <span className="font-ui text-xs font-semibold text-foreground block">
                            {formatCurrency(sub.totalGasto.toString())}
                          </span>
                          <div className="font-ui text-xs text-muted-foreground">
                            {sub.porcentajeDeLaCategoria.toFixed(1)}% de {gasto.categoria}
                          </div>
                          <div className="font-ui text-xs text-muted-foreground/70">
                            {sub.porcentajeDelTotal.toFixed(1)}% del total
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground px-2 py-3 text-center bg-muted/5 rounded-lg">
                    No hay subcategorías disponibles para {gasto.categoria} en {getPeriodLabel(selectedDateRange)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Información adicional */}
      {gastos.length === 0 && !loading && (
        <div className="text-center text-muted-foreground py-8">
          No se encontraron gastos para {getPeriodLabel(selectedDateRange)}
        </div>
      )}
    </Card>
  );
};