import { CardsGrid } from "../components/cards/CardsGrid";
import { Modal } from "../components/modal/Modal";
import { TitleSection } from "../components/titleSection/TitleSection";
import './Orders.css';

const stats = [
  { title: "Pedidos Pendientes", value: "0", subtitle: "Por recibir" },
  { title: "Entregados Hoy", value: "0", subtitle: "Recibidos" },
  { title: "Total Mes", value: "$0", subtitle: "En pedidos" },
];
export const Orders = () => {
  return (
    <>
      <TitleSection title="Pedidos" subtitle="Gestiona las órdenes de compra a tus proveedores" buttonText="Nuevo Pedido" />
      <CardsGrid arrayCards={stats} />

      <div className="table-orders-container">
        <h2>Historial de Pedidos</h2>

        <table className="table-orders">
          <thead>
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>Fecha Pedido</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="table-orders-body"></tbody>
        </table>
      </div>

      <Modal
        isOpen={false}
        title="Nuevo Pedido"
        confirmText="Crear Pedido"
      >
        <form id="formNuevoPedido" className="" encType="multipart/form-data">
          <section className="first-section">
            <h3 className="section-title">Información del Pedido</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="proveedor">Proveedor</label>
                <select className="form-select" id="proveedor" name="proveedor" required>
                  <option value="">Seleccionar proveedor</option>
                </select>
              </div>
            </div>
          </section>

          <section className="second-section">
            <h3 className="section-title">Producto del Pedido</h3>

            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-input"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Laptop HP Pavilion"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  id="descripcion"
                  name="descripcion"
                  placeholder="Describe las características del producto..."
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="categoria_id">Categoría</label>
                <select className="form-select" id="categoria_id" name="categoria_id" required>
                  <option value="">Seleccionar categoría</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="precio">Precio Unitario</label>
                <input
                  type="number"
                  className="form-input"
                  id="precio"
                  name="precio"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Cantidad</label>
                <input
                  type="number"
                  className="form-input"
                  id="stock"
                  name="stock"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="imagen">Imagen del Producto</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="imagen"
                    name="image"
                    className="file-input"
                    accept="image/*"
                  />
                  <label htmlFor="imagen" className="file-label">
                    <span className="file-icon">📁</span>
                    <span className="file-text">Seleccionar imagen</span>
                  </label>

                  <div
                    id="preview-container"
                    className="file-preview"
                    style={{ display: "none" }}
                  >
                    <img id="image-preview" alt="Preview" className="preview-image" />
                    <button type="button" className="btn-remove-image">✕</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </Modal>

      <Modal
        isOpen={false}
        title="Detalle del Pedido"
        showFooter={false}
      >
        <section className="first-section">
          <h3 className="section-title">Información General</h3>

          <div className="grilla-datos">
            <div className="row-detail">
              <span className="label">ID del Pedido:</span>
              <span id="id_pedido" className="value-detail"></span>
            </div>

            <div className="row-detail">
              <span className="label">Proveedor:</span>
              <span id="nombre_proveedor" className="value-detail"></span>
            </div>

            <div className="row-detail">
              <span className="label">Fecha del Pedido:</span>
              <span id="fecha_pedido" className="value-detail"></span>
            </div>

            <div className="row-detail">
              <span className="label">Total:</span>
              <span id="total_pedido" className="value-detail monto-total"></span>
            </div>

            <div className="row-detail full-width">
              <span className="label">Estado:</span>
              <span id="estado_pedido" className="etiqueta-estado estado-pendiente"></span>
            </div>
          </div>
        </section>

        <section className="second-section">
          <h3 className="section-title">Producto del Pedido</h3>

          <div className="tarjeta-producto">
            <div className="encabezado-producto">
              <h4 id="nombre_producto" className="nombre-producto"></h4>
            </div>

            <div className="form-grid">
              <div className="row-detail">
                <span className="label">Precio Unitario:</span>
                <span id="precio_producto" className="value-detail"></span>
              </div>

              <div className="row-detail">
                <span className="label">Cantidad (Stock):</span>
                <span id="stock_producto" className="value-detail"></span>
              </div>

              <div className="row-detail fila-subtotal">
                <span className="label">Subtotal:</span>
                <span id="subtotal" className="value-detail subtotal-destacado"></span>
              </div>
            </div>
          </div>
        </section>
      </Modal>
    </>
  )
}
