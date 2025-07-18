export interface VentasDiariasProps{
    dia : string;
    ventas: string;
    ordenes: string;
}

export interface VentasPorCategoriaProps {
    categoria: string;
    ventas: string;
    porcentaje: string;
}

export interface TopProductosProps{
    producto: string;
    ventas: string;
    unidades: string;
}

export interface GastosPorCategoriaProps {
    categoria: string;
    monto: string;
    porcentaje: string;
}

export interface MetricasComparativasProps{
    titulo: string;
    actual: string;
    anterior: string;
    cambio: string;
    trending: 'up' | 'down';
}