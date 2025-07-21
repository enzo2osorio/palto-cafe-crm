import { proveedores, rubros } from '@/utils/proveedores-blank';
import { KPISProveedores } from './Kpis-cards';
import { ContainerListadoProveedores } from './Container-listado-proveedores';
import { ButtonCustom } from '@/components/ui/ButtonCustom';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { AgregarProveedor } from './Agregar-proveedor';

export function ProveedoresModule() {

  const [agregarProveedor, setAgregarProveedor] = useState(false);

  const handleAgregarProveedor = () => {
    setAgregarProveedor(!agregarProveedor);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de proveedores</p>
          <h1 className="font-display text-4xl text-foreground">
            PROVEEDORES
          </h1>
        </div>
        <ButtonCustom
          onClick={handleAgregarProveedor}
          >
          {agregarProveedor ? <Minus className="w-5 h-5 mr-2"/> : <Plus className="w-5 h-5 mr-2" />}
          {agregarProveedor ? 'Cancelar' : 'Agregar proveedor'}
        </ButtonCustom>
      </div>

      {/* KPI Cards */}
     {
      !agregarProveedor ? (
        <>
         <KPISProveedores proveedores={proveedores} />

      <ContainerListadoProveedores
      proveedores={proveedores}
      rubros={rubros}
      />
        </>
      ) : (
        <AgregarProveedor
        rubros={rubros}
        />
      )
     }
      
       
    </div>
  );
}