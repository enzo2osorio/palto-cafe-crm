import { X } from "lucide-react"
import { ButtonCustom } from "@/components/ui/ButtonCustom"
import { Card } from "@/components/ui/card"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  destinatarioName: string
  isLoading?: boolean
  type?: 'proveedor' | 'empleado'
}

export function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  destinatarioName, 
  isLoading = false,
  type = 'proveedor'
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  const typeText = type === 'proveedor' ? 'proveedor' : type === 'empleado' ? 'empleado' : 'destinatario'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Card className="relative w-full max-w-md mx-4 p-6 space-y-4 bg-background border shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Confirmar eliminación
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <p className="text-muted-foreground">
            ¿Estás seguro de que deseas eliminar el {typeText}:
          </p>
          <p className="text-lg font-medium text-foreground px-3 py-2 bg-muted rounded-md">
            {destinatarioName}
          </p>
          <p className="text-sm text-destructive">
            ⚠️ Esta acción no se puede deshacer. Se eliminarán también todos los aliases asociados.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <ButtonCustom
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            Cancelar
          </ButtonCustom>
          <ButtonCustom
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </ButtonCustom>
        </div>
      </Card>
    </div>
  )
}