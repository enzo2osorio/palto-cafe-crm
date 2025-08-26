
import type { ProveedoresProps } from '@/types/proveedores';
import type { PaginationProveedores } from '@/utils/registros/proveedores/getAllProveedores';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProveedorStore {
    proveedores: ProveedoresProps[];
    subcategorias: string[];
    pagination: PaginationProveedores;
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    selectedRubro: string;
    setSelectedRubro: (selectedRubro: string) => void;
    setPagination: (pagination: PaginationProveedores) => void;
    setProveedores: (proveedores: ProveedoresProps[]) => void;
    setSubcategorias: (subcategorias: string[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useProveedorStore = create<ProveedorStore>()(
    persist(
        (set) => ({
            proveedores: [],
            subcategorias: [],
            pagination: {
                page: 0,
                limit: 10
            },
            searchTerm: '',
            setSearchTerm: (s: string) => set({ searchTerm: s }),
            selectedRubro: 'Todos',
            setSelectedRubro: (r: string) => set({ selectedRubro: r }),
            loading: false,
            setPagination: (pagination: PaginationProveedores) => set({ pagination }),
            setProveedores: (proveedores: ProveedoresProps[]) => set({ proveedores }),
            setSubcategorias: (subcategorias: string[]) => set({ subcategorias }),
            setLoading: (loading: boolean) => set({ loading })
        }),
        {
            name: 'proveedorStore'
        }
    )
);