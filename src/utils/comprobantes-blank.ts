import type { ComprobantesProps } from "@/types/comprobantes";

//TODO : se supone que a comprobantes tengo que filtrar el pedido del backend para que solo, de la coleccion Proveedores, me llegue los nombres de cada uno.
export const proveedores : string[] = ['todos', 'Café Premium Los Andes', 'Panadería Artesanal SPA', 'Lácteos Orgánicos Del Sur', 'Suministros de Cafetería Global', 'Electricidad y Servicios'];

export const comprobantes: ComprobantesProps[] = [
    {
      id: 1,
      numero: "FAC-001234",
      proveedor: "Café Premium Los Andes",
      monto: 245000,
      fecha: "2025-07-17",
      categoria: "Insumos - Café",
      tipo: "Factura",
      estado: "procesado",
      archivo: "factura_cafe_premium_001234.pdf",
      fechaSubida: "2025-07-17 09:30",
      procesadoIA: true,
      observaciones: "Compra quincenal de café orgánico"
    },
    {
      id: 2,
      numero: "BOL-005678",
      proveedor: "Panadería Artesanal SPA",
      monto: 89000,
      fecha: "2025-07-16",
      categoria: "Insumos - Panadería",
      tipo: "Boleta",
      estado: "pendiente",
      archivo: "boleta_panaderia_005678.jpg",
      fechaSubida: "2025-07-17 08:15",
      procesadoIA: false,
      observaciones: "Pan diario para la semana"
    },
    {
      id: 3,
      numero: "FAC-002456",
      proveedor: "Lácteos Orgánicos Del Sur",
      monto: 156000,
      fecha: "2025-07-15",
      categoria: "Insumos - Lácteos",
      tipo: "Factura",
      estado: "procesado",
      archivo: "factura_lacteos_002456.pdf",
      fechaSubida: "2025-07-16 14:20",
      procesadoIA: true,
      observaciones: "Leche y derivados orgánicos"
    },
    {
      id: 4,
      numero: "BOL-007890",
      proveedor: "Suministros de Cafetería Global",
      monto: 320000,
      fecha: "2025-07-14",
      categoria: "Equipos y Suministros",
      tipo: "Boleta",
      estado: "procesado",
      archivo: "boleta_suministros_007890.pdf",
      fechaSubida: "2025-07-15 11:45",
      procesadoIA: true,
      observaciones: "Filtros y accesorios para máquina"
    },
    {
      id: 5,
      numero: "FAC-003789",
      proveedor: "Electricidad y Servicios",
      monto: 125000,
      fecha: "2025-07-13",
      categoria: "Servicios Básicos",
      tipo: "Factura",
      estado: "procesado",
      archivo: "factura_electricidad_003789.pdf",
      fechaSubida: "2025-07-14 16:30",
      procesadoIA: true,
      observaciones: "Consumo eléctrico mensual"
    }
  ];