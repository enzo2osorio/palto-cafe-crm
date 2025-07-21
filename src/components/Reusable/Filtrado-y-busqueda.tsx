import { Input } from '@/components/ui/input'
import { SelectCustom, type Option } from '@/components/ui/SelectCustom';
import { Search } from 'lucide-react'

interface FiltroyBusquedaProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedOption: string;
    setSelectedOption: (option: string) => void;
    optionForSelect: Option[];
}

export const FiltroyBusqueda = ({ searchTerm, setSearchTerm, selectedOption, setSelectedOption, optionForSelect }: FiltroyBusquedaProps) => {

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input-background border-0 rounded-2xl font-ui"
            />
          </div>
          
            <SelectCustom
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                options={optionForSelect.map(option => ({ value: option.value, label: option.label }))}
            />
          
        </div>
      </div>
  )
}
