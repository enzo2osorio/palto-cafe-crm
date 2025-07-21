import { ButtonCustom, ButtonCustomSecondary } from '@/components/ui/ButtonCustom'
import { Calendar, Plus } from 'lucide-react'

interface BotonesControlProps {
  setShowRegistrarForm: (show: boolean) => void;
  showRegistrarForm: boolean;
}

export const BotonesControl = ({ setShowRegistrarForm, showRegistrarForm }: BotonesControlProps) => {
  return (
    <div className="flex items-center space-x-4">
          <ButtonCustomSecondary 
          onClick={() => console.log('Ver historial')}
          className="">
          <Calendar className="w-5 h-5 mr-2" />
          Historial
        </ButtonCustomSecondary>
          
          <ButtonCustom 
          onClick={() => setShowRegistrarForm(!showRegistrarForm)

          }
          className=" ">
          <Plus className="w-5 h-5 mr-2" />
          {showRegistrarForm ? 'Cancelar registro' : 'Registrar transacción'}
        </ButtonCustom>
        </div>
  )
}
