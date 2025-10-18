import { useEffect, useState } from 'react';
import { Zap, CheckCircle, Calendar, DollarSign, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/formatCurrency';
import { KPISCardsForComprobantes } from './kpis-cards';
import { getRegistrosOfToday, getRegistrosOfYesterday } from '@/utils/registros/getRegistros';
import type { CustomCardProps } from '@/components/Reusable/CustomCard';
import { KPISCardsSkeleton } from '../Skeletons/KpisCardsSkeleton';
import { TablaComprobantesSkeleton } from '../Skeletons/TablaComprobantesSkeleton';
import { FiltradoComprobantes } from '@/components/Reusable/FiltradoComprobantes';
import { PaginationRegistros } from '@/components/Reusable/PaginationRegistros';
import { useRegistrosStore } from '@/lib/store/registrosStore';
import { getRegistrosWithFilters } from '@/utils/registros/getRegistrosWithFilters';
import { TablaComprobantes } from './tabla-comprobantes';

export function ComprobantesModule() {
  const [activeTab, setActiveTab] = useState('lista');
  const [kpisLoading, setKpisLoading] = useState(true);
  const [kpiFormat, setKpiFormat] = useState<CustomCardProps[]>([]);

  // Usar el store de registros para el estado global
  const {
    registros,
    loading,
    totalCount,
    filters,
    pagination,
    setRegistros,
    setTotalCount,
    setLoading,
    setPagination
  } = useRegistrosStore();

  const loadRegistros = async () => {
    setLoading(true);
    try {
      
      const { data, count } = await getRegistrosWithFilters(filters, pagination);
      console.log('[ComprobantesModule] ✅ Data recibida', {
        returned: data.length,
        totalCount: count,
        first: data[0] ? {
          id: data[0].id,
          origen: data[0].origen,
          tipo: data[0].tipo_movimiento,
          fecha: data[0].fecha
        } : null
      });
      setRegistros(data);
      setTotalCount(count);
    } catch (error) {
      console.error('Error cargando registros:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRegistrosOfToday = async () => {
      setKpisLoading(true);
      const [registrosToday, registrosYesterday] = await Promise.all([
        getRegistrosOfToday(),
        getRegistrosOfYesterday()
      ]);

      const montoDiario = registrosToday.reduce((sum, r) => sum + r.monto, 0);
      const montoYesterday = registrosYesterday.reduce((sum, r) => sum + r.monto, 0);
      const fromBot = registrosToday.filter(r => r.origen === 'bot').length;
      const fromFudo = registrosToday.filter(r => r.origen === 'fudo').length;

      const kpiFormat : CustomCardProps[] = [
        {
        LeftTop : DollarSign,
        titleForBadge: 'Total',
        titleForCard: `${formatCurrency(montoDiario.toString())}`,
        subtitleForCard: `El monto de ayer fue ${formatCurrency(montoYesterday.toString())}`,
        miniDescriptionForCard: 'Documentados',
        },
        {
        LeftTop : Calendar,
        titleForBadge: 'Hoy',
        titleForCard: `${registrosToday.length}`,
        subtitleForCard: 'Subidos Hoy',
        miniDescriptionForCard: 'Nuevos documentos',
      },
        {
        LeftTop : FileText,
        titleForBadge: 'Desde el bot',
        titleForCard: `${fromBot}`,
        subtitleForCard: 'Total Comprobantes desde el bot',
        miniDescriptionForCard: 'En el sistema',
      },
      {
        LeftTop : FileText,
        titleForBadge: 'Desde el fudo',
        titleForCard: `${fromFudo}`,
        subtitleForCard: 'Total Comprobantes desde el fudo',
        miniDescriptionForCard: 'En el sistema',
      },
      
      ]

      setKpiFormat(kpiFormat)
      setKpisLoading(false);
    }

    fetchRegistrosOfToday();
    loadRegistros();
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión documental</p>
        <h1 className="font-display text-4xl text-foreground">
          COMPROBANTES
        </h1>
      </div>

      {/* KPI Cards */}
     {
        kpisLoading ? (
          <KPISCardsSkeleton amountCards={4}/>
        ):(
           <KPISCardsForComprobantes
        kpis={kpiFormat}
      />
        )
     }

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted rounded-2xl p-1">
          <TabsTrigger 
            value="lista" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Lista de Comprobantes
          </TabsTrigger>
          <TabsTrigger 
            value="subir" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Subir Comprobante
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          {/* Filtros avanzados */}
          <FiltradoComprobantes />

          {/* Tabla de comprobantes */}
          {loading ? (
            <TablaComprobantesSkeleton/>
          ) : (
            <TablaComprobantes registros={registros} />
          )}

          {/* Paginación */}
          <PaginationRegistros
            pagination={pagination}
            setPagination={setPagination}
            totalCount={totalCount}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="subir" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Área de subida de archivos */}
            <Card className="card-warm p-6 border-0">
              <h3 className="font-body text-2xl text-foreground mb-6">Subir nuevo comprobante</h3>
              
            </Card>

            {/* Funcionalidad de IA */}
            <Card className="card-warm p-6 border-0">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-8 h-8 text-warning" />
                <h3 className="font-body text-2xl text-foreground">Procesamiento con IA</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-warning/10 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-foreground mb-2">¿Qué hace nuestra IA?</h4>
                  <ul className="space-y-2 font-ui text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Extrae automáticamente el monto del comprobante</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Identifica el proveedor y sus datos</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Categoriza automáticamente el gasto</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Valida la fecha y formato del documento</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Sugiere la cuenta contable correspondiente</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/10 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-foreground mb-2">Estadísticas de procesamiento</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="font-display text-2xl text-primary">98%</p>
                      <p className="font-ui text-sm text-muted-foreground">Precisión en datos</p>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-2xl text-primary">3s</p>
                      <p className="font-ui text-sm text-muted-foreground">Tiempo promedio</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-ui font-semibold text-foreground mb-2">Últimos procesados</h4>
                  <div className="space-y-2">
                    {registros.slice(0, 3).map((registro) => (
                      <div key={registro.id} className="flex justify-between items-center">
                        <span className="font-ui text-sm text-foreground">
                          {registro.destinatario_name || 'Registro'}
                        </span>
                        <Badge className="bg-success/10 text-success border-success/20 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Procesado
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}