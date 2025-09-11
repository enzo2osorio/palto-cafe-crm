import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatCurrency";
import { useDestinatarioStore } from "@/lib/store/destinatariosStore";
import { Edit3, Trash2 } from "lucide-react"


export const TablaEmpleados = () => {
  const { destinatarios } = useDestinatarioStore();

  return (
    <Card className="card-warm border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Empleado <span className="hidden md:inline">/ Cargo de empleado</span></th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Subcategoría</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground ">ALIASES</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Salario</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {destinatarios.map((empleado) => (
                  <tr key={empleado.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-ui font-medium text-foreground">{empleado.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-ui text-foreground">{empleado.subcategory}</p>
                    </td>
                    <td className="py-4">
                     <div className="flex items-center justify-center flex-wrap max-w-64 gap-6">
                       {empleado.aliases && empleado.aliases.map((alias, index) => (
                        <span key={index} className="bg-primary/10 px-2 py-1 rounded-lg text-primary border-primary/20 font-ui w-max">
                          {alias}
                        </span>
                      ))}
                     </div>
                    </td>
                    <td className="p-4">
                      <p className="font-ui font-medium text-foreground">{formatCurrency(empleado?.individualPayment?.toString() || '')}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 cursor-pointer">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
