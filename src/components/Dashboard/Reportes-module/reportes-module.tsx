import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ventasPorDia, ventasPorCategoria, metricsComparativas, topProductos } from '@/utils/reportes-blank';

import { ButtonsControlReportes } from './ButtonsControlReportes';
import { DashboardGeneral } from './Dashboard-general/Dashboard-general';
import { AnalisisVentas } from './Analisis-ventas/Analisis-ventas';
import { ProductosGeneral } from './Productos/Productos-general';
import { FinancieroGeneral } from './Analisis-financiero/Financiero-general';
import { RentabilidadFlujo } from './Rentabilidad-flujo/Rentabilidad-flujo';
import { ProyeccionesGeneral } from './Proyecciones/Proyecciones-general';

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
            value="rentabilidad" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Rentabilidad & Flujo
          </TabsTrigger>
          <TabsTrigger 
            value="proyecciones" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Proyecciones
          </TabsTrigger>
          <TabsTrigger 
            value="ventas" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Análisis de Ventas
          </TabsTrigger>
        </TabsList>

        {/* Dashboard General */}
        <DashboardGeneral
          // metricsComparativas={metricsComparativas}
          // ventasPorCategoria={ventasPorCategoria}
          // ventasPorDia={ventasPorDia}
        />

        {/* Rentabilidad & Flujo */}
        <RentabilidadFlujo selectedPeriod={selectedPeriod} />

        {/* Proyecciones */}
        <ProyeccionesGeneral selectedPeriod={selectedPeriod} />

        {/* Análisis de Ventas */}
        <AnalisisVentas />

        {/* Productos */}
        <ProductosGeneral topProductos={topProductos} />

        {/* Financiero */}
        <FinancieroGeneral />
      </Tabs>
    </div>
  );
}