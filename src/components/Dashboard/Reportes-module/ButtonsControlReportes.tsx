import { ButtonCustom, ButtonCustomSecondary } from "@/components/ui/ButtonCustom";
import { SelectCustom, type Option } from "@/components/ui/SelectCustom"
import { Download, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";
interface ButtonsControlReportesProps{
    selectedPeriod: string;
    setSelectedPeriod: (period: string) => void;
}

export const ButtonsControlReportes = ({selectedPeriod,setSelectedPeriod} : ButtonsControlReportesProps) => {

  const navigate = useNavigate()

    const optionsForReportes : Option[] = [
        {
            label: 'Esta semana',
            value: 'semana'
        },
        {
            label: 'Este mes',
            value: 'mes'
        },
        {
            label: 'Este trimestre',
            value: 'trimestre'
        },
        {
            label: 'Este año',
            value: 'año'
        }
    ]


  return (
    <div className="flex items-center space-x-4">
          <SelectCustom
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          options={optionsForReportes}
          >
          </SelectCustom>
          
          <ButtonCustom 
          onClick={() => {
            navigate(0)
          }}
          className="group/refresh" >
            <RefreshCw className="w-4 h-4 mr-2 group-hover/refresh:rotate-45 transition-all" />
            Actualizar
          </ButtonCustom>
          
          <ButtonCustomSecondary >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </ButtonCustomSecondary>
        </div>
  )
}
