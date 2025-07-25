export interface ProveedoresProps{ 
    id: number;
    nombre: string;
    ruc: string;
    rubro: string;
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
    estado: "activo" | "inactivo";
    ultimaCompra: string; // Fecha en formato YYYY-MM-DD
    montoTotal: string; // Monto total en pesos
    observaciones?: string; // Campo opcional para observaciones adicionales
}

export type ProveedoresPropsWithoutId = Omit<ProveedoresProps, 'id'>;