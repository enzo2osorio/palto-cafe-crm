import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatCurrency";
import { useDestinatarioStore } from "@/lib/store/destinatariosStore";
import { Edit3, Trash2 } from "lucide-react"
import { useState } from 'react'
import { ConfirmDeleteModal } from '@/components/Reusable/ConfirmDeleteModal'
import { EditDestinatarioModal } from '@/components/Reusable/EditDestinatarioModal'
import { deleteDestinatarioById } from '@/utils/registros/destinatarios-GLOBAL/deleteDestinatario'
import { getDestinatariosWithAliasesAndSubcategoriasByCategoryId } from '@/utils/registros/destinatarios-GLOBAL/getDestinatarios'

export const TablaEmpleados = () => {
  const { destinatarios, setDestinatarios, pagination, searchTerm, selectedRubro, setLoading } = useDestinatarioStore()
  
  // Estados para modales
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmpleado, setSelectedEmpleado] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const CATEGORIA_EMPLEADOS = import.meta.env.VITE_CATEGORIA_EMPLEADOS_UUID as string

  // Función para abrir modal de eliminar
  const handleDelete = (empleado: any) => {
    setSelectedEmpleado(empleado)
    setShowDeleteModal(true)
  }

  // Función para abrir modal de editar
  const handleEdit = (empleado: any) => {
    setSelectedEmpleado(empleado)
    setShowEditModal(true)
  }

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    if (!selectedEmpleado) return

    setIsDeleting(true)
    try {
      const success = await deleteDestinatarioById(selectedEmpleado.id)
      if (success) {
        // Recargar la lista de empleados
        await refreshEmpleados()
        setShowDeleteModal(false)
        setSelectedEmpleado(null)
      }
    } catch (error) {
      console.error('Error eliminando empleado:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Función para refrescar lista después de cambios
  const refreshEmpleados = async () => {
    setLoading(true)
    try {
      const empleados = await getDestinatariosWithAliasesAndSubcategoriasByCategoryId(
        CATEGORIA_EMPLEADOS, 
        pagination, 
        searchTerm, 
        selectedRubro
      )
      if (empleados) {
        setDestinatarios(empleados)
      }
    } catch (error) {
      console.error('Error recargando empleados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Función para manejar éxito en edición
  const handleEditSuccess = async () => {
    await refreshEmpleados()
    setShowEditModal(false)
    setSelectedEmpleado(null)
  }

  return (
    <>
      {/* Modales */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedEmpleado(null)
        }}
        onConfirm={confirmDelete}
        destinatarioName={selectedEmpleado?.name || ''}
        isLoading={isDeleting}
        type="empleado"
      />

      <EditDestinatarioModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedEmpleado(null)
        }}
        onSuccess={handleEditSuccess}
        destinatarioId={selectedEmpleado?.id || ''}
        categoryId={CATEGORIA_EMPLEADOS}
        type="empleado"
      />

      <Card className="card-warm border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Empleado <span className="hidden md:inline">/ Cargo de empleado</span></th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Subcategoría</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground ">ALIASES</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Salario</th>
                  <th className="text-left p-4 font-ui font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {destinatarios.map((empleado) => (
                  <tr key={empleado.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-ui font-medium text-foreground">{empleado.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-ui text-foreground">{empleado.subcategory}</p>
                    </td>
                    <td className="py-4">
                     <div className="flex items-center justify-center flex-wrap max-w-64 gap-6">
                       {empleado.aliases && empleado.aliases.map((alias, index) => (
                        <span key={index} className="bg-primary/10 px-2 py-1 rounded-lg text-primary border-primary/20 font-ui w-max">
                          {alias}
                        </span>
                      ))}
                     </div>
                    </td>
                    <td className="p-4">
                      <p className="font-ui font-medium text-foreground">{formatCurrency(empleado?.individualPayment?.toString() || '')}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="w-8 h-8 p-0 cursor-pointer"
                          onClick={() => handleEdit(empleado)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="w-8 h-8 p-0 text-destructive cursor-pointer"
                          onClick={() => handleDelete(empleado)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
    </>
  )
}
