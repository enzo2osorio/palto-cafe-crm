import { CustomCard } from '@/components/Reusable/CustomCard';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '../../ui/badge';

interface KPISCardsForInicioProps {
    kpiData: {
        title: string;
        value: string;
        change: string;
        changeMin: string;
        bgForBadge?: string;
        colorTextForBadge?: string;
        bgDarkForBadge?: string;
        colorTextDarkForBadge?: string;
        trend: 'up' | 'down';
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }[];
}

export const KPISCardsForInicio = ({ kpiData }: KPISCardsForInicioProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
           <CustomCard
             key={index}
            LeftTop={Icon}
              // RightTop={kpi.trend === 'up' ? TrendingUp : TrendingDown}
             CompleteBadge={
              <Badge className={`${kpi.bgForBadge} ${kpi.colorTextForBadge} dark:${kpi.bgDarkForBadge} dark:${kpi.colorTextDarkForBadge} font-ui font-semibold px-3 py-1 rounded-lg flex items-center`}>
      {kpi.trend === 'up' ? (
        <TrendingUp className="inline w-4 h-4 mr-1" />
      ) : (
        <TrendingDown className="inline w-4 h-4 mr-1" />
      )}
      {kpi.changeMin}
    </Badge>
             }
              titleForCard={kpi.value}
              subtitleForCard={kpi.title}
              miniDescriptionForCard={kpi.change}
           />
          );
        })}
      </div>
  )
}
