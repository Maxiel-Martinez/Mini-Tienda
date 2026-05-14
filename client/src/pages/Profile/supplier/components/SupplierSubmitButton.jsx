import { useFormStatus } from 'react-dom'

export const SupplierSubmitButton = ({ isEditing }) => {
  const { pending } = useFormStatus()

  return (
    <button type="submit" className="btn-aceptar" disabled={pending}>
      {pending ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Proveedor'}
    </button>
  )
}
