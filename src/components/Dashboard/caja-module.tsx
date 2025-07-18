import { useState } from 'react';
import { Plus, Upload, Calendar, DollarSign, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { categorias, transacciones, datosSemanales, metodosPago } from '@/utils/caja-blank';
export function CajaModule() {
  const [showRegistrarForm, setShowRegistrarForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'ingreso',
    monto: '',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
    metodoPago: 'efectivo',
    descripcion: '',
    comprobante: null as File | null
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const totalEgresos = transacciones
    .filter(t => t.tipo === 'egreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const flujoNeto = totalIngresos - totalEgresos;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, comprobante: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrar transacción:', formData);
    setShowRegistrarForm(false);
  };

  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de caja</p>
          <h1 className="font-display text-4xl text-foreground">
            CAJA - <span className="text-primary">INGRESOS & EGRESOS</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => console.log('Ver historial')}
            className="button-outline-surf font-ui font-medium px-6 py-3 rounded-2xl"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Historial
          </Button>
          
          <Button 
            onClick={() => setShowRegistrarForm(!showRegistrarForm)}
            className="button-surf text-white font-ui font-medium px-6 py-3 rounded-2xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Transacción
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-success" />
            <Badge className="bg-success/10 text-success border-success/20">
              +12%
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{formatCurrency(totalIngresos)}</h3>
            <p className="font-ui font-semibold text-foreground">Total Ingresos</p>
            <p className="font-ui text-sm text-muted-foreground">Hoy</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="w-8 h-8 text-destructive" />
            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
              +8%
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{formatCurrency(totalEgresos)}</h3>
            <p className="font-ui font-semibold text-foreground">Total Egresos</p>
            <p className="font-ui text-sm text-muted-foreground">Hoy</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className={`w-8 h-8 ${flujoNeto > 0 ? 'text-success' : 'text-destructive'}`} />
            <Badge className={`${
              flujoNeto > 0 
                ? 'bg-success/10 text-success border-success/20' 
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              {flujoNeto > 0 ? '+' : ''}{Math.round((flujoNeto / totalIngresos) * 100)}%
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{formatCurrency(flujoNeto)}</h3>
            <p className="font-ui font-semibold text-foreground">Flujo Neto</p>
            <p className="font-ui text-sm text-muted-foreground">Hoy</p>
          </div>
        </Card>
      </div>

      {/* Formulario de registro (condicional) */}
      {showRegistrarForm && (
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-2xl text-foreground mb-6">Registrar nueva transacción</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Tipo de transacción</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Monto</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.monto}
                  onChange={(e) => handleInputChange('monto', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias[formData.tipo as keyof typeof categorias].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Fecha</label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Método de pago</label>
                <select
                  value={formData.metodoPago}
                  onChange={(e) => handleInputChange('metodoPago', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                >
                  {metodosPago.map((metodo) => (
                    <option key={metodo} value={metodo.toLowerCase()}>{metodo}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Comprobante</label>
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-4 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="comprobante-upload"
                  />
                  <label
                    htmlFor="comprobante-upload"
                    className="inline-block bg-primary text-white px-4 py-2 rounded-xl font-ui cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    Subir archivo
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-ui font-medium text-foreground">Descripción</label>
              <textarea
                placeholder="Descripción de la transacción..."
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={3}
                className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui resize-none"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button type="submit" className="button-surf text-white font-ui font-medium px-8 py-3 rounded-2xl">
                Registrar transacción
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowRegistrarForm(false)}
                className="button-outline-surf font-ui font-medium px-8 py-3 rounded-2xl"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Gráfico de flujo semanal */}
      <Card className="card-warm p-6 border-0">
        <h3 className="font-body text-2xl text-foreground mb-6">Flujo de caja semanal</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-end space-x-4 text-sm font-ui">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Ingresos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span>Egresos</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-4">
            {datosSemanales.map((dia, index) => {
              const maxValue = Math.max(...datosSemanales.flatMap(d => [d.ingresos, d.egresos]));
              return (
                <div key={index} className="flex-1 space-y-2">
                  <div className="flex items-end justify-center space-x-1 h-48">
                    <div 
                      className="bg-success rounded-t-lg w-6 transition-all hover:bg-success/80"
                      style={{ height: `${(dia.ingresos / maxValue) * 100}%` }}
                      title={`Ingresos: ${formatCurrency(dia.ingresos)}`}
                    ></div>
                    <div 
                      className="bg-destructive rounded-t-lg w-6 transition-all hover:bg-destructive/80"
                      style={{ height: `${(dia.egresos / maxValue) * 100}%` }}
                      title={`Egresos: ${formatCurrency(dia.egresos)}`}
                    ></div>
                  </div>
                  <p className="text-center font-ui text-sm text-muted-foreground">{dia.dia}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Historial de transacciones recientes */}
      <Card className="card-warm p-6 border-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-body text-2xl text-foreground">Transacciones recientes</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select className="bg-input-background border-0 rounded-2xl px-4 py-2 font-ui">
              <option>Todas</option>
              <option>Ingresos</option>
              <option>Egresos</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {transacciones.slice(0, 5).map((transaccion) => (
            <div key={transaccion.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaccion.tipo === 'ingreso' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {transaccion.tipo === 'ingreso' 
                      ? <TrendingUp className="w-6 h-6" />
                      : <TrendingDown className="w-6 h-6" />
                    }
                  </div>
                  
                  <div>
                    <h4 className="font-ui font-semibold text-foreground">{transaccion.categoria}</h4>
                    <p className="font-ui text-sm text-muted-foreground">{transaccion.descripcion}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="font-ui text-xs text-muted-foreground">{transaccion.fecha}</span>
                      <span className="font-ui text-xs text-muted-foreground">{transaccion.metodoPago}</span>
                      {transaccion.comprobante && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Con comprobante
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-ui font-bold text-lg ${
                    transaccion.tipo === 'ingreso' 
                      ? 'text-success' 
                      : 'text-destructive'
                  }`}>
                    {transaccion.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(transaccion.monto)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}