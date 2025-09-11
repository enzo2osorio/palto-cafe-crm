export interface DestinatariosProps{ 
    id: string;
    aliases: string[];
    name: string;
    subcategory: string;
    subcategory_id?: string;
    individualPayment?: number;
}

export type DestinatariosPropsWithoutIdAndSubcategoryId = Omit<DestinatariosProps, 'id' | 'subcategory_id'>;