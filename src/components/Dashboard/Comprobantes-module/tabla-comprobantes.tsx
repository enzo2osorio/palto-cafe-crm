import { formatCurrency } from '@/lib/formatCurrency'
import type { RegistroWithDetails } from '@/lib/store/registrosStore';
import Card from '@mui/material/Card'
import { FileText } from 'lucide-react'

interface TablaComprobantesProps {
  registros: RegistroWithDetails[];
}

export const TablaComprobantes = ({ registros }: TablaComprobantesProps) => {
  return (
    <Card className="card-warm border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Destinatario</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Subcategoría</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Origen</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Monto</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Fecha</th>
                    <th className="text-left p-4 font-ui font-semibold text-foreground">Cuenta contable</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No se encontraron comprobantes con los filtros aplicados
                      </td>
                    </tr>
                  ) : (
                    registros.map((registro) => (
                      <tr key={registro.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <p className="font-ui text-foreground">
                              {registro.destinatario_name|| 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                         <p className="font-ui text-foreground">
                            {registro.subcategoria || 'N/A'}
                            </p>
                        </td>
                        <td className="p-4">
                          <p className={` ${registro.tipo_movimiento === "egreso" ? 'bg-red-500/90 text-primary' : 'bg-sky-800 text-primary'} text-base lg:max-w-[80%] border-primary/20 font-ui p-1 px-2 rounded-lg text-center `}>
                            {registro.origen}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-ui font-semibold text-foreground">
                            {formatCurrency(registro.monto.toString())}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-ui text-foreground">
                            {new Date(registro.fecha).toLocaleDateString('es-AR')}
                          </p>
                          <p className="font-ui text-sm text-muted-foreground">
                            Subido: {new Date(registro.created_at).toLocaleDateString('es-AR')}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-ui font-semibold text-foreground lg:max-w-[80%] text-pretty">
                            {registro.cuenta_contable_name || 'N/A'}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
  )
}
