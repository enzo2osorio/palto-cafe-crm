import { SelectCustom, type Option } from "@/components/ui/SelectCustom"

export type DateRangeType = 'semanal' | 'mensual' | 'trimestral' | 'anual'

interface DateRangeSelectorProps {
  value: DateRangeType
  onValueChange: (value: DateRangeType) => void
  label?: string
}

const options: Option[] = [
  { value: 'semanal', label: '📅 Última semana' },
  { value: 'mensual', label: '📊 Último mes' },
  { value: 'trimestral', label: '📈 Último trimestre' },
  { value: 'anual', label: '📆 Último año' }
]

export const DateRangeSelector = ({ value, onValueChange, label = "Rango de tiempo" }: DateRangeSelectorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(event.target.value as DateRangeType)
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground">
        {label}:
      </label>
      <SelectCustom 
        className="w-[180px]"
        value={value}
        onChange={handleChange}
        options={options}
      />
    </div>
  )
}