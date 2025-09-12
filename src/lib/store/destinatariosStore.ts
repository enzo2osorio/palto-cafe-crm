
import type { PaginationForDestinatarios } from '@/types/pagination';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DestinatariosProps } from '@/types/destinatarios';

export interface ProveedorStore {
    destinatarios: DestinatariosProps[];
    subcategorias: string[];
    pagination: PaginationForDestinatarios;
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    selectedRubro: string;
    setSelectedRubro: (selectedRubro: string) => void;
    setPagination: (pagination: PaginationForDestinatarios) => void;
    setDestinatarios: (proveedores: DestinatariosProps[]) => void;
    setSubcategorias: (subcategorias: string[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useDestinatarioStore = create<ProveedorStore>()(
    persist(
        (set) => ({
            destinatarios: [],
            subcategorias: [],
            pagination: {
                page: 0,
                limit: 10
            },
            searchTerm: '',
            setSearchTerm: (s: string) => set((state) => ({
            searchTerm: s,
            pagination: { ...state.pagination, page: 0 }
            })),
            selectedRubro: 'Todos',
            setSelectedRubro: (r: string) => set((state) => ({
            selectedRubro: r,
            pagination: { ...state.pagination, page: 0 }
            })),
            loading: false,
            setPagination: (pagination: PaginationForDestinatarios) => set({ pagination }),
            setDestinatarios: (destinatarios: DestinatariosProps[]) => set({ destinatarios }),
            setSubcategorias: (subcategorias: string[]) => set({ subcategorias }),
            setLoading: (loading: boolean) => set({ loading })
        }),
        {
            name: 'proveedorStore'
        }
    )
);