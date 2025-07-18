import { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Phone, Mail, Calendar, Clock, User, CheckCircle, XCircle, ClipboardList } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { empleados, cargos, turnos} from '@/utils/empleados-blank';
import { formatCurrency } from '@/lib/formatCurrency';

export function EmpleadosModule() {
  const [showAgregarForm, setShowAgregarForm] = useState(false);
  const [showAsistencia, setShowAsistencia] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCargo, setSelectedCargo] = useState('todos');
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    cargo: '',
    telefono: '',
    email: '',
    fechaIngreso: '',
    salario: '',
    turno: 'mañana',
    estado: 'activo',
    observaciones: ''
  });

    const filteredEmpleados = empleados.filter(empleado => {
    const matchesSearch = empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.rut.includes(searchTerm);
    const matchesCargo = selectedCargo === 'todos' || empleado.cargo === selectedCargo;
    return matchesSearch && matchesCargo;
  });

  

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrar empleado:', formData);
    setShowAgregarForm(false);
  };

  const totalEmpleados = empleados.length;
  const empleadosActivos = empleados.filter(e => e.estado === 'activo').length;
  const promedioAsistencia = Math.round(empleados.reduce((sum, e) => sum + e.asistencia, 0) / empleados.length);
  const totalNomina = empleados.filter(e => e.estado === 'activo').reduce((sum, e) => sum + e.salario, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de personal</p>
          <h1 className="font-display text-4xl text-foreground">
            EMPLEADOS
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowAsistencia(!showAsistencia);
              setShowAgregarForm(false);
            }}
            className="button-outline-surf font-ui font-medium px-6 py-3 rounded-2xl"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Control Asistencia
          </Button>
          
          <Button 
            onClick={() => {
              setShowAgregarForm(!showAgregarForm);
              setShowAsistencia(false);
            }}
            className="button-surf text-white font-ui font-medium px-6 py-3 rounded-2xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Empleado
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <User className="w-8 h-8 text-primary" />
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Activos
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{empleadosActivos}</h3>
            <p className="font-ui font-semibold text-foreground">Empleados Activos</p>
            <p className="font-ui text-sm text-muted-foreground">De {totalEmpleados} totales</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
            <Badge className="bg-success/10 text-success border-success/20">
              +3%
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{promedioAsistencia}%</h3>
            <p className="font-ui font-semibold text-foreground">Asistencia Promedio</p>
            <p className="font-ui text-sm text-muted-foreground">Este mes</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-accent" />
            <Badge className="bg-accent/10 text-accent border-accent/20">
              40h
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">217</h3>
            <p className="font-ui font-semibold text-foreground">Horas Trabajadas</p>
            <p className="font-ui text-sm text-muted-foreground">Esta semana</p>
          </div>
        </Card>

        <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-secondary" />
            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
              Mensual
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-foreground">{formatCurrency(totalNomina)}</h3>
            <p className="font-ui font-semibold text-foreground">Nómina Total</p>
            <p className="font-ui text-sm text-muted-foreground">Por mes</p>
          </div>
        </Card>
      </div>

      {/* Formulario de agregar empleado (condicional) */}
      {showAgregarForm && (
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-2xl text-foreground mb-6">Registrar nuevo empleado</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Nombre</label>
                <Input
                  placeholder="Nombre del empleado"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Apellido</label>
                <Input
                  placeholder="Apellido del empleado"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">RUT</label>
                <Input
                  placeholder="12.345.678-9"
                  value={formData.rut}
                  onChange={(e) => handleInputChange('rut', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Cargo</label>
                <select
                  value={formData.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                >
                  <option value="">Seleccionar cargo</option>
                  {cargos.slice(1).map((cargo) => (
                    <option key={cargo} value={cargo}>{cargo}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Teléfono</label>
                <Input
                  placeholder="+56 9 1234 5678"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="empleado@acantilados.cl"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Fecha de ingreso</label>
                <Input
                  type="date"
                  value={formData.fechaIngreso}
                  onChange={(e) => handleInputChange('fechaIngreso', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Salario mensual</label>
                <Input
                  type="number"
                  placeholder="500000"
                  value={formData.salario}
                  onChange={(e) => handleInputChange('salario', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Turno</label>
                <select
                  value={formData.turno}
                  onChange={(e) => handleInputChange('turno', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                >
                  {turnos.map((turno) => (
                    <option key={turno} value={turno.toLowerCase()}>{turno}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-ui font-medium text-foreground">Observaciones</label>
              <textarea
                placeholder="Notas adicionales sobre el empleado..."
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={3}
                className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui resize-none"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button type="submit" className="button-surf text-white font-ui font-medium px-8 py-3 rounded-2xl">
                Registrar empleado
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAgregarForm(false)}
                className="button-outline-surf font-ui font-medium px-8 py-3 rounded-2xl"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Control de asistencia (condicional) */}
      {showAsistencia && (
        <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-2xl text-foreground mb-6">Control de asistencia diaria</h3>
          
          <div className="space-y-4">
            {empleados.filter(e => e.estado === 'activo').map((empleado) => (
              <div key={empleado.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-ui font-medium text-foreground">{empleado.nombre} {empleado.apellido}</p>
                    <p className="font-ui text-sm text-muted-foreground">{empleado.cargo} - {empleado.turno}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-ui text-sm text-muted-foreground">Asistencia del mes</p>
                    <p className="font-ui font-semibold text-foreground">{empleado.asistencia}%</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-success text-white hover:bg-success/90">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Presente
                    </Button>
                    <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white">
                      <XCircle className="w-4 h-4 mr-1" />
                      Ausente
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      {!showAgregarForm && !showAsistencia && (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empleados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input-background border-0 rounded-2xl font-ui"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCargo}
                onChange={(e) => setSelectedCargo(e.target.value)}
                className="bg-input-background border-0 rounded-2xl px-4 py-2 font-ui font-medium text-foreground"
              >
                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo.charAt(0).toUpperCase() + cargo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de empleados */}
      {!showAgregarForm && !showAsistencia && (
        <Card className="card-warm border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Empleado</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Cargo</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Contacto</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Turno</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Salario</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Asistencia</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Estado</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmpleados.map((empleado) => (
                  <tr key={empleado.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-ui font-medium text-foreground">{empleado.nombre} {empleado.apellido}</p>
                        <p className="font-ui text-sm text-muted-foreground">{empleado.rut}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-ui text-foreground">{empleado.cargo}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="font-ui text-sm text-foreground">{empleado.telefono}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="font-ui text-sm text-foreground">{empleado.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-primary/10 text-primary border-primary/20 font-ui">
                        {empleado.turno}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="font-ui font-medium text-foreground">{formatCurrency(empleado.salario)}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-ui font-medium text-foreground">{empleado.asistencia}%</p>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${empleado.asistencia >= 90 ? 'bg-success' : empleado.asistencia >= 80 ? 'bg-warning' : 'bg-destructive'}`}
                            style={{ width: `${empleado.asistencia}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${
                        empleado.estado === 'activo' 
                          ? 'bg-success/10 text-success border-success/20'
                          : empleado.estado === 'vacaciones'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20'
                      } font-ui`}>
                        {empleado.estado === 'activo' ? 'Activo' : empleado.estado === 'vacaciones' ? 'Vacaciones' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive">
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
      )}
    </div>
  );
}