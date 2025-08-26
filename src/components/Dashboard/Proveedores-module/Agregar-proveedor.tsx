import { ButtonCustom } from '@/components/ui/ButtonCustom';
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { registeringProveedor } from '@/lib/proveedores/registerProveedor';
import type { ProveedoresPropsWithoutId } from '@/types/proveedores';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

interface AgregarProveedorProps {
  rubros: string[];
}

export const AgregarProveedor = ({rubros}: AgregarProveedorProps) => {

  const [aliases, setAliases] = useState<string[]>([]);
  const [aliasInput, setAliasInput] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState<ProveedoresPropsWithoutId>({
     name: '',
     subcategory: '',
     aliases: []
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const newProveedor: ProveedoresPropsWithoutId = {
      ...formData,
      aliases
    };
    
    const proveedor = await registeringProveedor(newProveedor);
    if (!proveedor || proveedor.error) {
      console.error('No se registró proveedor:', proveedor);
      toast.error(proveedor?.error || 'Error al registrar proveedor');
      setLoadingSubmit(false);
      return null;
    }
    setLoadingSubmit(false);
    toast.success('Proveedor registrado con éxito');
    setFormData({
      name: '',
      subcategory: '',
      aliases: []
    });
    setAliases([]);
    setAliasInput('');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

   const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAliasInput(e.target.value);
  };

  const handleAliasKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = aliasInput.trim();
      if (!value) return;
      setAliases(prev => [...prev, value]);
      setAliasInput('');
    }
  };
  
  const handleRemoveAlias = (index: number) => {
    setAliases(prev => prev.filter((_, i) => i !== index));
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
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-input-background border-0 rounded-2xl font-ui"
                  />
                </div>

                {/* Subcategory */}
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Subcategoría</label>
                  <select 
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  className="w-full bg-input-background border-0 text-sm rounded-2xl px-4 py-2 font-ui">
                    <option className='text-muted-foreground font-body w-full border-none text-sm' value=''>Seleccionar subcategoría</option>
                    {rubros.slice(1).map((subcategory) => (
                      <option className='text-muted-foreground font-body w-full border-none text-sm' key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>               
              </div>

              {/* Aliases */}
              <div className="space-y-2 mt-10">
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex flex-col gap-2 items-start justify-between w-full'>
                  <label className="font-ui text-lg font-medium text-foreground">Alias del proveedor</label>
                <span className='font-ui '>Escribe uno a uno los alias del proveedor</span>
                </div>
                <div className='aliases-container w-full h-full '>
                  {
                    aliases.length === 0 ? (
                      <p className="">----------sin alias aún-----------</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {aliases.map((a, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="px-3 py-1 cursor-pointer rounded-full bg-muted-foreground text-sm flex items-center gap-2"
                            onClick={() => handleRemoveAlias(idx)}
                          >
                            <span>{a}</span>
                            <span className="opacity-60 text-xs">×</span>
                          </button>
                        ))}
                      </div>
                    )
                  }
                </div>
                </div>
                <Input
                placeholder="Alias"
                value={aliasInput}
                onChange={handleAliasChange}
                onKeyDown={handleAliasKeyDown}
                className="bg-input-background border-0 rounded-2xl font-ui"
              />
              </div>

              <ButtonCustom 
              disabled={loadingSubmit}
              className="disabled:bg-muted/50 disabled:cursor-not-allowed"
              type="submit">
                Registrar proveedor
              </ButtonCustom>
            </form>
          </Card>
  )
}
