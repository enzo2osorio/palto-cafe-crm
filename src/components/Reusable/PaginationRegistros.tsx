import type { PaginationForRegistros } from '@/lib/store/registrosStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface PaginationRegistrosProps {
  pagination: PaginationForRegistros
  setPagination: (pagination: PaginationForRegistros) => void
  totalCount: number
  loading: boolean
}

export const PaginationRegistros: React.FC<PaginationRegistrosProps> = ({ 
  pagination, 
  setPagination, 
  totalCount, 
  loading 
}) => {
  const totalPages = Math.ceil(totalCount / pagination.limit)
  const currentPage = pagination.page + 1 // Convert from 0-based to 1-based for display

  const canGoPrev = pagination.page > 0 && !loading
  const canGoNext = pagination.page < totalPages - 1 && !loading

  const handlePrevPage = () => {
    if (canGoPrev) {
      setPagination({ ...pagination, page: pagination.page - 1 })
    }
  }

  const handleNextPage = () => {
    if (canGoNext) {
      setPagination({ ...pagination, page: pagination.page + 1 })
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-40">
      <div className="flex justify-between gap-10 items-center px-4 py-2">
        <button 
          disabled={!canGoPrev}
          onClick={handlePrevPage}
          className={`bg-primary/50 rounded-full w-max 
          disabled:bg-muted/50 disabled:cursor-not-allowed
          ${loading ? 'opacity-50' : ''}
          h-max p-2 cursor-pointer group/leftGroup`}
        >
          <ChevronLeft className="w-8 h-8 text-foreground group-hover/leftGroup:scale-110 mr-[2px] transition-all" />
        </button>
        
        <div className="text-center">
          <p className="font-ui text-base text-muted-foreground">
            {loading ? (
              'Cargando...'
            ) : totalCount === 0 ? (
              'No hay registros'
            ) : (
              `Página ${currentPage} de ${totalPages}`
            )}
          </p>
          <p className="font-ui text-sm text-muted-foreground">
            {totalCount > 0 && !loading && (
              `${totalCount} registro${totalCount !== 1 ? 's' : ''} en total`
            )}
          </p>
        </div>
        
        <button 
          disabled={!canGoNext}
          onClick={handleNextPage}
          className={`bg-primary/50 rounded-full w-max 
          disabled:bg-muted/50 disabled:cursor-not-allowed
          ${loading ? 'opacity-50' : ''}
          h-max p-2 text-foreground cursor-pointer group/rightGroup`}
        >
          <ChevronRight className="w-8 h-8 group-hover/rightGroup:scale-110 ml-[2px] transition-all" />
        </button>
      </div>
    </div>
  )
}