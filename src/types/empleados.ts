
export type EstadoEmpleado = 'activo' | 'inactivo' | 'licencia';
export type TurnoEmpleado = 'Mañana' | 'Tarde' | 'Noche' | 'Completo';
export type CargoEmpleado = 'Todos los cargos' | 'Barista Principal' | 'Cocinero' | 'Cajera' | 'Ayudante de Cocina' | 'Supervisor' | 'Limpieza';

export interface EmpleadosProps{
    id: number;
    name: string;
    
    rut: string;
    cargo: string;
    telefono: string;
    email: string;
    fechaIngreso: string; // ISO date format
    salario: number; // in CLP
    turno: TurnoEmpleado;
    estado:  EstadoEmpleado | string ;
    asistencia: number; // percentage
    horasSemanales: number; // total hours per week
    observaciones?: string; // optional field for additional notes
}



