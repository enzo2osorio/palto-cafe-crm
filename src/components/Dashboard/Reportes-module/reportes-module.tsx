import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ventasPorDia, ventasPorCategoria, gastosPorCategoria,metricsComparativas, topProductos } from '@/utils/reportes-blank';
import { formatCurrency } from '@/lib/formatCurrency';
import { ButtonsControlReportes } from './ButtonsControlReportes';
import { DashboardGeneral } from './Dashboard-general/Dashboard-general';
import { AnalisisVentas } from './Analisis-ventas/Analisis-ventas';
import { ProductosGeneral } from './Productos/Productos-general';
import { FinancieroGeneral } from './Analisis-financiero/Financiero-general';

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

        {/* tab dashboard general */}
        <DashboardGeneral
        metricsComparativas={metricsComparativas}
        ventasPorCategoria={ventasPorCategoria}
        ventasPorDia={ventasPorDia}
        />

        {/* tab analisis ventas */}
        <AnalisisVentas/>

        <ProductosGeneral
        topProductos={topProductos}
        />

        <FinancieroGeneral/>
      </Tabs>
    </div>
  );
}