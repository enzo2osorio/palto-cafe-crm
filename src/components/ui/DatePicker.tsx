import { Calendar } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

export const DatePicker = ({
  value,
  onChange,
  label,
  className = "",
}: DatePickerProps) => {
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('DatePicker - Fecha seleccionada:', {
      input: newValue,
      // Crear fecha local para evitar problemas de zona horaria
      localDate: (() => {
        const [year, month, day] = newValue.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      })()
    });
    onChange(newValue);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        {label}:
      </label>

      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={handleDateChange}
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />

        {/* Icono personalizado */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
