import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CargoEmpleado, TurnoEmpleado } from "@/types/empleados";

interface AgregarEmpleadoProps {
  setShowAgregarForm: (show: boolean) => void;
  cargos: CargoEmpleado[];
  turnos: TurnoEmpleado[];
}

export const AgregarEmpleado = ({ setShowAgregarForm, cargos, turnos }: AgregarEmpleadoProps) => {

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

       const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrar empleado:', formData);
    setShowAgregarForm(false);
  };

  return (
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
  )
}
