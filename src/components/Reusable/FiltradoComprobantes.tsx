import { Input } from '@/components/ui/input'
import { SelectCustom, type Option } from '@/components/ui/SelectCustom'
import { initialFilters, useRegistrosStore, type RegistroFilter } from '@/lib/store/registrosStore'
import { Search, Filter, Calendar, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ButtonCustom } from '@/components/ui/ButtonCustom'
import { CustomDatePicker } from './ReusableDatePicker'
import { getRegistrosWithFilters } from '@/utils/registros/getRegistrosWithFilters'


export const FiltradoComprobantes = () => {
  const { setRegistros, resetFilters, setTotalCount } = useRegistrosStore()

  const timerRef = useRef<number | null>(null)
  const [showDateFilters, setShowDateFilters] = useState(false)
  const [destinatarioSearch, setDestinatarioSearch] = useState('')
  const [filtersSelected, setFiltersSelected] = useState<RegistroFilter>({ ...initialFilters })
  // Estados locales para las fechas
  const [localFechaDesde, setLocalFechaDesde] = useState<string>(initialFilters.fechaDesde ?? '')
  const [localFechaHasta, setLocalFechaHasta] = useState<string>(initialFilters.fechaHasta ?? '')

  // Opciones para los selects
  const tipoMovimientoOptions: Option[] = [
    { value: 'todos_tipos', label: '📊 Todos los tipos' },
    { value: 'ingreso', label: '💰 Ingresos' },
    { value: 'egreso', label: '💸 Egresos' }
  ]

  const origenOptions: Option[] = [
    { value: 'todos_origenes', label: '🌐 Todos los orígenes' },
    { value: 'bot', label: '🤖 Bot' },
    { value: 'fudo', label: '📱 Fudo' },
  ]

  // Actualiza parcialmente los filtros sin resetear los demás
  const applyFilters = (updates: Partial<RegistroFilter>) => {
    setFiltersSelected((prev) => {
      const next = { ...prev, ...updates }
      return next
    })
  }

  useEffect(() => {
    const fetchFilteredRegistros = async () => { 
      const registrosWithFilters = await getRegistrosWithFilters(filtersSelected, { page: 0, limit: 10 })
      setRegistros(registrosWithFilters.data)
      setTotalCount(registrosWithFilters.count)
    }
    fetchFilteredRegistros()
  }, [filtersSelected, setRegistros, setTotalCount])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDestinatarioSearch(value)
  }

  useEffect(() => {
    timerRef.current && clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      applyFilters({ searchTerm: destinatarioSearch })
    }, 500)
  }, [destinatarioSearch])

  const handleTipoMovimientoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    applyFilters({ tipoMovimiento: value })
  }

  const handleOrigenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    applyFilters({ origen: value })
  }

  
  const handleApplyDateFilters = () => {
    applyFilters({
      fechaDesde: localFechaDesde || undefined,
      fechaHasta: localFechaHasta || undefined
    })
  }


  const handleResetFilters = () => {
    setDestinatarioSearch('')
    setLocalFechaDesde('')
    setLocalFechaHasta('')
    resetFilters()
    setShowDateFilters(false)
    setFiltersSelected({ ...initialFilters })
  }

  const hasActiveFilters =
    (filtersSelected.searchTerm?.trim?.() || '') !== '' ||
    filtersSelected.tipoMovimiento !== 'todos_tipos' ||
    filtersSelected.origen !== 'todos_origenes' ||
    !!filtersSelected.fechaDesde ||
    !!filtersSelected.fechaHasta

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])



  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre del destinatario..."
            value={destinatarioSearch}
            onChange={handleSearchChange}
            className="pl-10 bg-input-background border-0 rounded-2xl font-ui"
          />
        </div>

        {/* Filtros por tipo y origen */}
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          
          <SelectCustom
            value={filtersSelected.tipoMovimiento}
            onChange={handleTipoMovimientoChange}
            options={tipoMovimientoOptions}
            className="min-w-[160px]"
          />

          <SelectCustom
            value={filtersSelected.origen}
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
             <CustomDatePicker
               label="Fecha desde:"
               localDate={localFechaDesde}
               setLocalDate={setLocalFechaDesde}
             />
            <CustomDatePicker
             label="Fecha hasta:"
             localDate={localFechaHasta}
             setLocalDate={setLocalFechaHasta}
            />
            <div className="flex items-end space-x-2">
              <ButtonCustom
                onClick={handleApplyDateFilters}
                className="bg-primary px-4 hover:bg-primary/90 text-primary-foreground"
              >
                Filtrar
              </ButtonCustom>

              {(localFechaDesde || localFechaHasta) && (
                <ButtonCustom
                  onClick={() => {
                    setLocalFechaDesde('')
                    setLocalFechaHasta('')
                    applyFilters({ fechaDesde: undefined, fechaHasta: undefined })
                  }}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  Limpiar fechas
                </ButtonCustom>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          
          {filtersSelected.searchTerm && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Búsqueda: "{filtersSelected.searchTerm}"
            </span>
          )}
          
          {filtersSelected.tipoMovimiento !== 'todos_tipos' && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Tipo: {tipoMovimientoOptions.find(o => o.value === filtersSelected.tipoMovimiento)?.label?.replace(/^📊|💰|💸/, '').trim()}
            </span>
          )}
          
          {filtersSelected.origen !== 'todos_origenes' && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Origen: {origenOptions.find(o => o.value === filtersSelected.origen)?.label?.replace(/^🌐|🤖|📱/, '').trim()}
            </span>
          )}
          
          {filtersSelected.fechaDesde && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Desde: {filtersSelected.fechaDesde}
            </span>
          )}
          
          {filtersSelected.fechaHasta && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              Hasta: {filtersSelected.fechaHasta}
            </span>
          )}
        </div>
      )}
    </div>
  )
}