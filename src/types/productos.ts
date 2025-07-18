export interface ProductosProps{
    id: string;
    name: string;
    price: number;
    cost : string;
    category: string;
    soldToday: string;
    stock: string;
    imageUrl: string;
    revenue: string;
    trend: 'up' | 'down';
    trendValue: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    tags?: string[];
    ratings?: {
        average: number;
        count: number;
    };
}
