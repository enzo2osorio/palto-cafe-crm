import { useCallback, useEffect, useState } from 'react';
import { KPISForCaja } from './KPISForCaja';
import { HistorialTransaccionesRecientes } from './Historial-transacciones-recientes';
import { BotonesControl } from './Botones-historial-registro';
import { getFlujoDiarioyDeAyer } from '@/utils/flujo-de-caja/ingresos-egresos/getFlujosDeCaja';
import type { KPISProps } from '@/types/inicio';
import { formatCurrency } from '@/lib/formatCurrency';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { KPISCardsSkeleton } from '../Skeletons/KpisCardsSkeleton';
import { GraficoUnificado } from './Grafico-unificado';
import { getRegistrosWithDestinatariosAndMetodoPagoAndCuentaContable, type LastRegistrosProps } from '@/utils/registros/getRegistros';
import { HistorialSkeleton } from '../Skeletons/HistorialSkeleton';
import { DateRangeSelector } from '@/components/Reusable/DateRangeSelector';
import type { DateRangeType } from '@/utils/date/getDateRangeByType';
import { getAggregatedDataWithLabels } from '@/utils/registros/registrosMensuales/getDataToOwnersByDateRange';
import type { CustomDateRange } from '@/utils/date/getDateRangeByType';

export function CajaModule() {
  const [showRegistrarForm, setShowRegistrarForm] = useState(false);
  const [kpisCards, setKpisCards] = useState<KPISProps[]>([]);
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loading6Movements, setLoading6Movements] = useState(true);
  const [last6Movements, setLast6Movements] = useState<LastRegistrosProps[]>([]);
  const [historialFilter, setHistorialFilter] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>('mensual');
  // Estados para rango personalizado
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange | null>(null);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [loadingGraphicCustom, setLoadingGraphicCustom] = useState(false);
  const [unifiedGraphData, setUnifiedGraphData] = useState<{
    labels: string[];
    ingresos: number[];
    egresos: number[];
  } | null>(null); 

  const setLast6MovementsCallback = useCallback((movements: LastRegistrosProps[]) => {
    setLast6Movements(movements);
  }, []);

  const setLoading6MovementsCallback = useCallback((loading: boolean) => {
    setLoading6Movements(loading);
  }, []);

  useEffect(() => {

    const fetchingMovimientos = async() => {
      setLoadingKpis(true);
      const {sumaMontosDiarios : ingresosDiarios, sumaMontosYesterday : ingresosYesterday} = await getFlujoDiarioyDeAyer('ingreso')
      const {sumaMontosDiarios : egresosDiarios, sumaMontosYesterday : egresosYesterday} = await getFlujoDiarioyDeAyer('egreso')

      const flujoNetoDiario = ingresosDiarios - egresosDiarios
      const flujoNetoDiarioYesterday = ingresosYesterday - egresosYesterday

      const percentChange = (today: number, yesterday: number) => {
        const t = Number(today) || 0;
        const y = Number(yesterday) || 0;
        if (y !== 0) return `${(((t - y) / y) * 100).toFixed(2)}%`;
        if (t === 0) return '0%';
        const diff = t - y;
        return diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
      };

      const kpiFormat : KPISProps[] = [
        {
            title: "Ingresos de hoy",
            value: formatCurrency(ingresosDiarios.toString()),
            change: `${ingresosYesterday} fueron los ingresos de ayer`,
            changeMin: percentChange(ingresosDiarios, ingresosYesterday),
            bgForBadge: "bg-success/10",
            colorTextForBadge: "text-success",
            bgDarkForBadge: "dark:bg-success/20",
            colorTextDarkForBadge: "dark:text-success",
            trend: ingresosDiarios >= ingresosYesterday ? "up" : "down",
            icon: ingresosDiarios > 0 ? TrendingUp : TrendingDown
        },
        {
            title: "Egresos de hoy",
            value: formatCurrency(egresosDiarios.toString()),
            change: `${formatCurrency(egresosYesterday.toString())} fueron los egresos de ayer`,
            changeMin: percentChange(egresosDiarios, egresosYesterday),
            bgForBadge: "bg-destructive/10",
            colorTextForBadge: "text-destructive",
            bgDarkForBadge: "dark:bg-destructive/20",
            colorTextDarkForBadge: "dark:text-destructive",
            trend: egresosDiarios >= egresosYesterday ? "up" : "down",
            icon: egresosDiarios > 0 ? TrendingDown : TrendingUp
        },
        {
            title: "Movimiento de hoy",
            value: formatCurrency(flujoNetoDiario.toString()),
            change: `${formatCurrency(flujoNetoDiarioYesterday.toString())} fue el movimiento de ayer`,
            changeMin: percentChange(flujoNetoDiario, flujoNetoDiarioYesterday),
            bgForBadge: "bg-primary/10",
            colorTextForBadge: "text-primary",
            bgDarkForBadge: "dark:bg-primary/20",
            colorTextDarkForBadge: "dark:text-primary",
            trend: flujoNetoDiario >= flujoNetoDiarioYesterday ? "up" : "down",
            icon: DollarSign
        }
      ]

      setKpisCards(kpiFormat)
      setLoadingKpis(false);
    }



    const fetchingLastMovements = async() => {
      setLoading6Movements(true);
      const last6movements = await getRegistrosWithDestinatariosAndMetodoPagoAndCuentaContable(6, "");
      if(!last6movements){
        console.warn('No se encontraron movimientos');
        setLoading6Movements(false);
        return;
      }
      setLast6Movements(last6movements);
      setLoading6Movements(false);
    }

    fetchingMovimientos();
    fetchingLastMovements();
  }, [])

  // Efecto separado para actualizar gráficos cuando cambia el rango de fechas
  useEffect(() => {
    const fetchingGraficosMovimientosDynamic = async() => {
      
      if (selectedDateRange === 'personalizado' && customDateRange?.startDate && customDateRange?.endDate) {
        // Para rangos personalizados, usar las funciones que manejan escalado automático
        const [egresosResult, ingresosResult] = await Promise.all([
          getAggregatedDataWithLabels('egreso', selectedDateRange, customDateRange),
          getAggregatedDataWithLabels('ingreso', selectedDateRange, customDateRange)
        ]);

        // Actualizar datos unificados para la gráfica combinada
        setUnifiedGraphData({
          labels: egresosResult.labels, // Ambos deberían tener las mismas etiquetas
          ingresos: ingresosResult.data,
          egresos: egresosResult.data
        });
        
      } else {
        // Para rangos predefinidos, usar las nuevas funciones también
        const [egresosResult, ingresosResult] = await Promise.all([
          getAggregatedDataWithLabels('egreso', selectedDateRange),
          getAggregatedDataWithLabels('ingreso', selectedDateRange)
        ]);

        // Actualizar datos unificados para la gráfica combinada
        setUnifiedGraphData({
          labels: egresosResult.labels,
          ingresos: ingresosResult.data,
          egresos: egresosResult.data
        });
      }
    }

    fetchingGraficosMovimientosDynamic();
  }, [selectedDateRange, customDateRange])

  const handleCustomRangeApply = (startDate: Date, endDate: Date) => {
    console.log('Caja - Aplicando rango personalizado:', {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de caja</p>
            <h1 className="font-display text-4xl text-foreground">
              CAJA - <span className="text-primary">INGRESOS & EGRESOS</span>
            </h1>
          </div>
          <BotonesControl
            setShowRegistrarForm={setShowRegistrarForm}
            showRegistrarForm={showRegistrarForm}
          />
        </div>
      </div>
      {/* KPI Cards */}
      {!showRegistrarForm && (
      <>
      {loadingKpis ? ( 
        <KPISCardsSkeleton amountCards={3}/>
      ) : (
        <KPISForCaja
      kpisCards={kpisCards}
      />
      )}
      </>
      )}
      {/* Formulario de registro (condicional) */}
      {/* {showRegistrarForm && (
        <RegistroCaja
        categorias={categorias}
        setShowRegistrarForm={setShowRegistrarForm}
        metodosPago={metodosPago}
        />
      )} */}

 {/* Date Range Selector */}
        {!showRegistrarForm && (
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
        )}
      {/* Gráfico unificado de flujo de caja */}
      {!showRegistrarForm && (
        <GraficoUnificado data={unifiedGraphData} />
      )}
      {/* Historial de transacciones recientes */}
      {
        !showRegistrarForm && (
        <>
        {
          loading6Movements ? (
            <HistorialSkeleton />
          ) : (
           <HistorialTransaccionesRecientes
              transacciones={last6Movements}
              setLast6Movements={setLast6MovementsCallback}
              setLoading6Movements={setLoading6MovementsCallback}
              filterValue={historialFilter}
              onChangeFilter={setHistorialFilter}
            />
          )}
        </>
        )
      }
    </div>
  );
}