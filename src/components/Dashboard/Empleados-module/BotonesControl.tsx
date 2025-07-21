import { ButtonCustom, ButtonCustomSecondary } from '@/components/ui/ButtonCustom'
import { Calendar, Plus } from 'lucide-react'

interface BotonesControlProps {
  setShowRegistrarForm: (show: boolean) => void;
  showRegistrarForm: boolean;
  setShowAsistenciaForm: (show: boolean) => void;
  showAsistenciaForm: boolean;
}

export const BotonesControlEmpleados = ({ setShowRegistrarForm, showRegistrarForm, setShowAsistenciaForm, showAsistenciaForm }: BotonesControlProps) => {
  return (
    <div className="flex items-center space-x-4">
          <ButtonCustomSecondary 
          disabled={showRegistrarForm}
          onClick={() =>  {
            if(!showRegistrarForm){
              setShowAsistenciaForm(!showAsistenciaForm)
            }
          }}
          className="">
          <Calendar className="w-5 h-5 mr-2" />
            {showAsistenciaForm ? 'Cancelar asistencia' : 'Registrar asistencia'}
        </ButtonCustomSecondary>
          
          <ButtonCustom 
          disabled={showAsistenciaForm}
          onClick={() => {
            if(!showAsistenciaForm){
              setShowRegistrarForm(!showRegistrarForm)
            } 
          }
          }
          className=" ">
          <Plus className="w-5 h-5 mr-2" />
          {showRegistrarForm ? 'Cancelar registro' : 'Agregar empleado'}
        </ButtonCustom>
        </div>
  )
}
