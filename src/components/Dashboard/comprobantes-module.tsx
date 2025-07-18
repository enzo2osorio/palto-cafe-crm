import { useState } from 'react';
import { Upload, Search, Filter, Eye, Download, Trash2, FileText, Calendar, DollarSign, Building, Zap, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { comprobantes, proveedores } from '@/utils/comprobantes-blank';
import { formatCurrency } from '@/lib/formatCurrency';

export function ComprobantesModule() {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState('todos');
  const [uploading, setUploading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  

  const filteredComprobantes = comprobantes.filter(comprobante => {
    const matchesSearch = comprobante.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comprobante.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comprobante.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProveedor = selectedProveedor === 'todos' || comprobante.proveedor === selectedProveedor;
    return matchesSearch && matchesProveedor;
  });


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

  const totalComprobantes = comprobantes.length;
  const comprobantesHoy = comprobantes.filter(c => new Date(c.fecha).getMilliseconds() === Date.now()).length;
  const montoTotal = comprobantes.reduce((sum, c) => sum + c.monto, 0);
  const procesadosIA = comprobantes.filter(c => c.procesadoIA).length;

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Total
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{totalComprobantes}</h3>
            <p className="font-ui font-semibold text-foreground">Total Comprobantes</p>
            <p className="font-ui text-sm text-muted-foreground">En el sistema</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-success" />
            <Badge className="bg-success/10 text-success border-success/20">
              Hoy
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{comprobantesHoy}</h3>
            <p className="font-ui font-semibold text-foreground">Subidos Hoy</p>
            <p className="font-ui text-sm text-muted-foreground">Nuevos documentos</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-accent" />
            <Badge className="bg-accent/10 text-accent border-accent/20">
              Total
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{formatCurrency(montoTotal)}</h3>
            <p className="font-ui font-semibold text-foreground">Monto Total</p>
            <p className="font-ui text-sm text-muted-foreground">Documentados</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-warning" />
            <Badge className="bg-warning/10 text-warning border-warning/20">
              IA
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{procesadosIA}</h3>
            <p className="font-ui font-semibold text-foreground">Procesados con IA</p>
            <p className="font-ui text-sm text-muted-foreground">Automatizados</p>
          </div>
        </Card>
      </div>

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
          {/* Filtros y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar comprobantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedProveedor}
                  onChange={(e) => setSelectedProveedor(e.target.value)}
                  className="bg-input-background border-0 rounded-2xl px-4 py-2 font-ui font-medium text-foreground"
                >
                  {proveedores.map((proveedor) => (
                    <option key={proveedor} value={proveedor}>
                      {proveedor.charAt(0).toUpperCase() + proveedor.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de comprobantes */}
          <Card className="card-warm border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Comprobante</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Proveedor</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Monto</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Fecha</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Categoría</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Estado</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComprobantes.map((comprobante) => (
                    <tr key={comprobante.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <p className="font-ui font-medium text-foreground">{comprobante.numero}</p>
                          </div>
                          <p className="font-ui text-sm text-muted-foreground">{comprobante.tipo}</p>
                          {comprobante.procesadoIA && (
                            <div className="flex items-center space-x-1">
                              <Zap className="w-3 h-3 text-warning" />
                              <span className="font-ui text-xs text-warning">Procesado IA</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <p className="font-ui text-foreground">{comprobante.proveedor}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-ui font-semibold text-foreground">{formatCurrency(comprobante.monto)}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-ui text-foreground">{comprobante.fecha}</p>
                        <p className="font-ui text-sm text-muted-foreground">Subido: {comprobante.fechaSubida}</p>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20 font-ui">
                          {comprobante.categoria}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${
                          comprobante.estado === 'procesado' 
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                        } font-ui`}>
                          {comprobante.estado === 'procesado' ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Procesado
                            </>
                          ) : (
                            'Pendiente'
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="w-8 h-8 p-0" title="Ver documento">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="w-8 h-8 p-0" title="Descargar">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
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
                    {comprobantes.slice(0, 3).map((comp) => (
                      <div key={comp.id} className="flex justify-between items-center">
                        <span className="font-ui text-sm text-foreground">{comp.numero}</span>
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