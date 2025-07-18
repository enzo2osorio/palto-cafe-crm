import type { GastosPorCategoriaProps, MetricasComparativasProps, TopProductosProps, VentasDiariasProps, VentasPorCategoriaProps } from "@/types/reportes";

 export const ventasPorDia : VentasDiariasProps[] = [
    { dia: 'Lun', ventas: '450000', ordenes: '85' },
    { dia: 'Mar', ventas: '520000', ordenes: '92' },
    { dia: 'Mié', ventas: '380000', ordenes: '78' },
    { dia: 'Jue', ventas: '610000', ordenes: '105' },
    { dia: 'Vie', ventas: '720000', ordenes: '128' },
    { dia: 'Sáb', ventas: '890000', ordenes: '156' },
    { dia: 'Dom', ventas: '640000', ordenes: '98' }
  ];

 export const ventasPorCategoria : VentasPorCategoriaProps[] = [
    { categoria: 'Café y Bebidas', ventas: '2800000', porcentaje: '45' },
    { categoria: 'Comidas', ventas: '1900000', porcentaje: '30' },
    { categoria: 'Postres', ventas: '1200000', porcentaje: '19' },
    { categoria: 'Otros', ventas: '380000', porcentaje: '6' }
  ];

 export const topProductos : TopProductosProps[] = [
    { producto: 'Cappuccino', ventas: '890000', unidades: '456' },
    { producto: 'Sandwich Jamón', ventas: '720000', unidades: '180' },
    { producto: 'Pastel Frutos Rojos', ventas: '650000', unidades: '210' },
    { producto: 'Café Americano', ventas: '580000', unidades: '320' },
    { producto: 'Brownie', ventas: '420000', unidades: '145' }
  ];

 export const gastosPorCategoria : GastosPorCategoriaProps[] = [
    { categoria: 'Insumos', monto: '850000', porcentaje: '35' },
    { categoria: 'Salarios', monto: '1200000', porcentaje: '50' },
    { categoria: 'Servicios', monto: '180000', porcentaje: '7.5' },
    { categoria: 'Marketing', monto: '120000', porcentaje: '5' },
    { categoria: 'Otros', monto: '60000', porcentaje: '2.5' }
  ];

export const metricsComparativas : MetricasComparativasProps[] = [
    { 
      titulo: 'Ventas vs. Mes Anterior',
      actual: "4210000",
      anterior: "3890000",
      cambio: "8.2",
      trending: 'up'
    },
    {
      titulo: 'Número de Órdenes',
      actual: "742",
      anterior: "681",
      cambio: '8.9',
      trending: 'up'
    },
    {
      titulo: 'Ticket Promedio',
      actual: "5676",
      anterior: "5712",
      cambio: "-0.6",
      trending: 'down'
    },
    {
      titulo: 'Margen de Ganancia',
      actual: "42.5",
      anterior: "39.8",
      cambio: "6.8",
      trending: 'up'
    }
  ];