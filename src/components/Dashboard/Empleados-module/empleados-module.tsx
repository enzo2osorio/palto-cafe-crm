import { useState } from 'react';
import { empleados, cargos, turnos} from '@/utils/empleados-blank';
import { KPISForEmpleados } from './KPISForEmpleados';
import { BotonesControlEmpleados } from './BotonesControl';
import { RegistrarAsistencia } from './Registrar-asistencia';
import { AgregarEmpleado } from './Agregar-empleado';
import { FiltroyBusqueda } from '@/components/Reusable/Filtrado-y-busqueda';
import { TablaEmpleados } from './Tabla-empleados';

export function EmpleadosModule() {
  const [showAgregarForm, setShowAgregarForm] = useState(false);
  const [showAsistencia, setShowAsistencia] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCargo, setSelectedCargo] = useState('Todos los cargos');
    


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de personal</p>
          <h1 className="font-display text-4xl text-foreground">
            EMPLEADOS
          </h1>
        </div>
        
        <BotonesControlEmpleados
          setShowAsistenciaForm={setShowAsistencia}
          showAsistenciaForm={showAsistencia}
          setShowRegistrarForm={setShowAgregarForm}
          showRegistrarForm={showAgregarForm}
        />
      </div>

      {/* KPI Cards */}
      {(!showAsistencia && !showAgregarForm) && (
  <KPISForEmpleados empleados={empleados} />
      )}

      {/* Formulario de agregar empleado (condicional) */}
      {showAgregarForm && (
        <AgregarEmpleado
        cargos={cargos}
        setShowAgregarForm={setShowAgregarForm}
        turnos={turnos}
        />
      )}

      {/* Control de asistencia (condicional) */}
      {showAsistencia && (
       <RegistrarAsistencia
        empleados={empleados}
        />
      )}

      {/* Filtros y búsqueda */}
      {!showAgregarForm && !showAsistencia && (
        <FiltroyBusqueda
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedOption={selectedCargo}
          setSelectedOption={setSelectedCargo}
          optionForSelect={[
            ...cargos.map(cargo => ({ value: cargo, label: cargo }))
          ]}
        />
        
      )}

      {/* Tabla de empleados */}
      {!showAgregarForm && !showAsistencia && (
        <TablaEmpleados
          empleados={empleados}
          searchTerm={searchTerm}
          selectedCargo={selectedCargo}
        />
      )}
    </div>
  );
}