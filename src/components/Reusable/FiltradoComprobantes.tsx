import { Input } from '@/components/ui/input'
import { SelectCustom, type Option } from '@/components/ui/SelectCustom'
import { useRegistrosStore } from '@/lib/store/registrosStore'
import { getRegistrosWithFilters } from '@/utils/registros/getRegistrosWithFilters'
import { Search, Filter, Calendar, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ButtonCustom } from '@/components/ui/ButtonCustom'

interface FiltradoComprobantesProps {
  onFiltersChange?: () => void
}

export const FiltradoComprobantes = ({ onFiltersChange }: FiltradoComprobantesProps) => {
  const {
    filters,
    pagination,
    setSearchTerm,
    setTipoMovimiento,
    setOrigen,
    setFechaDesde,
    setFechaHasta,
    resetFilters,
    setRegistros,
    setTotalCount,
    setLoading
  } = useRegistrosStore()

  const timerRef = useRef<number | null>(null)
  const [localSearch, setLocalSearch] = useState(filters.searchTerm)
  const [showDateFilters, setShowDateFilters] = useState(false)

  // Opciones para los selects
  const tipoMovimientoOptions: Option[] = [
    { value: 'todos', label: '📊 Todos los tipos' },
    { value: 'ingreso', label: '💰 Ingresos' },
    { value: 'egreso', label: '💸 Egresos' }
  ]

  const origenOptions: Option[] = [
    { value: 'todos', label: '🌐 Todos los orígenes' },
    { value: 'bot', label: '🤖 Bot' },
    { value: 'fudo', label: '📱 Fudo' },
    { value: 'manual', label: '✋ Manual' }
  ]

  // Debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setSearchTerm(value)
      applyFilters(value, filters.tipoMovimiento, filters.origen)
    }, 400)
  }

  const handleTipoMovimientoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setTipoMovimiento(value)
    // Usar el valor directamente en lugar del estado que puede estar desactualizado
    applyFilters(filters.searchTerm, value, filters.origen)
  }

  const handleOrigenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setOrigen(value)
    // Usar el valor actualizado directamente
    applyFilters(filters.searchTerm, filters.tipoMovimiento, value)
  }

  const handleDateChange = (type: 'desde' | 'hasta', value: string) => {
    if (type === 'desde') {
      setFechaDesde(value || undefined)
    } else {
      setFechaHasta(value || undefined)
    }
    // Apply filters with a small delay
    setTimeout(() => {
      applyFilters(filters.searchTerm, filters.tipoMovimiento, filters.origen)
    }, 100)
  }

  const applyFilters = async (
    searchTerm: string,
    tipoMovimiento: string,
    origen: string
  ) => {
    setLoading(true)
    try {
      const currentFilters = {
        searchTerm,
        tipoMovimiento,
        origen,
        fechaDesde: filters.fechaDesde,
        fechaHasta: filters.fechaHasta
      }

      const { data, count } = await getRegistrosWithFilters(currentFilters, pagination)

      setRegistros(data)
      setTotalCount(count)
      onFiltersChange?.()
    } catch (error) {
      console.error('Error aplicando filtros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetFilters = () => {
    setLocalSearch('')
    resetFilters()
    setShowDateFilters(false)
    applyFilters('', 'todos', 'todos')
  }

  const hasActiveFilters = 
    filters.searchTerm !== '' ||
    filters.tipoMovimiento !== 'todos' ||
    filters.origen !== 'todos' ||
    filters.fechaDesde ||
    filters.fechaHasta

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Fila principal de filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Búsqueda */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre del destinatario..."
            value={localSearch}
            onChange={handleSearchChange}
            className="pl-10 bg-input-background border-0 rounded-2xl font-ui"
          />
        </div>

        {/* Filtros por tipo y origen */}
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          
          <SelectCustom
            value={filters.tipoMovimiento}
            onChange={handleTipoMovimientoChange}
            options={tipoMovimientoOptions}
            className="min-w-[160px]"
          />

          <SelectCustom
            value={filters.origen}
            onChange={handleOrigenChange}
            options={origenOptions}
            className="min-w-[160px]"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex items-center space-x-2">
          <ButtonCustom
            onClick={() => setShowDateFilters(!showDateFilters)}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <Calendar className="w-4 h-4" />
            Fechas
          </ButtonCustom>

          {hasActiveFilters && (
            <ButtonCustom
              onClick={handleResetFilters}
              className="flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20"
            >
              <X className="w-4 h-4" />
              Limpiar
            </ButtonCustom>
          )}
        </div>
      </div>

      {/* Filtros de fecha (colapsibles) */}
      {showDateFilters && (
        <div className="bg-muted/30 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Fecha desde:
              </label>
              <input
                type="date"
                value={filters.fechaDesde || ''}
                onChange={(e) => handleDateChange('desde', e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Fecha hasta:
              </label>
              <input
                type="date"
                value={filters.fechaHasta || ''}
                onChange={(e) => handleDateChange('hasta', e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {(filters.fechaDesde || filters.fechaHasta) && (
              <div className="flex items-end">
                <ButtonCustom
                  onClick={() => {
                    setFechaDesde(undefined)
                    setFechaHasta(undefined)
                    applyFilters(filters.searchTerm, filters.tipoMovimiento, filters.origen)
                  }}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  Limpiar fechas
                </ButtonCustom>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          
          {filters.searchTerm && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Búsqueda: "{filters.searchTerm}"
            </span>
          )}
          
          {filters.tipoMovimiento !== 'todos' && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Tipo: {tipoMovimientoOptions.find(o => o.value === filters.tipoMovimiento)?.label?.replace(/^📊|💰|💸/, '').trim()}
            </span>
          )}
          
          {filters.origen !== 'todos' && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Origen: {origenOptions.find(o => o.value === filters.origen)?.label?.replace(/^🌐|🤖|📱|✋/, '').trim()}
            </span>
          )}
          
          {filters.fechaDesde && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Desde: {filters.fechaDesde}
            </span>
          )}
          
          {filters.fechaHasta && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Hasta: {filters.fechaHasta}
            </span>
          )}
        </div>
      )}
    </div>
  )
}