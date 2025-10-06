import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ButtonCustom } from "@/components/ui/ButtonCustom"
import { X, Save, User, Tag } from "lucide-react"
import { getDestinatarioWithAliasesById, updateDestinatarioComplete } from "@/utils/registros/destinatarios-GLOBAL/updateDestinatario"
import { getAllSubcategoriasOfDestinatarios } from "@/utils/registros/subcategorias/getAllSubcategoriasOfDestinatarios"
import { SelectCustom, type Option } from "@/components/ui/SelectCustom"

interface EditDestinatarioModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  destinatarioId: string
  categoryId: string
  type?: 'proveedor' | 'empleado'
}

interface DestinatarioData {
  id: string
  name: string
  subcategory_id: string
  description: string | null
  destinatario_aliases: { id: string; alias: string }[]
  subcategorias: { name: string }[]
}

export function EditDestinatarioModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  destinatarioId, 
  categoryId,
  type = 'proveedor'
}: EditDestinatarioModalProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [destinatarioData, setDestinatarioData] = useState<DestinatarioData | null>(null)
  const [subcategorias, setSubcategorias] = useState<Option[]>([])
  
  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [aliases, setAliases] = useState<string[]>([])

  const typeText = type === 'proveedor' ? 'proveedor' : 'empleado'

  useEffect(() => {
    if (!isOpen || !destinatarioId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [destinatario, subcats] = await Promise.all([
          getDestinatarioWithAliasesById(destinatarioId),
          getAllSubcategoriasOfDestinatarios(categoryId)
        ])

        if (destinatario) {
          setDestinatarioData(destinatario as DestinatarioData)
          setName(destinatario.name)
          setDescription(destinatario.description || '')
          setSelectedSubcategory(destinatario.subcategory_id)
          setAliases(destinatario.destinatario_aliases.map(alias => alias.alias))
        }

        if (subcats) {
          const subcatOptions: Option[] = subcats.map((subcat: { id: string; name: string }) => ({
            value: subcat.id,
            label: subcat.name
          }))
          setSubcategorias(subcatOptions)
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isOpen, destinatarioId, categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destinatarioData || !name.trim()) return

    setSaving(true)
    try {
      const success = await updateDestinatarioComplete(
        destinatarioId,
        {
          name: name.trim(),
          subcategory_id: selectedSubcategory,
          description: description.trim() || undefined
        },
        aliases.filter(alias => alias.trim().length > 0)
      )

      if (success) {
        onSuccess()
        onClose()
      } else {
        console.error('Error actualizando destinatario')
      }
    } catch (error) {
      console.error('Error actualizando destinatario:', error)
    } finally {
      setSaving(false)
    }
  }

  const addAlias = () => {
    setAliases([...aliases, ''])
  }

  const updateAlias = (index: number, value: string) => {
    const newAliases = [...aliases]
    newAliases[index] = value
    setAliases(newAliases)
  }

  const removeAlias = (index: number) => {
    setAliases(aliases.filter((_, i) => i !== index))
  }

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border shadow-lg">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Editar {typeText}
              </h2>
              <p className="text-sm text-muted-foreground">
                {destinatarioData?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre del {typeText} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder={`Nombre del ${typeText}`}
                required
              />
            </div>

            {/* Subcategoría */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Subcategoría
              </label>
              <SelectCustom
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                options={subcategorias}
                className="w-full"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                rows={3}
                placeholder="Descripción opcional"
              />
            </div>

            {/* Aliases */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Aliases
                </label>
                <ButtonCustom
                  type="button"
                  onClick={addAlias}
                  className="text-sm px-3 py-1"
                >
                  + Agregar alias
                </ButtonCustom>
              </div>
              
              {aliases.length > 0 && (
                <div className="space-y-2">
                  {aliases.map((alias, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={alias}
                        onChange={(e) => updateAlias(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        placeholder="Alias"
                      />
                      <button
                        type="button"
                        onClick={() => removeAlias(index)}
                        className="text-destructive hover:text-destructive/80 p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <ButtonCustom
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              >
                Cancelar
              </ButtonCustom>
              <ButtonCustom
                type="submit"
                disabled={saving || !name.trim()}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </ButtonCustom>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}