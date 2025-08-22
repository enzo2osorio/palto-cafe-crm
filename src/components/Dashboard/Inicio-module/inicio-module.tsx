import { KPISCardsForInicio } from './KPISCardsForInicio';
import { GraficoEgresosMensuales } from './Grafico-egresos-mensuales';
import { GraficosCirculares } from './Graficos-circulares';
import { useEffect, useState } from 'react';
import type { User } from '@/types/authSupabase';
import { fetchingAuthUser } from '@/lib/fetchUser';
import { InicioSkeleton } from '../Skeletons/InicioSkeleton';
import {  getDailyIngresosToOwners } from '@/utils/registros/getDailyRegistros';
import type { KPISProps } from '@/types/inicio';
import { DollarSign } from 'lucide-react';
import { KPISCardsSkeleton } from '../Skeletons/KpisCardsSkeleton';
import { getMonthlyVentasToOwners } from '@/utils/registros/registrosMensuales/getMonthlyIngresosToOwners';
import { GraficoIngresosMensuales } from './Grafico-ingresos-mensuales';

export interface GraphicProps{
  owner : string;
  monthlyIngresos: number[]
}

export function InicioModule() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [kpisLoading, setKPISLoading] = useState(true);
  const [kpiData, setKPIData] = useState<KPISProps[]>([]);
  const [dataGraphiIngreso, setDataGraphicIngreso] = useState<GraphicProps[]>();
  const [dataGraphiEgreso, setDataGraphicEgreso] = useState<GraphicProps[]>();

  useEffect(() => {
    fetchingAuthUser({ setUser, setLoading });
  }, [])

  useEffect(() => {
    const fetchInformationForCards = async() => {
      if (!user) return;
      setKPISLoading(true)
      const ownersRegistros = await getDailyIngresosToOwners()
      const kpiDataByOwner = ownersRegistros.today.flatMap(todayOwner => {
        const { owner, ingresos: todayIngresos, egresos: todayEgresos } = todayOwner
        const yesterdayOwner = ownersRegistros.yesterday.find(o => o.owner === owner) || { ingresos: 0, egresos: 0 }

        const kpiPropsOwners : KPISProps[] = [
          {
            title: `Ingresos de ${owner}`,
            value: todayIngresos.toString(),
            change: yesterdayOwner.ingresos > 0 
              ? `Los egresos de ayer fueron: ${yesterdayOwner.ingresos.toString()}`
              : "No se registraron ingresos hoy",
            changeMin: yesterdayOwner.ingresos && yesterdayOwner.ingresos > 0
            ? `${(((todayIngresos - yesterdayOwner.ingresos) / yesterdayOwner.ingresos) * 100).toFixed(2)}%`
            : "0%",
            bgForBadge: "bg-blue-400/50 dark:bg-blue-800/50",
            colorTextForBadge: "text-blue-800 dark:text-blue-200",
            trend: todayIngresos > yesterdayOwner.ingresos ? "up" : "down",
            icon: DollarSign
          },
          {
            title: `Egresos de ${owner}`,
            value: todayEgresos.toString(),
            change: yesterdayOwner.egresos > 0 
              ? `Los egresos de ayer fueron: ${yesterdayOwner.egresos.toString()} `
              : "No se registraron egresos hoy",
            changeMin: yesterdayOwner.egresos && yesterdayOwner.egresos > 0
            ? `${(((todayEgresos - yesterdayOwner.egresos) / yesterdayOwner.egresos) * 100).toFixed(2)}%`
            : "0%",
            bgForBadge: "bg-red-400/50 dark:bg-red-800/50",
            colorTextForBadge: "text-red-800 dark:text-red-200",
            trend: todayEgresos > yesterdayOwner.egresos ? "up" : "down",
            icon: DollarSign
          }
        ]

        return kpiPropsOwners
      })

      setKPIData(kpiDataByOwner);
      setKPISLoading(false)
    }

    const fetchDataForGraphic = async () => {
      const results = await Promise.all(
        [
          await getMonthlyVentasToOwners("egreso"),
          await getMonthlyVentasToOwners("ingreso")
        ]
      )

      const [egresos, ingresos] = results
      
      setDataGraphicIngreso(ingresos);
      setDataGraphicEgreso(egresos)
    }
    fetchInformationForCards();
    fetchDataForGraphic();

  }, [user])

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
      {
        kpisLoading ? (
          <KPISCardsSkeleton/>
        ) : (
          <KPISCardsForInicio
          kpiData={kpiData}
          />
        )
      }
      
      {/* Gráfico de ventas diarias */}
      <GraficoEgresosMensuales
      data={dataGraphiEgreso}
      />

      <GraficoIngresosMensuales
      data={dataGraphiIngreso}
      />



      {/* Gráficos circulares de métricas */}
      <GraficosCirculares />
    </div>
  );
}