import { CardsGrid } from "../components/cards/CardsGrid";
import { Modal } from "../components/modal/Modal";
import './Products.css';

const stats = [
  { title: "Total Productos", value: "0", subtitle: "En catálogo" },
  { title: "Bajo Stock", value: "0", subtitle: "Requieren reposición" },
  { title: "Agotados", value: "0", subtitle: "Sin existencias" },
  { title: "Valor Inventario", value: "$0", subtitle: "Total en stock" },
];
export const Products = () => {
  return (
    <>
      <CardsGrid arrayCards={stats} />
      <div id="products-grid" class="products-grid"></div>
      <Modal
        isOpen={false}
        title={'Editar Producto'}
        showFooter={false}
      >
        <div className="modal-split">
          <div className="modal-left">
            <h3 className="section-title">Información Básica</h3>
            <form id="basic-info-form" className="product-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input className="form-input" type="text" id="nombre" name="nombre" placeholder="Nombre del producto" />
              </div>

              <div className="form-group">
                <label htmlFor="categoria">Categoría</label>
                <select id="categoria_id" name="categoria_id" className="form-select">
                  <option value="">Seleccionar categoría</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="precio">Precio</label>
                  <input className="form-input" type="number" id="precio" name="precio" placeholder="0" min="0" />
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input className="form-input" type="number" id="stock" name="stock" placeholder="0" min="0" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" rows="4"
                  placeholder="Descripción del producto" className="form-textarea"></textarea>
              </div>

              <button type="submit" className="btn-submit">Guardar Información</button>
            </form>
          </div>

          <div className="modal-right">
            <h3 className="section-title">Imagen del Producto</h3>
            <form className="image-form" id="form-image">
              <div className="form-group">
                <div id="image-upload" className="image-upload">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <input type="file" id="image-input" name="image" accept="image/*" hidden />
                </div>
              </div>

              <button id="btn-img-upload" type="submit" className="btn-submit">Subir Imagen</button>
            </form>
            <div id="preview-container" style={{ display: 'none', marginTop: '16px' }}>
              <img id="image-preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
