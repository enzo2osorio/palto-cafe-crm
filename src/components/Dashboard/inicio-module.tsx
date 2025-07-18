import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/card';
import { kpiData } from '@/utils/inicio-blank';
import { topFiveSoldProducts as topProducts } from '@/lib/topFiveSoldProducts';

export function InicioModule() {

  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="font-ui text-lg text-muted-foreground tracking-wide">Inicio</p>
        <h1 className="font-display text-5xl text-foreground">
          HOLA, <span className="text-primary">NICOLÁS</span>
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="card-warm p-6 border-0">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`} />
                <div className={`px-3 py-1 rounded-full text-sm font-ui ${
                  kpi.trend === 'up' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                  {kpi.change.match(/[+-]\d+%/)?.[0]}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display text-3xl text-foreground">{kpi.value}</h3>
                <div className="space-y-1">
                  <h4 className="font-ui font-semibold text-foreground">{kpi.title}</h4>
                  <p className="font-ui text-sm text-muted-foreground">{kpi.change}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de ventas diarias */}
        <Card className="card-warm p-6 border-0">
          <div className="space-y-6">
            <h3 className="font-body text-2xl text-center text-foreground">
              Ventas diarias de todos los productos
            </h3>
            
            <div className="flex items-end justify-center space-x-4 h-64">
              {/* Etiquetas del eje Y */}
              <div className="flex flex-col justify-between h-full text-right text-muted-foreground font-ui py-2">
                <span>$50 000</span>
                <span>$40 000</span>
                <span>$30 000</span>
                <span>$20 000</span>
                <span>$10 000</span>
                <span>$0</span>
              </div>
              
              {/* Gráfico usando la imagen importada */}
              <div className="flex-1 h-full relative">
                <img
                  className="w-full h-full bg-contain bg-center bg-no-repeat"
                  src='/images/grafico-inicio-sample.png'
                />
              </div>
            </div>
            
            {/* Etiquetas del eje X */}
            <div className="flex justify-between text-muted-foreground font-ui px-12">
              {/* TODO: arreglar esto de las fechas para que se coloquen dinamicamente segun el numero de barras que colocare, creo que es mejor solo 7 para mostrar de domingo a domingo. */}
              {['Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab', 'Dom', 'Lun', 'Mar', 'Mier'].map((day, index) => (
                <span key={index}>{day}</span>
              ))}
            </div>
          </div>
        </Card>

        {/* Top productos ABC */}
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
                {topProducts.map((product, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-3">
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
      </div>

      {/* Gráficos circulares de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { value: "80%", title: "% de ventas diarias para seguir con la meta diaria:" },
          { value: "74%", title: "% de ventas diarias para seguir con la meta diaria:" }
        ].map((metric, index) => (
          <Card key={index} className="card-warm p-8 border-0">
            <div className="flex flex-col items-center space-y-6">
              {/* Gráfico circular */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(parseInt(metric.value) / 100) * 502} 502`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-4xl text-foreground">{metric.value}</span>
                </div>
              </div>
              
              <p className="font-ui text-center text-foreground max-w-sm">{metric.title}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}