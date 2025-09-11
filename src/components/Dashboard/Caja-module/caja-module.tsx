import { useCallback, useEffect, useState } from 'react';
import { categorias, metodosPago } from '@/utils/caja-blank';
import { KPISForCaja } from './KPISForCaja';
import { HistorialTransaccionesRecientes } from './Historial-transacciones-recientes';
import { BotonesControl } from './Botones-historial-registro';
import { RegistroCaja } from './registro-caja';
import { getFlujoDiarioyDeAyer } from '@/utils/flujo-de-caja/ingresos-egresos/getFlujosDeCaja';
import type { KPISProps } from '@/types/inicio';
import { formatCurrency } from '@/lib/formatCurrency';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { KPISCardsSkeleton } from '../Skeletons/KpisCardsSkeleton';
import { getMovimientosSemanales } from '@/utils/flujo-de-caja/ingresos-egresos/getFlujoSemanal';
import type { MovimientosSemanales } from '@/types/movimientosSemanales';
import { GraficoIngresosSemanales } from './Grafico-ingresos-semanales';
import { GraficoEgresosSemanales } from './Graficos-egresos-semanales';
import { getRegistrosWithDestinatariosAndMetodoPagoAndCuentaContable, type LastRegistrosProps } from '@/utils/registros/getRegistros';
import { HistorialSkeleton } from '../Skeletons/HistorialSkeleton';

export function CajaModule() {
  const [showRegistrarForm, setShowRegistrarForm] = useState(false);
  const [kpisCards, setKpisCards] = useState<KPISProps[]>([]);
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loadingGraficos, setLoadingGraficos] = useState(true);
  const [loading6Movements, setLoading6Movements] = useState(true);
  const [ingresosSemanales, setIngresosSemanales] = useState<MovimientosSemanales>();
  const [egresosSemanales, setEgresosSemanales] = useState<MovimientosSemanales>();
  const [last6Movements, setLast6Movements] = useState<LastRegistrosProps[]>([]);
  const [historialFilter, setHistorialFilter] = useState<string>(''); 

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

    const fetchingGraficosMovimientos = async() => {
      setLoadingGraficos(true);
      const egresosSemanales = await getMovimientosSemanales('egreso', 4);
      const ingresosSemanales = await getMovimientosSemanales('ingreso', 4);

      setEgresosSemanales(egresosSemanales);
      setIngresosSemanales(ingresosSemanales);
      setLoadingGraficos(false);
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
    fetchingGraficosMovimientos();
    fetchingLastMovements();
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de caja</p>
          <h1 className="f  ont-display text-4xl text-foreground">
            CAJA - <span className="text-primary">INGRESOS & EGRESOS</span>
          </h1>
        </div>
        <BotonesControl
        setShowRegistrarForm={setShowRegistrarForm}
        showRegistrarForm={showRegistrarForm}
        />
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
      {showRegistrarForm && (
        <RegistroCaja
        categorias={categorias}
        setShowRegistrarForm={setShowRegistrarForm}
        metodosPago={metodosPago}
        />
      )}

      {/* Gráfico de flujo semanal ingresos y egresos */}
      {!showRegistrarForm && (
      <>
      {loadingGraficos ? (
        <div>Loading...</div>
      ) : (
       <GraficoIngresosSemanales
      data={ingresosSemanales}
      />
      )}
      {
        loadingGraficos ? (
          <div>Loading...</div>
        ) : (
          <GraficoEgresosSemanales
      data={egresosSemanales}
      />
        )
      }
      </>
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