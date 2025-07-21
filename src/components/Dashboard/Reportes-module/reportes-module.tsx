import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ventasPorDia, ventasPorCategoria, gastosPorCategoria,metricsComparativas, topProductos } from '@/utils/reportes-blank';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatNumber } from '@/lib/formatNumber';
import { ButtonsControlReportes } from './ButtonsControlReportes';

export function ReportesModule() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('semana');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Análisis y reportes</p>
          <h1 className="font-display text-4xl text-foreground">
            REPORTES & <span className="text-primary">ANALÍTICAS</span>
          </h1>
        </div>
        <ButtonsControlReportes
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted rounded-2xl p-1">
          <TabsTrigger 
            value="dashboard" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Dashboard General
          </TabsTrigger>
          <TabsTrigger 
            value="ventas" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Análisis de Ventas
          </TabsTrigger>
          <TabsTrigger 
            value="productos" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Productos
          </TabsTrigger>
          <TabsTrigger 
            value="financiero" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Análisis Financiero
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Métricas comparativas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metricsComparativas.map((metric, index) => (
              <Card key={index} className="card-warm p-6 border-0">
                <div className="flex items-center justify-between mb-4">
                  {metric.trending === 'up' ? (
                    <TrendingUp className="w-6 h-6 text-success" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-destructive" />
                  )}
                  <Badge className={`${
                    metric.trending === 'up' 
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  } font-ui text-xs`}>
                    {metric.trending === 'up' ? '+' : ''}{metric.cambio}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display text-2xl text-foreground">
                    {metric.titulo.includes('Ventas') || metric.titulo.includes('Ticket') 
                      ? formatCurrency(metric.actual)
                      : metric.titulo.includes('Margen')
                      ? `${metric.actual}%`
                      : formatNumber(metric.actual)
                    }
                  </h3>
                  <p className="font-ui font-semibold text-foreground">{metric.titulo}</p>
                  <p className="font-ui text-sm text-muted-foreground">
                    vs. período anterior: {
                      metric.titulo.includes('Ventas') || metric.titulo.includes('Ticket') 
                        ? formatCurrency(metric.anterior)
                        : metric.titulo.includes('Margen')
                        ? `${metric.anterior}%`
                        : formatNumber(metric.anterior)
                    }
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ventas diarias */}
            <Card className="card-warm p-6 border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-body text-xl text-foreground">Ventas Diarias</h3>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                <div className="h-64 flex items-end justify-between space-x-2">
                  {ventasPorDia.map((dia, index) => {
                    const maxVentas = Math.max(...ventasPorDia.map(d => parseFloat(d.ventas)));
                    const height = (parseFloat(dia.ventas) / maxVentas) * 100;
                    
                    return (
                      <div key={index} className="flex-1 space-y-2">
                        <div className="flex flex-col items-center h-48">
                          <div className="flex-1 flex items-end">
                            <div 
                              className="bg-gradient-to-t from-primary to-primary-light rounded-t-lg w-full transition-all hover:opacity-80 cursor-pointer"
                              style={{ height: `${height}%` }}
                              title={`${dia.dia}: ${formatCurrency(dia.ventas)}`}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-ui text-sm text-foreground">{dia.dia}</p>
                          <p className="font-ui text-xs text-muted-foreground">{dia.ordenes} órdenes</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between text-muted-foreground font-ui text-sm">
                  <span>0</span>
                  <span>{formatCurrency(Math.max(...ventasPorDia.map(d => parseFloat(d.ventas))).toString())}</span>
                </div>
              </div>
            </Card>

            {/* Distribución por categorías */}
            <Card className="card-warm p-6 border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-body text-xl text-foreground">Ventas por Categoría</h3>
                <PieChart className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                {ventasPorCategoria.map((categoria, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-ui text-sm text-foreground">{categoria.categoria}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-ui font-semibold text-foreground">{formatCurrency(categoria.ventas)}</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {categoria.porcentaje}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-light rounded-full h-3 transition-all"
                        style={{ width: `${categoria.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ventas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Embudo de ventas */}
            <Card className="card-warm p-6 border-0 lg:col-span-2">
              <h3 className="font-body text-xl text-foreground mb-6">Embudo de Conversión</h3>
              
              <div className="space-y-4">
                {[
                  { etapa: 'Visitantes', cantidad: "1250", porcentaje: 100, color: 'bg-blue-500' },
                  { etapa: 'Interesados', cantidad: "890", porcentaje: 71, color: 'bg-green-500' },
                  { etapa: 'Compradores', cantidad: "742", porcentaje: 59, color: 'bg-primary' },
                  { etapa: 'Recurrentes', cantidad: "456", porcentaje: 36, color: 'bg-purple-500' }
                ].map((etapa, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-ui font-medium text-foreground">{etapa.etapa}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-ui font-semibold text-foreground">{formatNumber(etapa.cantidad)}</span>
                        <Badge className="bg-muted text-muted-foreground text-xs">
                          {etapa.porcentaje}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-muted rounded-full h-8">
                        <div 
                          className={`${etapa.color} rounded-full h-8 flex items-center justify-center transition-all`}
                          style={{ width: `${etapa.porcentaje}%` }}
                        >
                          <span className="text-white font-ui text-sm font-medium">{etapa.porcentaje}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Métricas de ventas */}
            <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Métricas Clave</h3>
              
              <div className="space-y-6">
                <div className="text-center p-4 bg-primary/5 rounded-xl">
                  <p className="font-display text-3xl text-primary">{formatCurrency("5676")}</p>
                  <p className="font-ui text-sm text-muted-foreground">Ticket Promedio</p>
                </div>
                
                <div className="text-center p-4 bg-success/5 rounded-xl">
                  <p className="font-display text-3xl text-success">18.5</p>
                  <p className="font-ui text-sm text-muted-foreground">Órdenes por Día</p>
                </div>
                
                <div className="text-center p-4 bg-warning/5 rounded-xl">
                  <p className="font-display text-3xl text-warning">67%</p>
                  <p className="font-ui text-sm text-muted-foreground">Tasa de Conversión</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tendencia de ventas por hora */}
          <Card className="card-warm p-6 border-0">
            <h3 className="font-body text-xl text-foreground mb-6">Ventas por Hora del Día</h3>
            
            <div className="h-48 flex items-end justify-between space-x-1">
              {Array.from({ length: 24 }, (_, i) => {
                const hora = i;
                const ventas = Math.random() * 50000 + 10000; // Datos simulados
                const maxVentas = 60000;
                const height = (ventas / maxVentas) * 100;
                
                return (
                  <div key={i} className="flex-1 space-y-1">
                    <div className="flex flex-col items-center h-40">
                      <div className="flex-1 flex items-end">
                        <div 
                          className="bg-gradient-to-t from-accent to-accent/60 rounded-t w-full transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                          title={`${hora}:00 - ${formatCurrency(ventas.toString())}`}
                        />
                      </div>
                    </div>
                    <p className="text-center font-ui text-xs text-muted-foreground">
                      {hora.toString().padStart(2, '0')}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="productos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top productos */}
            <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Top Productos por Ventas</h3>
              
              <div className="space-y-4">
                {topProductos.map((producto, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-ui font-semibold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-ui font-medium text-foreground">{producto.producto}</p>
                        <p className="font-ui text-sm text-muted-foreground">{producto.unidades} unidades</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-ui font-semibold text-foreground">{formatCurrency(producto.ventas)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Análisis ABC */}
            <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Análisis ABC de Productos</h3>
              
              <div className="space-y-6">
                <div className="bg-success/10 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-success mb-2">Categoría A (Alto valor)</h4>
                  <p className="font-ui text-sm text-muted-foreground mb-3">20% de productos, 80% de ingresos</p>
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">12 productos</span>
                    <Badge className="bg-success text-white">80%</Badge>
                  </div>
                </div>
                
                <div className="bg-warning/10 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-warning mb-2">Categoría B (Valor medio)</h4>
                  <p className="font-ui text-sm text-muted-foreground mb-3">30% de productos, 15% de ingresos</p>
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">18 productos</span>
                    <Badge className="bg-warning text-white">15%</Badge>
                  </div>
                </div>
                
                <div className="bg-destructive/10 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-destructive mb-2">Categoría C (Bajo valor)</h4>
                  <p className="font-ui text-sm text-muted-foreground mb-3">50% de productos, 5% de ingresos</p>
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">30 productos</span>
                    <Badge className="bg-destructive text-white">5%</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financiero" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gastos por categoría */}
            <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Distribución de Gastos</h3>
              
              <div className="space-y-4">
                {gastosPorCategoria.map((gasto, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-ui text-sm text-foreground">{gasto.categoria}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-ui font-semibold text-foreground">{formatCurrency(gasto.monto)}</span>
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                          {gasto.porcentaje}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-destructive to-destructive/60 rounded-full h-3 transition-all"
                        style={{ width: `${gasto.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Rentabilidad */}
            <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-xl text-foreground mb-6">Análisis de Rentabilidad</h3>
              
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-4 text-center">
                  <p className="font-display text-4xl text-primary">42.5%</p>
                  <p className="font-ui text-sm text-muted-foreground">Margen Bruto</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-ui text-sm text-foreground">Ingresos Totales</span>
                    <span className="font-ui font-semibold text-success">{formatCurrency("4210000")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-ui text-sm text-foreground">Gastos Totales</span>
                    <span className="font-ui font-semibold text-destructive">{formatCurrency("2410000")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <span className="font-ui font-semibold text-foreground">Utilidad Neta</span>
                    <span className="font-ui font-bold text-primary">{formatCurrency("1800000")}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Proyecciones */}
          <Card className="card-warm p-6 border-0">
            <h3 className="font-body text-xl text-foreground mb-6">Proyecciones y Tendencias</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                <h4 className="font-ui font-semibold text-foreground mb-2">Próximo Mes</h4>
                <p className="font-display text-2xl text-primary">{formatCurrency("4650000")}</p>
                <p className="font-ui text-sm text-muted-foreground">Ventas proyectadas</p>
                <Badge className="bg-success/10 text-success border-success/20 mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +10.4%
                </Badge>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-xl">
                <h4 className="font-ui font-semibold text-foreground mb-2">Próximo Trimestre</h4>
                <p className="font-display text-2xl text-success">{formatCurrency("14200000")}</p>
                <p className="font-ui text-sm text-muted-foreground">Ingresos estimados</p>
                <Badge className="bg-success/10 text-success border-success/20 mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.8%
                </Badge>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl">
                <h4 className="font-ui font-semibold text-foreground mb-2">ROI Proyectado</h4>
                <p className="font-display text-2xl text-warning">185%</p>
                <p className="font-ui text-sm text-muted-foreground">Retorno de inversión</p>
                <Badge className="bg-warning/10 text-warning border-warning/20 mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2%
                </Badge>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}