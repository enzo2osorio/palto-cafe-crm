import type { PaginationForDestinatarios } from '@/types/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

interface PaginationProps {
  pagination: PaginationForDestinatarios
  setPagination: (pagination: PaginationForDestinatarios) => void
  destinatariosLength: number;
  loadingLength: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, setPagination, destinatariosLength, loadingLength }) => {
  return (
    <div className="flex justify-center items-center w-full h-40">
              <div className="flex justify-between gap-10 items-center px-4 py-2">
                <button 
                disabled={pagination.page === 0 || loadingLength}
                onClick={() => setPagination({page: pagination.page - 1, limit: pagination.limit})}
                className={`bg-primary/50 rounded-full w-max 
                disabled:bg-muted/50 disabled:cursor-not-allowed
                ${loadingLength ? 'opacity-50' : ''}
                h-max p-2 cursor-pointer group/leftGroup`}>
                  <ChevronLeft className="w-8 h-8 text-foreground group-hover/leftGroup:scale-110 mr-[2px] transition-all" />
                </button>
                <div>
                  <p className="font-ui text-base text-muted-foreground">
                   {loadingLength ? 'Cargando...' : `Página ${pagination.page + 1} de ${Math.ceil(destinatariosLength / pagination.limit)}`}
                  </p>
                </div>
                <button 
                disabled={pagination.page === Math.ceil(destinatariosLength / pagination.limit) - 1 || loadingLength}
                onClick={() => setPagination({page: pagination.page + 1, limit: pagination.limit})}
                className={`bg-primary/50 rounded-full w-max 
                disabled:bg-muted/50 disabled:cursor-not-allowed
                ${loadingLength ? 'opacity-50' : ''}
                h-max p-2 text-foreground cursor-pointer group/rightGroup`}>
                  <ChevronRight className="w-8 h-8 group-hover/rightGroup:scale-110 ml-[2px] transition-all" />
                </button>

              </div>
            </div>
  )
}
