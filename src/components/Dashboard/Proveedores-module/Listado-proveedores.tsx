import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import type { ProveedoresProps } from '@/types/proveedores'
import { Badge, Edit3, Mail, MapPin, Phone, Trash2, User } from 'lucide-react'

interface ListadoProveedoresProps{
    filteredProveedores: ProveedoresProps[]
}

export const ListadoProveedores = ({ filteredProveedores }: ListadoProveedoresProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProveedores.map((proveedor) => (
            <Card
              key={proveedor.id}
              className="card-warm border-0 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6 space-y-4">
                {/* Header del proveedor */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-ui font-bold text-lg text-foreground">
                      {proveedor.nombre}
                    </h4>
                    <p className="font-ui text-sm text-muted-foreground">
                      RUC: {proveedor.ruc}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`${
                        proveedor.estado === "activo"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20"
                      } font-ui text-xs`}
                    >
                      {proveedor.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>

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

                {/* Información de contacto */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-ui text-sm text-foreground">
                      {proveedor.contacto}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-ui text-sm text-foreground">
                      {proveedor.telefono}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-ui text-sm text-foreground">
                      {proveedor.email}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="font-ui text-sm text-foreground">
                      {proveedor.direccion}
                    </span>
                  </div>
                </div>

                {/* Métricas del proveedor */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-xl p-3">
                    <p className="font-ui text-xs text-muted-foreground mb-1">
                      Rubro
                    </p>
                    <p className="font-ui font-semibold text-foreground">
                      {proveedor.rubro}
                    </p>
                  </div>

                  <div className="bg-muted rounded-xl p-3">
                    <p className="font-ui text-xs text-muted-foreground mb-1">
                      Última compra
                    </p>
                    <p className="font-ui font-semibold text-foreground">
                      {proveedor.ultimaCompra}
                    </p>
                  </div>
                </div>

                {/* Monto total */}
                <div className="bg-primary/5 rounded-xl p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">
                      Compras totales:
                    </span>
                    <span className="font-ui font-bold text-primary">
                      {formatCurrency(proveedor.montoTotal)}
                    </span>
                  </div>
                </div>

                {/* Observaciones */}
                {proveedor.observaciones && (
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="font-ui text-xs text-muted-foreground mb-1">
                      Observaciones
                    </p>
                    <p className="font-ui text-sm text-foreground">
                      {proveedor.observaciones}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
  )
}
