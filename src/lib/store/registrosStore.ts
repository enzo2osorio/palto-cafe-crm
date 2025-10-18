import { create } from 'zustand'

export interface RegistroFilter {
  searchTerm: string
  tipoMovimiento: string // 'todos', 'ingreso', 'egreso'
  origen: string // 'todos', 'bot', 'fudo', 'manual'
  fechaDesde?: string
  fechaHasta?: string
}

export interface PaginationForRegistros {
  page: number
  limit: number
}

export interface RegistroWithDetails {
  id: string
  monto: number
  tipo_movimiento: string
  origen: string
  fecha: string
  created_at: string
  destinatario_id: string
  destinatario_name: string
  subcategoria?: string
  metodo_pago_name?: string
  cuenta_contable_name?: string
}

interface RegistrosStore {
  // Estados
  registros: RegistroWithDetails[]
  loading: boolean
  totalCount: number
  
  // Filtros
  filters: RegistroFilter
  
  // Paginación
  pagination: PaginationForRegistros
  
  // Acciones
  setRegistros: (registros: RegistroWithDetails[]) => void
  setLoading: (loading: boolean) => void
  setTotalCount: (count: number) => void
  
  // Filtros
  setSearchTerm: (term: string) => void
  setTipoMovimiento: (tipo: string) => void
  setOrigen: (origen: string) => void
  setFechaDesde: (fecha?: string) => void
  setFechaHasta: (fecha?: string) => void
  resetFilters: () => void
  
  // Paginación
  setPagination: (pagination: PaginationForRegistros) => void
  nextPage: () => void
  prevPage: () => void
  
  // Utilidades
  getTotalPages: () => number
}

export const initialFilters: RegistroFilter = {
  searchTerm: '',
  tipoMovimiento: 'todos_tipos',
  origen: 'todos_origenes',
  fechaDesde: undefined,
  fechaHasta: undefined
}

const initialPagination: PaginationForRegistros = {
  page: 0,
  limit: 10
}

export const useRegistrosStore = create<RegistrosStore>((set, get) => ({
  // Estados iniciales
  registros: [],
  loading: false,
  totalCount: 0,
  filters: initialFilters,
  pagination: initialPagination,
  
  // Acciones básicas
  setRegistros: (registros) => set({ registros }),
  setLoading: (loading) => set({ loading }),
  setTotalCount: (count) => set({ totalCount: count }),
  
  // Acciones de filtros
  setSearchTerm: (term) => set((state) => ({
    filters: { ...state.filters, searchTerm: term },
    pagination: { ...state.pagination, page: 0 } // Reset page when filtering
  })),
  
  setTipoMovimiento: (tipo) => set((state) => ({
    filters: { ...state.filters, tipoMovimiento: tipo },
    pagination: { ...state.pagination, page: 0 }
  })),
  
  setOrigen: (origen) => set((state) => ({
    filters: { ...state.filters, origen },
    pagination: { ...state.pagination, page: 0 }
  })),
  
  setFechaDesde: (fecha) => set((state) => ({
    filters: { ...state.filters, fechaDesde: fecha },
    pagination: { ...state.pagination, page: 0 }
  })),
  
  setFechaHasta: (fecha) => set((state) => ({
    filters: { ...state.filters, fechaHasta: fecha },
    pagination: { ...state.pagination, page: 0 }
  })),
  
  resetFilters: () => set(() => {
    return {
      filters: initialFilters,
      pagination: initialPagination
    }
  }),
  
  // Acciones de paginación
  setPagination: (pagination) => set((state) => {
    console.log('[Store] setPagination', { from: state.pagination, to: pagination });
    return { pagination };
  }),
  
  nextPage: () => set((state) => ({
    pagination: {
      ...state.pagination,
      page: state.pagination.page + 1
    }
  })),
  
  prevPage: () => set((state) => ({
    pagination: {
      ...state.pagination,
      page: Math.max(0, state.pagination.page - 1)
    }
  })),
  
  // Utilidades
  getTotalPages: () => {
    const { totalCount, pagination } = get()
    return Math.ceil(totalCount / pagination.limit)
  }
}))