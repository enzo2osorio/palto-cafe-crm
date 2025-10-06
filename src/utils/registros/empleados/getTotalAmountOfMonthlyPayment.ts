import { getDestinatariosByCategoryId } from "../destinatarios-GLOBAL/getDestinatarios";
import { getLastMonth } from "@/utils/date/getLastMonth";

export const getActualMonthlyPayAmountOfEachEmployee = async () => {
  try {
    const empleados = await getDestinatariosByCategoryId(
      import.meta.env.VITE_CATEGORIA_EMPLEADOS_UUID as string
    );
    if (!empleados) {
      console.error("no existen empleados");
      return;
    }

    const { startISO, endExclusiveISO} = getLastMonth()

    const empleadosStructure = await Promise.all(
      empleados.map(async (empleado) => {
        // Usar paginación optimizada
        const { getAllRegistros } = await import('../paginationHelper');
        
        const data = await getAllRegistros(
          {
            fechaDesde: startISO,
            fechaHasta: endExclusiveISO,
            destinatarioIds: [empleado.id]
          },
          {
            campos: 'id, destinatario_id, monto',
            batchSize: 1000,
            logProgress: false
          }
        ).catch(error => {
          console.error('Error fetching empleado registros:', error);
          return [];
        });

        const individualPayment = data?.reduce((sum, payment) => sum + payment.monto, 0);

        const empleadoStructure = {
            id: empleado.id,
            name: empleado.name,
            individualPayment,
        }
        return empleadoStructure;
      }
  )
);

    if (!empleadosStructure) {
      console.error("No se encontraron empleados");
      return null;
    }

    return empleadosStructure;    

  } catch (error) {
    console.error("error dentor de fetch destinatarios proveedores", error);
    return null;
  }
};


export const getActualMonthlyPayAmountOfEachEmployeeGivenEmployeeId = async (id: string) => {
  try {

    const { startISO, endExclusiveISO} = getLastMonth()

    // Usar paginación optimizada
    const { getAllRegistros } = await import('../paginationHelper');
    
    const data = await getAllRegistros(
      {
        fechaDesde: startISO,
        fechaHasta: endExclusiveISO,
        destinatarioIds: [id]
      },
      {
        campos: 'id, monto',
        batchSize: 1000,
        logProgress: false
      }
    ).catch(error => {
      console.error('Error fetching empleado registros:', error);
      return [];
    });

    const individualPayment = data?.reduce((sum, payment) => sum + payment.monto, 0);

    return individualPayment;

  } catch (error) {
    console.error("error dentor de fetch destinatarios proveedores", error);
    return null;
  }
};
