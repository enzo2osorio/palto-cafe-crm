import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DateRangeSelector, type DateRangeType } from '@/components/Reusable/DateRangeSelector';
import { type CustomDateRange } from '@/utils/date/getDateRangeByType';
import { DistribucionGastosContent } from './DistribucionGastosContent';

interface DistribucionGastosProps {
  // Props futuras si se necesitan
}

export const DistribucionGastosComponent = ({}: DistribucionGastosProps = {}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>('mensual');
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange | null>(null);
  // Estados separados para las fechas del selector para evitar resets
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCustomRangeApply = (startDate: Date, endDate: Date) => {
    console.log('Distribucion-gastos - Aplicando rango personalizado:', {
      startDate: startDate.toDateString(),
      endDate: endDate.toDateString()
    });
    setLoading(true);
    setCustomDateRange({ startDate, endDate });
    // El loading se manejará en el componente hijo
    setTimeout(() => setLoading(false), 100);
  };

  const handleCustomDatesChange = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  return (
    <Card className="card-warm p-6 border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-body text-xl text-foreground">Distribución de Gastos</h3>
        <DateRangeSelector 
          value={selectedDateRange}
          onValueChange={setSelectedDateRange}
          onCustomRangeApply={handleCustomRangeApply}
          loading={loading}
          label="Período"
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomDatesChange={handleCustomDatesChange}
        />
      </div>
      
      <DistribucionGastosContent 
        selectedDateRange={selectedDateRange}
        customDateRange={customDateRange}
      />
    </Card>
  );
};
