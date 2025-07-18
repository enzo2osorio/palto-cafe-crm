export interface KPISProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}