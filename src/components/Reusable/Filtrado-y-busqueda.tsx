import { Input } from '@/components/ui/input'
import { SelectCustom } from '@/components/ui/SelectCustom';
import { useDestinatarioStore } from '@/lib/store/destinatariosStore';
import { getDestinatariosWithAliasesAndSubcategoriasByCategoryId } from '@/utils/registros/destinatarios-GLOBAL/getDestinatarios';
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';


interface FiltroyBusquedaProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setSearchTermGlobal: (term: string) => void;
    setMainStructure: (structure: any[]) => void;
    setSelectedOptionGlobal: (option: string) => void;
    optionForSelect: string[];
    categoria: string;
}

export const FiltroyBusqueda = ({ setSearchTermGlobal, setMainStructure, setSelectedOptionGlobal, optionForSelect,loading, setLoading, categoria }: FiltroyBusquedaProps) => {

  const timerRef = useRef<number | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [localRubro, setLocalRubro] = useState('Todos');
  const { pagination, setPagination, selectedRubro } = useDestinatarioStore();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const isSelect = target.tagName === 'SELECT';
    const value = target.value;

    if (isSelect) {
      setLocalRubro(value);
    } else {
      setLocalSearch(value);
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        // si viene del input -> search = value, subcat = localRubro (unless 'Todos')
        // si viene del select -> search = '', subcat = value (unless 'Todos')
        const search = isSelect ? '' : value;
        const subcatFromSelect = isSelect ? (value === 'Todos' ? '' : value) : (localRubro === 'Todos' ? '' : localRubro);

        const existingLimit = pagination.limit;
        // sincronizar filtros en el store
        setSearchTermGlobal(search);

        setSelectedOptionGlobal(subcatFromSelect);
        setPagination?.({ page: 0, limit: (existingLimit || 10) });
        const proveedores = await getDestinatariosWithAliasesAndSubcategoriasByCategoryId(categoria,{ page: 0, limit: 10 }, search, subcatFromSelect);
        if (proveedores) setMainStructure(proveedores);
      } catch (err) {
        console.error('Error buscando proveedores', err);
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setLocalRubro(selectedRubro);
  }, [selectedRubro])


  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={localSearch}
              onChange={handleSearchChange}
              className="pl-10 bg-input-background border-0 rounded-2xl font-ui"
            />
          </div>

            <SelectCustom
                disabled={loading}
                value={localRubro}
                onChange={handleSearchChange}
                options={optionForSelect.map(rubro => {
                 const label = typeof rubro === 'string' ? rubro : (rubro as any)?.name ?? String(rubro);
                 return { value: label, label };
               })}
            />

        </div>
      </div>
  )
}
