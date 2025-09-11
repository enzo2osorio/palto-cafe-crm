import type { CategoriasProps, DatosSemanalesProps, MetodosPago, TransaccionesProps } from "@/types/caja";

export const transacciones : TransaccionesProps[] = [
    {
      id: 1,
      tipo: 'ingreso',
      monto: 145000,
      categoria: 'Ventas café',
      fecha: '2025-07-17',
      metodoPago: 'Tarjeta',
      descripcion: 'Ventas del día - café',
      comprobante: true
    },
    {
      id: 2,
      tipo: 'egreso',
      monto: 85000,
      categoria: 'Insumos',
      fecha: '2025-07-17',
      metodoPago: 'Transferencia',
      descripcion: 'Compra de granos de café premium',
      comprobante: true
    },
    {
      id: 3,
      tipo: 'ingreso',
      monto: 89000,
      categoria: 'Ventas comida',
      fecha: '2025-07-17',
      metodoPago: 'Efectivo',
      descripcion: 'Ventas del día - comida',
      comprobante: false
    },
    {
      id: 4,
      tipo: 'egreso',
      monto: 45000,
      categoria: 'Servicios',
      fecha: '2025-07-16',
      metodoPago: 'Transferencia',
      descripcion: 'Pago electricidad',
      comprobante: true
    },
    {
      id: 5,
      tipo: 'egreso',
      monto: 25000,
      categoria: 'Marketing',
      fecha: '2025-07-16',
      metodoPago: 'Tarjeta',
      descripcion: 'Publicidad redes sociales',
      comprobante: true
    }
  ];

  export const categorias : CategoriasProps = {
    ingreso: ['Ventas café', 'Ventas comida', 'Ventas postres', 'Otros ingresos'],
    egreso: ['Insumos', 'Servicios', 'Marketing', 'Salarios', 'Mantenimiento', 'Otros gastos']
  };




  export const metodosPago : MetodosPago[] = ['Efectivo', 'Tarjeta', 'Transferencia', 'QR/Digital'];

  