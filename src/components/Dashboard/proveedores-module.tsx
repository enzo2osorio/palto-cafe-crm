import { useState } from 'react';
import { Search, Filter, Edit3, Trash2, Phone, Mail, MapPin, User, Building } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { proveedores, rubros } from '@/utils/proveedores-blank';
import { formatCurrency } from '@/lib/formatCurrency';

export function ProveedoresModule() {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRubro, setSelectedRubro] = useState('todos');
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    rubro: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    estado: 'activo',
    observaciones: ''
  });

  const filteredProveedores = proveedores.filter(proveedor => {
    const matchesSearch = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proveedor.ruc.includes(searchTerm) ||
                         proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRubro = selectedRubro === 'todos' || proveedor.rubro === selectedRubro;
    return matchesSearch && matchesRubro;
  });


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrar proveedor:', formData);
    // Aquí iría la lógica para guardar el proveedor
  };

  const totalProveedoresActivos = proveedores.filter(p => p.estado === 'activo').length;
  const montoTotalCompras = proveedores.reduce((sum, p) => sum + p.montoTotal, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de proveedores</p>
        <h1 className="font-display text-4xl text-foreground">
          PROVEEDORES
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <Building className="w-8 h-8 text-primary" />
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Activos
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{totalProveedoresActivos}</h3>
            <p className="font-ui font-semibold text-foreground">Proveedores Activos</p>
            <p className="font-ui text-sm text-muted-foreground">De {proveedores.length} totales</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <User className="w-8 h-8 text-secondary" />
            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
              Total
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{proveedores.length}</h3>
            <p className="font-ui font-semibold text-foreground">Total Proveedores</p>
            <p className="font-ui text-sm text-muted-foreground">En el sistema</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-8 h-8 text-accent" />
            <Badge className="bg-success/10 text-success border-success/20">
              +15%
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{formatCurrency(montoTotalCompras)}</h3>
            <p className="font-ui font-semibold text-foreground">Compras Totales</p>
            <p className="font-ui text-sm text-muted-foreground">Este mes</p>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted rounded-2xl p-1">
          <TabsTrigger 
            value="lista" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Lista de Proveedores
          </TabsTrigger>
          <TabsTrigger 
            value="agregar" 
            className="rounded-xl font-ui data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Agregar Proveedor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          {/* Filtros y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar proveedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedRubro}
                  onChange={(e) => setSelectedRubro(e.target.value)}
                  className="bg-input-background border-0 rounded-2xl px-4 py-2 font-ui font-medium text-foreground"
                >
                  {rubros.map((rubro) => (
                    <option key={rubro} value={rubro}>
                      {rubro.charAt(0).toUpperCase() + rubro.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lista de proveedores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProveedores.map((proveedor) => (
              <Card key={proveedor.id} className="card-warm border-0 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 space-y-4">
                  {/* Header del proveedor */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-ui font-bold text-lg text-foreground">{proveedor.nombre}</h4>
                      <p className="font-ui text-sm text-muted-foreground">RUC: {proveedor.ruc}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`${
                        proveedor.estado === 'activo' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20'
                      } font-ui text-xs`}>
                        {proveedor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                      
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-ui text-sm text-foreground">{proveedor.contacto}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-ui text-sm text-foreground">{proveedor.telefono}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-ui text-sm text-foreground">{proveedor.email}</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="font-ui text-sm text-foreground">{proveedor.direccion}</span>
                    </div>
                  </div>

                  {/* Métricas del proveedor */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-xl p-3">
                      <p className="font-ui text-xs text-muted-foreground mb-1">Rubro</p>
                      <p className="font-ui font-semibold text-foreground">{proveedor.rubro}</p>
                    </div>
                    
                    <div className="bg-muted rounded-xl p-3">
                      <p className="font-ui text-xs text-muted-foreground mb-1">Última compra</p>
                      <p className="font-ui font-semibold text-foreground">{proveedor.ultimaCompra}</p>
                    </div>
                  </div>

                  {/* Monto total */}
                  <div className="bg-primary/5 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-ui text-sm text-foreground">Compras totales:</span>
                      <span className="font-ui font-bold text-primary">{formatCurrency(proveedor.montoTotal)}</span>
                    </div>
                  </div>

                  {/* Observaciones */}
                  {proveedor.observaciones && (
                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="font-ui text-xs text-muted-foreground mb-1">Observaciones</p>
                      <p className="font-ui text-sm text-foreground">{proveedor.observaciones}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agregar" className="space-y-6">
          <Card className="card-warm p-6 border-0">
            <h3 className="font-body text-2xl text-foreground mb-6">Registrar nuevo proveedor</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Nombre de la empresa</label>
                  <Input
                    placeholder="Nombre del proveedor"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* RUC */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">RUC</label>
                  <Input
                    placeholder="12.345.678-9"
                    value={formData.ruc}
                    onChange={(e) => handleInputChange('ruc', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* Rubro */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Rubro</label>
                  <select
                    value={formData.rubro}
                    onChange={(e) => handleInputChange('rubro', e.target.value)}
                    className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                  >
                    <option value="">Seleccionar rubro</option>
                    {rubros.slice(1).map((rubro) => (
                      <option key={rubro} value={rubro}>{rubro}</option>
                    ))}
                  </select>
                </div>

                {/* Contacto */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Persona de contacto</label>
                  <Input
                    placeholder="Nombre del contacto"
                    value={formData.contacto}
                    onChange={(e) => handleInputChange('contacto', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Teléfono</label>
                  <Input
                    placeholder="+56 9 1234 5678"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="contacto@proveedor.cl"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Dirección</label>
                <Input
                  placeholder="Dirección completa"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              {/* Observaciones */}
              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Observaciones</label>
                <textarea
                  placeholder="Notas adicionales sobre el proveedor..."
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  rows={3}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui resize-none"
                />
              </div>

              <Button type="submit" className="button-surf text-white font-ui font-medium px-8 py-3 rounded-2xl">
                Registrar proveedor
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}