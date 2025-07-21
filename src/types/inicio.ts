export interface KPISProps {
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
}