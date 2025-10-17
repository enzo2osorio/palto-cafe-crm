import { KPISCardsForInicio } from './KPISCardsForInicio';
import { GraficoEgresosMensuales } from './Grafico-egresos-mensuales';
import { useEffect, useState } from 'react';
import type { User } from '@/types/authSupabase';
import { fetchingAuthUser } from '@/lib/fetchUser';
import { InicioSkeleton } from '../Skeletons/InicioSkeleton';
import {  getDailyIngresosToOwners } from '@/utils/registros/getDailyRegistros';
import type { KPISProps } from '@/types/inicio';
import { DollarSign } from 'lucide-react';
import { KPISCardsSkeleton } from '../Skeletons/KpisCardsSkeleton';
import { getDataToOwnersByDateRange, getAggregatedDataWithLabels } from '@/utils/registros/registrosMensuales/getDataToOwnersByDateRange';
import { GraficoIngresosMensuales } from './Grafico-ingresos-mensuales';
import { formatCurrency } from '@/lib/formatCurrency';
import { DateRangeSelector } from '@/components/Reusable/DateRangeSelector';
import type { DateRangeType } from '@/utils/date/getDateRangeByType';


export interface GraphicProps{
  owner : string;
  monthlyIngresos: number[]
}

export function InicioModule() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingGraphic, setLoadingGraphic] = useState(true);
  const [kpisLoading, setKPISLoading] = useState(true);
  const [kpiData, setKPIData] = useState<KPISProps[]>([]);
  const [dataGraphiIngreso, setDataGraphicIngreso] = useState<GraphicProps[]>();
  const [dataGraphiEgreso, setDataGraphicEgreso] = useState<GraphicProps[]>();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>('mensual');
  const [dateLabels, setDateLabels] = useState<string[]>([]);
  // Estados para rango personalizado
  const [customDateRange, setCustomDateRange] = useState<{ startDate?: Date; endDate?: Date } | null>(null);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [loadingGraphicCustom, setLoadingGraphicCustom] = useState(false);

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
            value: formatCurrency(todayIngresos.toString()),
            change: yesterdayOwner.ingresos > 0 
              ? `Los egresos de ayer fueron: ${formatCurrency(yesterdayOwner.ingresos.toString())}`
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
            value: formatCurrency(todayEgresos.toString()),
            change: yesterdayOwner.egresos > 0 
              ? `Los egresos de ayer fueron: ${formatCurrency(yesterdayOwner.egresos.toString())}`
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

    fetchInformationForCards();

  }, [user])

  useEffect(() => {
    if (!user) return;
    async function fetchDataForGraphic() {
      setLoadingGraphic(true);
      
      // Obtener datos y etiquetas inteligentes
      const [egresosResult, ingresosResult, egresos, ingresos] = await Promise.all([
        getAggregatedDataWithLabels("egreso", selectedDateRange, customDateRange),
        getAggregatedDataWithLabels("ingreso", selectedDateRange, customDateRange),
        getDataToOwnersByDateRange("egreso", selectedDateRange, customDateRange),
        getDataToOwnersByDateRange("ingreso", selectedDateRange, customDateRange)
      ]);

      // Usar las etiquetas inteligentes de la nueva función
      // Ambos deberían tener las mismas etiquetas, pero verificamos por seguridad
      setDateLabels(egresosResult.labels.length > 0 ? egresosResult.labels : ingresosResult.labels);
      
      setDataGraphicIngreso(ingresos);
      setDataGraphicEgreso(egresos)
      setLoadingGraphic(false);
    }

    fetchDataForGraphic();
  }, [user, selectedDateRange, customDateRange])

  const handleCustomRangeApply = (startDate: Date, endDate: Date) => {
    console.log('Inicio - Aplicando rango personalizado:', {
      startDate: startDate.toDateString(),
      endDate: endDate.toDateString()
    });
    setLoadingGraphicCustom(true);
    setCustomDateRange({ startDate, endDate });
    // El loading se manejará en el useEffect
    setTimeout(() => setLoadingGraphicCustom(false), 100);
  };

  const handleCustomDatesChange = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  if(loading){
    return <InicioSkeleton/>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Inicio</p>
          <h1 className="font-display text-5xl text-foreground">
            HOLA, <span className="text-primary">{user?.nombre}</span>
          </h1>
        </div>
      
      </div>

      {/* KPI Cards */}
      {
        kpisLoading ? (
          <KPISCardsSkeleton amountCards={6}/>
        ) : (
          <KPISCardsForInicio
          kpiData={kpiData}
          />
        )
      }

      {/* Date Range Selector */}
        <div className="flex justify-end">
          <DateRangeSelector
            value={selectedDateRange}
            onValueChange={setSelectedDateRange}
            onCustomRangeApply={handleCustomRangeApply}
            loading={loadingGraphicCustom}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomDatesChange={handleCustomDatesChange}
          />
        </div>
      
      {/* Gráficos con rangos de fechas dinámicos */}
      {
        loadingGraphic ? (
           <div className="grid grid-cols-1 gap-8">
        {/* Gráfico de ventas diarias */}
        <div className="p-6 rounded-xl bg-muted/50 flex flex-col gap-6">
          <div className="h-6 w-48 bg-muted rounded mx-auto" />
          <div className="h-48 w-full bg-muted rounded" />
        </div>
        <div className="p-6 rounded-xl bg-muted/50 flex flex-col gap-6">
          <div className="h-6 w-48 bg-muted rounded mx-auto" />
          <div className="h-48 w-full bg-muted rounded" />
        </div>
      </div>
        ) : (
          <>
            <GraficoEgresosMensuales
              data={dataGraphiEgreso}
              labels={dateLabels}
              selectedDateRange={selectedDateRange}
            />

            <GraficoIngresosMensuales
              data={dataGraphiIngreso}
              labels={dateLabels}
              selectedDateRange={selectedDateRange}
            />
          </>
        )
      }
    </div>
  );
}