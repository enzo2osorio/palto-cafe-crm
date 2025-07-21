import { useState } from 'react';
import { categorias, transacciones, datosSemanales, metodosPago } from '@/utils/caja-blank';
import { KPISForCaja } from './KPISForCaja';
import { FlujoCajaSemanal } from './Flujo-caja-semanal';
import { HistorialTransaccionesRecientes } from './Historial-transacciones-recientes';
import { BotonesControl } from './Botones-historial-registro';
import { RegistroCaja } from './registro-caja';

export function CajaModule() {
  const [showRegistrarForm, setShowRegistrarForm] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de caja</p>
          <h1 className="font-display text-4xl text-foreground">
            CAJA - <span className="text-primary">INGRESOS & EGRESOS</span>
          </h1>
        </div>
        <BotonesControl
        setShowRegistrarForm={setShowRegistrarForm}
        showRegistrarForm={showRegistrarForm}
        />
      </div>
      {/* KPI Cards */}
      {!showRegistrarForm && (
      <KPISForCaja
      transacciones={transacciones}
      />
      )}
      {/* Formulario de registro (condicional) */}
      {showRegistrarForm && (
        <RegistroCaja
        categorias={categorias}
        setShowRegistrarForm={setShowRegistrarForm}
        metodosPago={metodosPago}
        />
      )}

      {/* Gráfico de flujo semanal */}
      {!showRegistrarForm && (
        <FlujoCajaSemanal
      datosSemanales={datosSemanales}
      />
      )}
      {/* Historial de transacciones recientes */}
      {
        !showRegistrarForm && (
        <HistorialTransaccionesRecientes
      transacciones={transacciones}
      />
        )
      }
    </div>
  );
}