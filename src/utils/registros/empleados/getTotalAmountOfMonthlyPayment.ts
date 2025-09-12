import supabase from "@/lib/supabaseClient";
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
        const { data } = await supabase
          .from("registros")
          .select("id, destinatario_id, monto")
          .eq("destinatario_id", empleado.id)
          .gte('fecha', startISO)
          .lt('fecha', endExclusiveISO);

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

    const { data } = await supabase
      .from("registros")
      .select("id, monto")
      .eq("destinatario_id", id)
      .gte('fecha', startISO)
      .lt('fecha', endExclusiveISO);

    const individualPayment = data?.reduce((sum, payment) => sum + payment.monto, 0);

    return individualPayment;

  } catch (error) {
    console.error("error dentor de fetch destinatarios proveedores", error);
    return null;
  }
};
