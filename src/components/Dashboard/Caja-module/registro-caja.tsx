import { ButtonCustom, ButtonCustomSecondary } from '@/components/ui/ButtonCustom';
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import type { CategoriasProps } from '@/types/caja';
import { Upload } from 'lucide-react';
import React, { useState } from 'react'

interface RegistroCajaProps {
  setShowRegistrarForm: (show: boolean) => void;
  metodosPago: string[];
  categorias : CategoriasProps;
}

export const RegistroCaja = ({ setShowRegistrarForm, metodosPago, categorias }: RegistroCajaProps) => {

    const [formData, setFormData] = useState({
    tipo: 'ingreso',
    monto: '',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
    metodoPago: 'efectivo',
    descripcion: '',
    comprobante: null as File | null
  });

const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, comprobante: file }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrar transacción:', formData);
    setShowRegistrarForm(false);
  };

    return (
    <Card className="card-warm p-6 border-0">
          <h3 className="font-body text-2xl text-foreground mb-6">Registrar nueva transacción</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Tipo de transacción</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Monto</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.monto}
                  onChange={(e) => handleInputChange('monto', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias[formData.tipo as keyof typeof categorias].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Fecha</label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  className="bg-input-background border-0 rounded-2xl font-ui"
                />
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Método de pago</label>
                <select
                  value={formData.metodoPago}
                  onChange={(e) => handleInputChange('metodoPago', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui"
                >
                  {metodosPago.map((metodo) => (
                    <option key={metodo} value={metodo.toLowerCase()}>{metodo}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Comprobante</label>
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-4 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="comprobante-upload"
                  />
                  <label
                    htmlFor="comprobante-upload"
                    className="inline-block bg-primary text-white px-4 py-2 rounded-xl font-ui cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    Subir archivo
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-ui font-medium text-foreground">Descripción</label>
              <textarea
                placeholder="Descripción de la transacción..."
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={3}
                className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui resize-none"
              />
            </div>

            <div className="flex items-center space-x-4">
              <ButtonCustom
              type='submit'
              onClick={() => {console.log("registrar transacción")}}
              >
                Registrar transacción
              </ButtonCustom>
              <ButtonCustomSecondary
                onClick={() => setShowRegistrarForm(false)}
              >
                  Cancelar
              </ButtonCustomSecondary>
            </div>
          </form>
        </Card>
  )
}
