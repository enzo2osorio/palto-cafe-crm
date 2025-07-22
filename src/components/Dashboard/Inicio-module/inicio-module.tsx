import { kpiData } from '@/utils/inicio-blank';
import { topFiveSoldProducts as topProducts } from '@/lib/topFiveSoldProducts';
import { KPISCardsForInicio } from './KPISCardsForInicio';
import { GraficoVentasDiarias } from './Grafico-ventas-diarias';
import { TopProductosABC } from './Top-productos-abc';
import { GraficosCirculares } from './Graficos-circulares';
import { useEffect, useState } from 'react';
import type { User } from '@/types/authSupabase';
import { fetchingAuthUser } from '@/lib/fetchUser';
import { InicioSkeleton } from '../Skeletons/InicioSkeleton';


export function InicioModule() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchingAuthUser({ setUser, setLoading });
  }, [])

  if(loading){
    return <InicioSkeleton/>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="font-ui text-lg text-muted-foreground tracking-wide">Inicio</p>
        <h1 className="font-display text-5xl text-foreground">
          HOLA, <span className="text-primary">{user?.nombre}</span>
        </h1>
      </div>

      {/* KPI Cards */}
      <KPISCardsForInicio
      kpiData={kpiData}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de ventas diarias */}
        <GraficoVentasDiarias/>

        {/* Top productos ABC */}
        <TopProductosABC
          topProduct={topProducts}
        /> 
      </div>

      {/* Gráficos circulares de métricas */}
      <GraficosCirculares />
    </div>
  );
}