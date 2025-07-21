import { ButtonCustom } from '@/components/ui/ButtonCustom';
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import type { ProveedoresPropsWithoutId } from '@/types/proveedores';
import React, { useState } from 'react'

interface AgregarProveedorProps {
  rubros: string[];
}

export const AgregarProveedor = ({rubros}: AgregarProveedorProps) => {

const [formData, setFormData] = useState<ProveedoresPropsWithoutId>({
    nombre: '',
    ruc: '',
    rubro: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    estado: 'activo',
    observaciones: '',
    ultimaCompra: '',
    montoTotal: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrar proveedor:', formData);
    // Aquí iría la lógica para guardar el proveedor
  };

  return (
          <Card className="card-warm p-6 border-0">
            <h3 className="font-body text-2xl text-foreground mb-6">Registrar nuevo proveedor</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Nombre de la empresa</label>
                  <Input
                    placeholder="Nombre del proveedor"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* RUC */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">RUC</label>
                  <Input
                    placeholder="12.345.678-9"
                    value={formData.ruc}
                    onChange={(e) => handleInputChange('ruc', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* Rubro */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Rubro</label>
                  <select
                    value={formData.rubro}
                    onChange={(e) => handleInputChange('rubro', e.target.value)}
                    className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                  >
                    <option value="">Seleccionar rubro</option>
                    {rubros.slice(1).map((rubro) => (
                      <option key={rubro} value={rubro}>{rubro}</option>
                    ))}
                  </select>
                </div>

                {/* Contacto */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Persona de contacto</label>
                  <Input
                    placeholder="Nombre del contacto"
                    value={formData.contacto}
                    onChange={(e) => handleInputChange('contacto', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Teléfono</label>
                  <Input
                    placeholder="+56 9 1234 5678"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="contacto@proveedor.cl"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Dirección</label>
                <Input
                  placeholder="Dirección completa"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              {/* Observaciones */}
              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Observaciones</label>
                <textarea
                  placeholder="Notas adicionales sobre el proveedor..."
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  rows={3}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui resize-none"
                />
              </div>
              <ButtonCustom type="submit">
                Registrar proveedor
              </ButtonCustom>
            </form>
          </Card>
  )
}
