import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { CardsGrid } from '../components/cards/CardsGrid'
import { Modal } from '../components/modal/Modal'
import { TitleSection } from '../components/titleSection/TitleSection'
import { httpClient } from '../../../utils/httpClient'
import { SupplierForm } from './components/SupplierForm'
import './Suplier.css'

const INITIAL_STATS = {
  totalProveedores: 0,
  proveedoresActivos: 0,
  totalPedidos: 0,
  pedidosMes: 0,
}

const buildStats = (stats) => [
  { title: 'Total Proveedores', value: String(stats.totalProveedores), subtitle: 'Registrados' },
  { title: 'Proveedores Activos', value: String(stats.proveedoresActivos), subtitle: 'Con pedidos' },
  { title: 'Pedidos Totales', value: String(stats.totalPedidos), subtitle: 'Acumulados' },
  { title: 'Pedidos Este Mes', value: String(stats.pedidosMes), subtitle: 'Órdenes realizadas' },
]

export const Suplier = () => {
  const [suppliers, setSuppliers] = useState([])
  const [stats, setStats] = useState(INITIAL_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  useEffect(() => {
    loadSuppliersPage()
  }, [])

  const loadSuppliersPage = async () => {
    setIsLoading(true)

    try {
      const [suppliersResponse, statsResponse] = await Promise.all([
        httpClient.get('/proveedores'),
        httpClient.get('/proveedores/estadisticas'),
      ])

      const rawSuppliers = suppliersResponse.data?.proveedores ?? []
      const suppliersWithOrders = await Promise.all(
        rawSuppliers.map(async (supplier) => {
          try {
            const ordersResponse = await httpClient.get(`/proveedores/${supplier.id}/pedidos`)
            return {
              ...supplier,
              totalPedidos: ordersResponse.data?.totalPedidos ?? 0,
            }
          } catch {
            return {
              ...supplier,
              totalPedidos: 0,
            }
          }
        }),
      )

      setSuppliers(suppliersWithOrders)
      setStats({
        totalProveedores: statsResponse.data?.totalProveedores ?? 0,
        proveedoresActivos: statsResponse.data?.proveedoresActivos ?? 0,
        totalPedidos: suppliersWithOrders.reduce((total, supplier) => total + supplier.totalPedidos, 0),
        pedidosMes: statsResponse.data?.pedidosMes ?? 0,
      })
    } catch (error) {
      const message =
        error?.response?.data?.msg ??
        error?.message ??
        'No fue posible cargar los proveedores.'

      await Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: message,
        confirmButtonColor: '#1E90FF',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateModal = () => {
    setSelectedSupplier(null)
    setIsFormOpen(true)
  }

  const openEditModal = (supplier) => {
    setSelectedSupplier(supplier)
    setIsFormOpen(true)
  }

  const closeFormModal = (force = false) => {
    if (!force && !isFormOpen) return
    setIsFormOpen(false)
    setSelectedSupplier(null)
  }

  const closeDetailModal = () => {
    setSelectedSupplier(null)
  }

  const handleDelete = async (supplier) => {
    const result = await Swal.fire({
      title: 'Eliminar proveedor',
      text: `Se eliminará ${supplier.nombre}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    })

    if (!result.isConfirmed) return

    try {
      await httpClient.delete(`/proveedores/${supplier.id}`)
      if (selectedSupplier?.id === supplier.id) {
        closeDetailModal()
      }

      await loadSuppliersPage()

      await Swal.fire({
        icon: 'success',
        title: 'Proveedor eliminado',
        timer: 1600,
        showConfirmButton: false,
      })
    } catch (error) {
      const message =
        error?.response?.data?.msg ??
        error?.message ??
        'No fue posible eliminar proveedor.'

      await Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: message,
        confirmButtonColor: '#1E90FF',
      })
    }
  }

  const isEditing = Boolean(isFormOpen && selectedSupplier)
  const cards = buildStats(stats)

  return (
    <>
      <TitleSection
        title="Proveedores"
        subtitle="Gestiona la información de tus proveedores"
        buttonText="Nuevo Proveedor"
        onButtonClick={openCreateModal}
      />

      <CardsGrid arrayCards={cards} />

      <div className="supplier-table-section">
        <h2>Lista de Proveedores</h2>

        <div className="supplier-table-wrapper">
          <table className="supplier-table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Pedidos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="supplier-empty-state">Cargando proveedores...</td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="supplier-empty-state">No hay proveedores registrados.</td>
                </tr>
              ) : (
                suppliers.map((supplier) => {
                  const isActive = supplier.totalPedidos > 0

                  return (
                    <tr key={supplier.id}>
                      <td>
                        <div className="supplier-info">
                          <span className="supplier-name">{supplier.nombre}</span>
                          <span className="supplier-meta">ID #{supplier.id}</span>
                        </div>
                      </td>
                      <td>{supplier.empresa || 'N/A'}</td>
                      <td>{supplier.telefono}</td>
                      <td>
                        <span className="supplier-badge supplier-badge-orders">
                          {supplier.totalPedidos} pedidos
                        </span>
                      </td>
                      <td>
                        <span className={`supplier-badge ${isActive ? 'supplier-badge-active' : 'supplier-badge-inactive'}`}>
                          {isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="supplier-actions">
                          <button
                            type="button"
                            className="supplier-action-button"
                            onClick={() => setSelectedSupplier(supplier)}
                          >
                            Ver
                          </button>
                          <button
                            type="button"
                            className="supplier-action-button"
                            onClick={() => openEditModal(supplier)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="supplier-action-button supplier-action-danger"
                            onClick={() => handleDelete(supplier)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        title={isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        onClose={closeFormModal}
        showFooter={false}
      >
        <SupplierForm
          key={selectedSupplier?.id ?? 'new'}
          isEditing={isEditing}
          supplier={selectedSupplier}
          onClose={() => closeFormModal()}
          onSuccess={async () => {
            closeFormModal(true)
            await loadSuppliersPage()
          }}
        />
      </Modal>

      <Modal
        isOpen={Boolean(selectedSupplier) && !isFormOpen}
        title="Detalle del Proveedor"
        onClose={closeDetailModal}
        showFooter={false}
      >
        {selectedSupplier ? (
          <div className="supplier-detail-grid">
            <div className="row-detail">
              <span className="label">Proveedor:</span>
              <span className="value-detail">{selectedSupplier.nombre}</span>
            </div>
            <div className="row-detail">
              <span className="label">Contacto:</span>
              <span className="value-detail">{selectedSupplier.empresa || 'N/A'}</span>
            </div>
            <div className="row-detail">
              <span className="label">Teléfono:</span>
              <span className="value-detail">{selectedSupplier.telefono}</span>
            </div>
            <div className="row-detail">
              <span className="label">Pedidos:</span>
              <span className="value-detail">{selectedSupplier.totalPedidos}</span>
            </div>
            <div className="row-detail">
              <span className="label">Estado:</span>
              <span className={`supplier-badge ${selectedSupplier.totalPedidos > 0 ? 'supplier-badge-active' : 'supplier-badge-inactive'}`}>
                {selectedSupplier.totalPedidos > 0 ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
