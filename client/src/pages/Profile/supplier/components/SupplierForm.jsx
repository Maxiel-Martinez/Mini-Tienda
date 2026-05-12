import { useActionState, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { httpClient } from '../../../../utils/httpClient'
import { SupplierSubmitButton } from './SupplierSubmitButton'

export const SupplierForm = ({
  isEditing,
  supplier,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    nombre: supplier?.nombre ?? '',
    empresa: supplier?.empresa ?? '',
    telefono: supplier?.telefono ?? '',
  })

  const [formState, submitAction] = useActionState(async (_, submittedFormData) => {
    const payload = {
      nombre: String(submittedFormData.get('nombre') ?? '').trim(),
      empresa: String(submittedFormData.get('empresa') ?? '').trim(),
      telefono: String(submittedFormData.get('telefono') ?? '').trim(),
    }

    if (!payload.nombre || !payload.telefono) {
      return {
        error: 'Nombre y telefono son obligatorios.',
        success: '',
      }
    }

    try {
      if (supplier?.id) {
        await httpClient.put(`/proveedores/${supplier.id}`, payload)
      } else {
        await httpClient.post('/proveedores', payload)
      }

      await onSuccess()

      return {
        error: '',
        success: supplier?.id ? 'Proveedor actualizado.' : 'Proveedor creado.',
      }
    } catch (error) {
      return {
        error:
          error?.response?.data?.msg ??
          error?.message ??
          'No fue posible guardar proveedor.',
        success: '',
      }
    }
  }, {
    error: '',
    success: '',
  })

  useEffect(() => {
    if (!formState.success) return

    Swal.fire({
      icon: 'success',
      title: formState.success,
      timer: 1800,
      showConfirmButton: false,
    })
  }, [formState.success])

  const handleInputChange = ({ target }) => {
    const { name, value } = target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  return (
    <form id="supplier-form" className="supplier-form" action={submitAction}>
      <div className="form-group">
        <label htmlFor="supplier-name">Nombre del Proveedor *</label>
        <input
          id="supplier-name"
          className="form-input"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          placeholder="Nombre de la empresa"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="supplier-contact">Persona de Contacto</label>
        <input
          id="supplier-contact"
          className="form-input"
          type="text"
          name="empresa"
          value={formData.empresa}
          onChange={handleInputChange}
          placeholder="Nombre del contacto"
        />
      </div>

      <div className="form-group">
        <label htmlFor="supplier-phone">Teléfono *</label>
        <input
          id="supplier-phone"
          className="form-input"
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          placeholder="+57 300 123 4567"
          required
        />
      </div>

      {formState.error ? <p className="supplier-form-message supplier-form-error" role="alert">{formState.error}</p> : null}

      <div className="supplier-form-actions">
        <button type="button" className="btn-cancelar" onClick={onClose}>
          Cancelar
        </button>
        <SupplierSubmitButton isEditing={isEditing} />
      </div>
    </form>
  )
}
