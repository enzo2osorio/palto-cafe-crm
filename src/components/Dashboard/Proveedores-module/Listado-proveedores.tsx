import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useDestinatarioStore } from '@/lib/store/destinatariosStore'
import { Edit3, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDeleteModal } from '@/components/Reusable/ConfirmDeleteModal'
import { EditDestinatarioModal } from '@/components/Reusable/EditDestinatarioModal'
import { deleteDestinatarioById } from '@/utils/registros/destinatarios-GLOBAL/deleteDestinatario'
import { getDestinatariosWithAliasesAndSubcategoriasByCategoryId } from '@/utils/registros/destinatarios-GLOBAL/getDestinatarios'

export const ListadoProveedores = () => {
  const { destinatarios, setDestinatarios, pagination, searchTerm, selectedRubro, setLoading } = useDestinatarioStore()
  
  // Estados para modales
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const CATEGORIA_PROVEEDORES = '3f7dd883-6be2-47a7-92a0-8bb6cde24a3c'

  // Función para abrir modal de eliminar
  const handleDelete = (proveedor: any) => {
    setSelectedProveedor(proveedor)
    setShowDeleteModal(true)
  }

  // Función para abrir modal de editar
  const handleEdit = (proveedor: any) => {
    setSelectedProveedor(proveedor)
    setShowEditModal(true)
  }

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    if (!selectedProveedor) return

    setIsDeleting(true)
    try {
      const success = await deleteDestinatarioById(selectedProveedor.id)
      if (success) {
        // Recargar la lista de proveedores
        await refreshProveedores()
        setShowDeleteModal(false)
        setSelectedProveedor(null)
      }
    } catch (error) {
      console.error('Error eliminando proveedor:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Función para refrescar lista después de cambios
  const refreshProveedores = async () => {
    setLoading(true)
    try {
      const proveedores = await getDestinatariosWithAliasesAndSubcategoriasByCategoryId(
        CATEGORIA_PROVEEDORES, 
        pagination, 
        searchTerm, 
        selectedRubro
      )
      if (proveedores) {
        setDestinatarios(proveedores)
      }
    } catch (error) {
      console.error('Error recargando proveedores:', error)
    } finally {
      setLoading(false)
    }
  }

  // Función para manejar éxito en edición
  const handleEditSuccess = async () => {
    await refreshProveedores()
    setShowEditModal(false)
    setSelectedProveedor(null)
  }

  return (
    <>
      {/* Modales */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedProveedor(null)
        }}
        onConfirm={confirmDelete}
        destinatarioName={selectedProveedor?.name || ''}
        isLoading={isDeleting}
        type="proveedor"
      />

      <EditDestinatarioModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedProveedor(null)
        }}
        onSuccess={handleEditSuccess}
        destinatarioId={selectedProveedor?.id || ''}
        categoryId={CATEGORIA_PROVEEDORES}
        type="proveedor"
      />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {destinatarios.map((proveedor) => (
            <Card
              key={proveedor.id}
              className="card-warm border-0 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6 space-y-4">
                {/* Header del proveedor */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-ui font-bold text-lg text-foreground">
                      {proveedor.name}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="w-8 h-8 p-0"
                        onClick={() => handleEdit(proveedor)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 text-destructive"
                        onClick={() => handleDelete(proveedor)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Métricas del proveedor */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-xl p-3">
                    <p className="font-ui text-xs text-muted-foreground mb-1">
                      Rubro
                    </p>
                    <p className="font-ui font-semibold text-foreground">
                      {proveedor.subcategory}
                    </p>
                  </div>
                </div>

                {/* Monto total */}
                <div className="bg-primary/5 rounded-xl p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-sm text-foreground">
                      Aliases
                    </span>
                    <div className='flex flex-wrap gap-1'>
                      {
                        proveedor.aliases.map((alias, index) => (
                          <span key={index} className="mr-1">
                            {alias}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
    </>
  )
}
