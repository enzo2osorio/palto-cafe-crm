import { useState } from 'react';
import { Plus } from 'lucide-react';
import { products } from '@/utils/productos-blank';
import { TopProductosMasVendidos } from './top-5-most-sold-products';
import { FiltroyBusqueda } from './Filtrado-y-busqueda';
import { ListadoProductos } from './Lista-productos';
import { ButtonCustom } from '@/components/ui/ButtonCustom';

export function ProductosModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorias');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas las categorias' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-ui text-lg text-muted-foreground tracking-wide">Gestión de productos</p>
          <h1 className="font-display text-4xl text-foreground">
            PRODUCTOS
          </h1>
        </div>
        
        <ButtonCustom className="button-surf text-white font-ui font-medium px-6 py-3 rounded-2xl">
          <Plus className="w-5 h-5 mr-2" />
          Agregar Producto
        </ButtonCustom>
      </div>

      <TopProductosMasVendidos/>

      <FiltroyBusqueda
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      />
      
      <ListadoProductos filteredProducts={filteredProducts} />
    </div>
  );
}