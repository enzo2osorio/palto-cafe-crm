export interface ComprobantesProps{
  id: number;
  numero: string;
  proveedor: string;
  monto: number;
  fecha: string;
  categoria: string;
  tipo: string;
  estado: string;
  archivo: string;
  fechaSubida: string;
  procesadoIA: boolean;
  observaciones: string;
}