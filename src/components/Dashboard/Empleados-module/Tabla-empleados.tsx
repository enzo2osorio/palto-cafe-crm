import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatCurrency";
import type { EmpleadosProps } from "@/types/empleados";
import { Edit3, Mail, Phone, Trash2 } from "lucide-react"

interface TablaEmpleadosProps{
    empleados: EmpleadosProps[];
    searchTerm: string;
    selectedCargo: string;
}

export const TablaEmpleados = ({ empleados, searchTerm, selectedCargo }: TablaEmpleadosProps) => {

    const filteredEmpleados = empleados.filter(empleado => {
    const matchesSearch = empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.rut.includes(searchTerm);
    const matchesCargo = selectedCargo === 'Todos los cargos' || empleado.cargo === selectedCargo;
    return matchesSearch && matchesCargo;
  });

  return (
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
                      <p className="font-ui font-medium text-foreground">{formatCurrency(empleado.salario.toString())}</p>
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
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 cursor-pointer">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive cursor-pointer">
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
  )
}
