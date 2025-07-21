
import { CustomCard, type CustomCardProps } from "@/components/Reusable/CustomCard";
import { formatCurrency } from "@/lib/formatCurrency";
import type { EmpleadosProps } from "@/types/empleados";
import { Calendar, CheckCircle, Clock, User } from "lucide-react"

interface KPISForEmpleadosProps{
    empleados : EmpleadosProps[]
}

export const KPISForEmpleados = ({ empleados }: KPISForEmpleadosProps) => {

    const totalEmpleados = empleados.length;
  const empleadosActivos = empleados.filter(e => e.estado === 'activo').length;
  const promedioAsistencia = Math.round(empleados.reduce((sum, e) => sum + e.asistencia, 0) / empleados.length);
  const totalNomina = empleados.filter(e => e.estado === 'activo').reduce((sum, e) => sum + e.salario, 0);

  const KPISForEmpleados : CustomCardProps[]  = [
    {
        LeftTop: User,
        titleForBadge: "Activos",
        titleForCard: empleadosActivos.toString(),
        subtitleForCard: "Empleados Activos",
        miniDescriptionForCard: `De ${totalEmpleados} totales`,
        },
        {
        LeftTop: CheckCircle,
        titleForBadge: "+3%",
        titleForCard: `${promedioAsistencia}%`,
        subtitleForCard: "Asistencia Promedio",
        miniDescriptionForCard: "Este mes",
        },
        {
        LeftTop: Clock,
        titleForBadge: "40h",
        titleForCard: "217",
        subtitleForCard: "Horas Trabajadas",
        miniDescriptionForCard: "Esta semana",
        },
        {
        LeftTop: Calendar,
        titleForBadge: "Mensual",
        titleForCard: formatCurrency(totalNomina.toString()),
        subtitleForCard: "Nómina Total",
        miniDescriptionForCard: "Por mes",
    }
    
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {
            KPISForEmpleados.map((kpi, index: number) => (
                <CustomCard
                    key={index}
                    LeftTop={kpi.LeftTop}
                    titleForBadge={kpi.titleForBadge}
                    titleForCard={kpi.titleForCard}
                    subtitleForCard={kpi.subtitleForCard}
                    miniDescriptionForCard={kpi.miniDescriptionForCard}
                />
            ))
        } 
      </div>
  )
}
