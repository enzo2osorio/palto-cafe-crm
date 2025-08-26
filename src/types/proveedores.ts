export interface ProveedoresProps{ 
    id: string;
    aliases: string[];
    name: string;
    subcategory: string;
    subcategory_id: string;
}

export type ProveedoresPropsWithoutId = Omit<ProveedoresProps, 'id' | 'subcategory_id'>;