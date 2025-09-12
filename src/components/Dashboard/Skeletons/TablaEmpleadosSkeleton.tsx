import { Card } from '@/components/ui/card'

export const TablaEmpleadosSkeleton = () => {
  const rows = Array.from({ length: 6 })

  return (
    <Card className="card-warm border-0 overflow-hidden" aria-busy="true" aria-label="Cargando tabla de empleados">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-ui font-semibold text-foreground">Empleado / Cargo</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground">Subcategoría</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground">ALIASES</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground">Salario</th>
              <th className="text-left p-4 font-ui font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((_, idx) => (
              <tr key={idx} className="border-b border-border">
                <td className="p-4 py-12">
                  <div className="space-y-4">
                    <div className="h-4 w-40 bg-muted/70 rounded-md animate-pulse" />
                    <div className="h-3 w-28 bg-muted/60 rounded-md mt-2 animate-pulse" />
                  </div>
                </td>

                <td className="p-4">
                  <div className="h-4 w-24 bg-muted/70 rounded-md animate-pulse" />
                </td>

                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-20 bg-muted/70 rounded-full animate-pulse" />
                    <div className="h-6 w-14 bg-muted/60 rounded-full animate-pulse" />
                    <div className="h-6 w-10 bg-muted/50 rounded-full animate-pulse" />
                  </div>
                </td>

                <td className="p-4">
                  <div className="h-4 w-28 bg-muted/70 rounded-md animate-pulse" />
                </td>

                <td className="p-4">
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-muted/70 rounded-full animate-pulse" />
                    <div className="h-8 w-8 bg-muted/70 rounded-full animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}