import { Card } from "@/components/ui/card"

export const TablaComprobantesSkeleton = () => {
  const rows = Array.from({ length: 6 })

  return (
    <Card className="card-warm border-0 overflow-hidden" aria-busy="true" aria-label="Cargando tabla de comprobantes">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-ui font-semibold text-foreground/70">Destinatario</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground/70">Categoría</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground/70">Subcategoría</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground/70">Monto</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground/70">Fecha</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground/70">Cuenta contable</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((_, idx) => (
              <tr key={idx} className="border-b border-border">
                <td className="p-4 py-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted/70 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-muted/70 rounded-md animate-pulse" />
                  </div>
                </td>
                
                <td className="p-4 py-6">
                  <div className="h-6 w-20 bg-muted/70 rounded-full animate-pulse" />
                </td>
                
                <td className="p-4 py-6">
                  <div className="h-6 w-24 bg-muted/70 rounded-lg animate-pulse" />
                </td>
                
                <td className="p-4 py-6">
                  <div className="h-4 w-24 bg-muted/70 rounded-md animate-pulse" />
                </td>
                
                <td className="p-4 py-6">
                  <div className="space-y-1">
                    <div className="h-4 w-20 bg-muted/70 rounded-md animate-pulse" />
                    <div className="h-3 w-28 bg-muted/60 rounded-md animate-pulse" />
                  </div>
                </td>
                
                <td className="p-4 py-6">
                  <div className="h-4 w-36 bg-muted/70 rounded-md animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}