import { SelectCustom, type Option } from "@/components/ui/SelectCustom"
import { DatePicker } from "@/components/ui/DatePicker"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"

export type DateRangeType = 'semanal' | 'mensual' | 'trimestral' | 'anual' | 'personalizado'

interface DateRangeSelectorProps {
  value: DateRangeType
  onValueChange: (value: DateRangeType) => void
  label?: string
  onCustomRangeApply?: (startDate: Date, endDate: Date) => void
  loading?: boolean
  // Props para mantener el estado de fechas personalizadas
  customStartDate?: string
  customEndDate?: string
  onCustomDatesChange?: (startDate: string, endDate: string) => void
}

const options: Option[] = [
  { value: 'semanal', label: '📅 Última semana' },
  { value: 'mensual', label: '📊 Último mes' },
  { value: 'trimestral', label: '📈 Último trimestre' },
  { value: 'anual', label: '📆 Último año' },
  { value: 'personalizado', label: '🗓️ Rango personalizado' }
]

export const DateRangeSelector = ({ 
  value, 
  onValueChange, 
  label = "Rango de tiempo",
  onCustomRangeApply,
  loading = false,
  customStartDate,
  customEndDate,
  onCustomDatesChange
}: DateRangeSelectorProps) => {
  // Función para formatear fecha local sin problemas de zona horaria
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Establecer fechas por defecto para el rango personalizado
  const getDefaultDates = () => {
    const today = new Date()
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(today.getMonth() - 1)
    return {
      start: formatLocalDate(oneMonthAgo),
      end: formatLocalDate(today)
    }
  }

  const defaults = getDefaultDates()

  // Usar fechas controladas desde el componente padre si están disponibles
  const [startDate, setStartDate] = useState<string>(customStartDate || defaults.start)
  const [endDate, setEndDate] = useState<string>(customEndDate || defaults.end)

  // Sincronizar con props externas cuando cambien
  useEffect(() => {
    if (customStartDate && customStartDate !== startDate) {
      setStartDate(customStartDate)
    }
    if (customEndDate && customEndDate !== endDate) {
      setEndDate(customEndDate)
    }
  }, [customStartDate, customEndDate])

  // Función para manejar cambios de fechas y notificar al padre
  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate)
    if (onCustomDatesChange) {
      onCustomDatesChange(newStartDate, endDate)
    }
  }

  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate)
    if (onCustomDatesChange) {
      onCustomDatesChange(startDate, newEndDate)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as DateRangeType
    onValueChange(newValue)
    
    // Solo resetear las fechas si NO tenemos control externo y cambiamos de personalizado
    if (newValue !== 'personalizado' && !customStartDate && !customEndDate) {
      const defaults = getDefaultDates()
      setStartDate(defaults.start)
      setEndDate(defaults.end)
      if (onCustomDatesChange) {
        onCustomDatesChange(defaults.start, defaults.end)
      }
    }
  }

  const handleApplyCustomRange = () => {
    console.log('Aplicando rango personalizado:', { startDate, endDate });
    
    if (startDate && endDate && onCustomRangeApply) {
      // Crear fechas locales sin problemas de zona horaria
      const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
      const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
      
      const start = new Date(startYear, startMonth - 1, startDay);
      const end = new Date(endYear, endMonth - 1, endDay);
      
      console.log('Fechas convertidas:', {
        start: start.toDateString(),
        end: end.toDateString()
      });
      
      // Validar que la fecha de inicio sea anterior a la fecha de fin
      if (start > end) {
        alert('La fecha de inicio debe ser anterior a la fecha de fin');
        return;
      }
      
      onCustomRangeApply(start, end);
    }
  }

  const isValidDateRange = startDate && endDate && new Date(startDate) <= new Date(endDate)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          {label}:
        </label>
        <SelectCustom 
          className="w-[200px]"
          value={value}
          onChange={handleChange}
          options={options}
        />
      </div>
      
      {value === 'personalizado' && (
        <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
          <div className="flex items-end gap-3 flex-wrap">
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              label="Desde"
              className="min-w-[140px]"
            />
            
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              label="Hasta"
              className="min-w-[140px]"
            />
            
            <Button
              onClick={handleApplyCustomRange}
              disabled={!isValidDateRange || loading}
              size="sm"
              className="h-[42px] px-4 gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Filtrando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Filtrar
                </>
              )}
            </Button>
          </div>
          
          {!isValidDateRange && startDate && endDate && (
            <div className="mt-2 text-xs text-destructive">
              La fecha de inicio debe ser anterior a la fecha de fin
            </div>
          )}
          
          <div className="mt-2 text-xs text-muted-foreground">
            💡 Selecciona las fechas y presiona "Filtrar" para aplicar el rango personalizado
          </div>
        </div>
      )}
    </div>
  )
}