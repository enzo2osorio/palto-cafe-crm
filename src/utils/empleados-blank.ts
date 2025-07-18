import type { CargoEmpleado, EmpleadosProps, TurnoEmpleado } from "@/types/empleados";

export const empleados : EmpleadosProps[] = [
    {
      id: 1,
      nombre: "María José",
      apellido: "González Silva",
      rut: "12.345.678-9",
      cargo: "Barista Principal",
      telefono: "+56 9 8765 4321",
      email: "maria@acantilados.cl",
      fechaIngreso: "2024-01-15",
      salario: 650000,
      turno: "Mañana",
      estado: "activo",
      asistencia: 95,
      horasSemanales: 45,
      observaciones: "Especialista en café de especialidad"
    },
    {
      id: 2,
      nombre: "Carlos Eduardo",
      apellido: "Rodríguez Pérez",
      rut: "98.765.432-1",
      cargo: "Cocinero",
      telefono: "+56 2 2234 5678",
      email: "carlos@acantilados.cl",
      fechaIngreso: "2024-03-10",
      salario: 580000,
      turno: "Tarde",
      estado: "activo",
      asistencia: 88,
      horasSemanales: 40,
      observaciones: "Experto en comida saludable"
    },
    {
      id: 3,
      nombre: "Ana Isabel",
      apellido: "López Martinez",
      rut: "55.666.777-8",
      cargo: "Cajera",
      telefono: "+56 9 5432 1098",
      email: "ana@acantilados.cl",
      fechaIngreso: "2024-06-01",
      salario: 520000,
      turno: "Mañana",
      estado: "activo",
      asistencia: 92,
      horasSemanales: 44,
      observaciones: "Excelente atención al cliente"
    },
    {
      id: 4,
      nombre: "Jorge Luis",
      apellido: "Martínez Castro",
      rut: "33.444.555-6",
      cargo: "Ayudante de Cocina",
      telefono: "+56 2 2987 6543",
      email: "jorge@acantilados.cl",
      fechaIngreso: "2024-02-20",
      salario: 480000,
      turno: "Tarde",
      estado: "vacaciones",
      asistencia: 90,
      horasSemanales: 40,
      observaciones: "En período de vacaciones"
    },
    {
      id: 5,
      nombre: "Patricia Elena",
      apellido: "Sánchez Rojas",
      rut: "77.888.999-0",
      cargo: "Supervisor",
      telefono: "+56 9 3456 7890",
      email: "patricia@acantilados.cl",
      fechaIngreso: "2023-11-01",
      salario: 750000,
      turno: "Completo",
      estado: "activo",
      asistencia: 98,
      horasSemanales: 48,
      observaciones: "Encargada de turnos y capacitación"
    }
  ];


export const cargos : CargoEmpleado[] = ['todos', 'Barista Principal', 'Cocinero', 'Cajera', 'Ayudante de Cocina', 'Supervisor', 'Limpieza'];
export const turnos : TurnoEmpleado[] = ['Mañana', 'Tarde', 'Noche', 'Completo'];