import { useEffect, useState } from 'react';
import { Upload, Zap, CheckCircle, Calendar, DollarSign, FileText } from 'lucide-react';
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

export function ComprobantesModule() {
  const [activeTab, setActiveTab] = useState('lista');
  const [uploading, setUploading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
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

  // Cargar registros iniciales
  const loadRegistros = async () => {
    setLoading(true);
    try {
      const { data, count } = await getRegistrosWithFilters(filters, pagination);
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

  // Recargar cuando cambie la paginación
  useEffect(() => {
    loadRegistros();
  }, [pagination])


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      // Simular subida de archivo
      setTimeout(() => {
        setUploading(false);
        setAiProcessing(true);
        // Simular procesamiento IA
        setTimeout(() => {
          setAiProcessing(false);
          console.log('Archivo procesado con IA:', file.name);
        }, 3000);
      }, 2000);
    }
  };

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
          <FiltradoComprobantes onFiltersChange={loadRegistros} />

          {/* Tabla de comprobantes */}
          {loading ? (
            <TablaComprobantesSkeleton/>
          ) : (
            <Card className="card-warm border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Destinatario</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Categoría</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Subcategoría</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Monto</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Fecha</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Cuenta contable</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No se encontraron comprobantes con los filtros aplicados
                      </td>
                    </tr>
                  ) : (
                    registros.map((registro) => (
                      <tr key={registro.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <p className="font-ui text-foreground">
                              {registro.destinatarios?.[0]?.name || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            className={`text-base border font-ui ${
                              registro.tipo_movimiento === 'ingreso' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            {registro.tipo_movimiento}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="bg-primary/10 text-primary text-base lg:max-w-[80%] border-primary/20 font-ui p-1 px-2 rounded-lg text-center">
                            {registro.origen}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-ui font-semibold text-foreground">
                            {formatCurrency(registro.monto.toString())}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-ui text-foreground">
                            {new Date(registro.fecha).toLocaleDateString()}
                          </p>
                          <p className="font-ui text-sm text-muted-foreground">
                            Subido: {new Date(registro.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-ui font-semibold text-foreground lg:max-w-[80%] text-pretty">
                            {registro.cuenta_contable?.[0]?.name || 'N/A'}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
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
              
              <div className="space-y-6">
                {/* Drag and drop area */}
                <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="font-ui font-semibold text-foreground mb-2">
                    Arrastra tu comprobante aquí
                  </h4>
                  <p className="font-ui text-muted-foreground mb-4">
                    O haz clic para seleccionar archivo
                  </p>
                  <p className="font-ui text-sm text-muted-foreground mb-4">
                    Formatos soportados: PDF, JPG, PNG (máx. 10MB)
                  </p>
                  
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="comprobante-upload"
                  />
                  <label
                    htmlFor="comprobante-upload"
                    className="inline-block button-surf text-white px-6 py-3 rounded-xl font-ui cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                  </label>
                </div>

                {/* Estado del procesamiento */}
                {(uploading || aiProcessing) && (
                  <Card className="p-4 border border-primary/20 bg-primary/5">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <div className="space-y-1">
                        <p className="font-ui font-medium text-foreground">
                          {uploading ? 'Subiendo archivo...' : 'Procesando con IA...'}
                        </p>
                        <p className="font-ui text-sm text-muted-foreground">
                          {uploading 
                            ? 'El archivo se está cargando al servidor' 
                            : 'Extrayendo datos automáticamente del comprobante'
                          }
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
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
                          {registro.destinatarios?.[0]?.name || 'Registro'}
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