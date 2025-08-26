import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useProveedorStore } from '@/lib/store/proovedorStore'
import type { ProveedoresProps } from '@/types/proveedores'
import { Badge, Edit3, Mail, MapPin, Phone, Trash2, User } from 'lucide-react'

export const ListadoProveedores = () => {

  const {proveedores} = useProveedorStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {proveedores.map((proveedor) => (
            <Card
              key={proveedor.id}
              className="card-warm border-0 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6 space-y-4">
                {/* Header del proveedor */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-ui font-bold text-lg text-foreground">
                      {proveedor.name}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Métricas del proveedor */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-xl p-3">
                    <p className="font-ui text-xs text-muted-foreground mb-1">
                      Rubro
                    </p>
                    <p className="font-ui font-semibold text-foreground">
                      {proveedor.subcategory}
                    </p>
                  </div>
                </div>

                {/* Monto total */}
                <div className="bg-primary/5 rounded-xl p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">
                      Aliases
                    </span>
                    <div className='flex flex-wrap gap-1'>
                      {
                        proveedor.aliases.map((alias, index) => (
                          <span key={index} className="mr-1">
                            {alias}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
  )
}
