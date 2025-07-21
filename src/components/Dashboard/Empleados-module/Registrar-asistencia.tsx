import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import type { EmpleadosProps } from "@/types/empleados";
import { CheckCircle, User, XCircle } from "lucide-react";

interface RegistrarAsistenciaProps{
    empleados: EmpleadosProps[];
}

export const RegistrarAsistencia = ({ empleados }: RegistrarAsistenciaProps) => {
  return (
     <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-2xl text-foreground mb-6">Control de asistencia diaria</h3>
          
          <div className="space-y-4">
            {empleados.filter(e => e.estado === 'activo').map((empleado) => (
              <div key={empleado.id} className="flex items-center justify-between p-4 bg-white dark:bg-accent rounded-xl shadow-sm">
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
                    <Button size="sm" className="bg-success cursor-pointer text-white hover:bg-success/80">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Presente
                    </Button>
                    <Button size="sm" variant="outline" className="border-destructive cursor-pointer text-destructive hover:bg-destructive hover:text-white">
                      <XCircle className="w-4 h-4 mr-1" />
                      Ausente
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
  )
}
