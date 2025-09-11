
export interface TransaccionesProps {
    id: number;
    tipo_movimiento: 'ingreso' | 'egreso';
    monto: number;
    subcategoria: string;
    fecha: string;
    metodo_pago: string;
    cuenta_contable_description: string;
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