import type { ProveedoresProps } from "@/types/proveedores";


export const proveedores : ProveedoresProps[] = [
    {
      id: 1,
      nombre: "Café Premium Los Andes",
      ruc: "76.543.210-1",
      rubro: "Café y granos",
      contacto: "María González",
      telefono: "+56 9 8765 4321",
      email: "maria@cafepremium.cl",
      direccion: "Av. Los Andes 1234, Santiago",
      estado: "activo",
      ultimaCompra: "2025-07-15",
      montoTotal: 2450000,
      observaciones: "Proveedor principal de café orgánico"
    },
    {
      id: 2,
      nombre: "Panadería Artesanal SPA",
      ruc: "12.345.678-9",
      rubro: "Panadería",
      contacto: "Carlos Silva",
      telefono: "+56 2 2234 5678",
      email: "pedidos@panaderiaartesanal.cl",
      direccion: "Calle Panaderos 567, Valparaíso",
      estado: "activo",
      ultimaCompra: "2025-07-16",
      montoTotal: 890000,
      observaciones: "Entrega diaria de pan fresco"
    },
    {
      id: 3,
      nombre: "Lácteos Orgánicos Del Sur",
      ruc: "98.765.432-1",
      rubro: "Lácteos",
      contacto: "Ana Rodríguez",
      telefono: "+56 9 5432 1098",
      email: "ventas@lacteosdelsur.cl",
      direccion: "Ruta 5 Sur Km 890, Temuco",
      estado: "activo",
      ultimaCompra: "2025-07-14",
      montoTotal: 567000,
      observaciones: "Productos orgánicos certificados"
    },
    {
      id: 4,
      nombre: "Frutas y Verduras Mercado Central",
      ruc: "55.666.777-8",
      rubro: "Frutas y verduras",
      contacto: "Jorge Martínez",
      telefono: "+56 2 2987 6543",
      email: "jorge@mercadocentral.cl",
      direccion: "Mercado Central Local 45, Santiago",
      estado: "inactivo",
      ultimaCompra: "2025-06-28",
      montoTotal: 234000,
      observaciones: "Proveedor estacional"
    },
    {
      id: 5,
      nombre: "Suministros de Cafetería Global",
      ruc: "33.444.555-6",
      rubro: "Suministros",
      contacto: "Patricia López",
      telefono: "+56 9 3456 7890",
      email: "patricia@suministrosglobal.cl",
      direccion: "Industrial Norte 2890, Quilicura",
      estado: "activo",
      ultimaCompra: "2025-07-17",
      montoTotal: 1200000,
      observaciones: "Equipos y suministros para cafetería"
    }
  ];

  export const rubros = ['todos', 'Café y granos', 'Panadería', 'Lácteos', 'Frutas y verduras', 'Suministros', 'Otros'];