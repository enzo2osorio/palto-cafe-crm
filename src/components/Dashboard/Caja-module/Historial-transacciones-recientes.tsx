import { Card } from "@/components/ui/card"
import { SelectCustom } from "@/components/ui/SelectCustom"
import { formatCurrency } from "@/lib/formatCurrency"
import { getRegistrosWithDestinatariosAndMetodoPagoAndCuentaContable, type LastRegistrosProps } from "@/utils/registros/getRegistros"
import { Filter, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useRef } from "react"

interface HistorialTransaccionesRecientesProps{
    transacciones : LastRegistrosProps[];
    filterValue: string;                          // '' | 'ingreso' | 'egreso'
  onChangeFilter: (val: string) => void;        // setter del padre
    setLast6Movements?: (movements: LastRegistrosProps[]) => void;
    setLoading6Movements?: (loading: boolean) => void;
}

export const HistorialTransaccionesRecientes = ({ transacciones, setLast6Movements, setLoading6Movements, filterValue, onChangeFilter }: HistorialTransaccionesRecientesProps) => {  
  const didMount = useRef(false);

  const options = [
    { value: '', label: 'Todas' },
    { value: 'ingreso', label: 'Ingresos' },
    { value: 'egreso', label: 'Egresos' },
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter(event.target.value);
  }

  useEffect(() => {
    if (!setLast6Movements || !setLoading6Movements) return;

    // Evita el fetch en el montaje (el padre ya trajo los datos iniciales)
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const fetchFilteredTransactions = async () => {
      setLoading6Movements(true);
      const rows = await getRegistrosWithDestinatariosAndMetodoPagoAndCuentaContable(6, filterValue);
      setLast6Movements(rows);
      setLoading6Movements(false);
    };

    fetchFilteredTransactions();
  }, [filterValue, setLast6Movements, setLoading6Movements])


  return (
    <Card className="card-warm p-6 border-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-body text-2xl text-foreground">Transacciones recientes</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <SelectCustom
            
            value={filterValue}
            onChange={handleSelectChange}
            options={options}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {transacciones.slice(0, 5).map((transaccion, index) => (
            <div key={index} className="bg-white dark:bg-accent rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaccion.tipo_movimiento === 'ingreso' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {transaccion.tipo_movimiento === 'ingreso' 
                      ? <TrendingUp className="w-6 h-6" />
                      : <TrendingDown className="w-6 h-6" />
                    }
                  </div>
                  
                  <div>
                    <h4 className="font-ui font-semibold text-foreground">{transaccion.subcategoria}</h4>
                    <p className="font-ui text-sm text-muted-foreground">{transaccion.cuentaContable}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="font-ui text-xs text-muted-foreground">{new Date(transaccion.fecha).toLocaleDateString()}</span>
                      <span className="font-ui text-xs text-muted-foreground">{transaccion.metodoPago}</span>
                      {/* {transaccion.comprobante && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Con comprobante
                        </Badge>
                      )} */}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-ui font-bold text-lg ${
                    transaccion.tipo_movimiento === 'ingreso' 
                      ? 'text-success' 
                      : 'text-destructive'
                  }`}>
                    {transaccion.tipo_movimiento === 'ingreso' ? '+' : '-'}{formatCurrency(transaccion.monto.toString())}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
  )
}
