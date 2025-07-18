
export interface TransaccionesProps {
    id: number;
    tipo: 'ingreso' | 'egreso';
    monto: number;
    categoria: string;
    fecha: string;
    metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
    descripcion: string;
    comprobante: boolean;
}

export interface CategoriasProps {
    ingreso: string[];
    egreso: string[];
}

export interface DatosSemanalesProps{
    dia: string;
    ingresos: number;
    egresos: number;
}

export type MetodosPago = 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'QR/Digital';