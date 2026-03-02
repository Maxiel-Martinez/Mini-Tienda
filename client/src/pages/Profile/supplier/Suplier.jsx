export const Suplier = ()=> {
  return (
    <>
  <div className="main-content">
    <div className="header">
      <div className="header-left">
        <h1>Proveedores</h1>
        <p>Gestiona la información de tus proveedores</p>
      </div>
      <div className="header-right">
        <button className="btn-nuevo">
          <span style={{ fontSize: "18px" }}>+</span>
          Nuevo Proveedor
        </button>
      </div>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-title">Total Proveedores</div>
        <div className="stat-card-value">0</div>
        <div className="stat-card-subtitle">Registrados</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-title">Proveedores Activos</div>
        <div className="stat-card-value">0</div>
        <div className="stat-card-subtitle">En operación</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-title">Productos Suministrados</div>
        <div className="stat-card-value">8</div>
        <div className="stat-card-subtitle">Diferentes productos</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-title">Pedidos Este Mes</div>
        <div className="stat-card-value">0</div>
        <div className="stat-card-subtitle">Órdenes realizadas</div>
      </div>
    </div>

    <div className="table-section">
      <h2>Lista de Proveedores</h2>
      <table>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Productos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>

  <div className="modal" id="modalProveedor">
    <div className="modal-content">
      <div className="modal-header">
        <h2 id="modalTitulo">Nuevo Proveedor</h2>
        <button className="btn-close" onclick="cerrarModal()">&times;</button>
      </div>
      <div className="modal-body">
        <form id="formProveedor" onsubmit="event.preventDefault(); guardarProveedor();">
          <input type="hidden" id="proveedorId" />

          <div className="form-group">
            <label for="nombreProveedor">Nombre del Proveedor *</label>
            <input type="text" id="nombreProveedor" placeholder="Nombre de la empresa" required />
          </div>

          <div className="form-group">
            <label for="personaContacto">Persona de Contacto</label>
            <input type="text" id="personaContacto" placeholder="Nombre del contacto" />
          </div>

          <div className="form-group">
            <label for="telefono">Teléfono *</label>
            <input type="tel" id="telefono" placeholder="+57 300 123 4567" required />
          </div>

          <div className="form-group">
            <label for="direccion">Dirección</label>
            <input type="text" id="direccion" placeholder="Dirección de la empresa" />
          </div>

          <div className="form-group">
            <label for="productos">Productos que Suministra</label>
            <textarea id="productos" rows="3" placeholder="Ejemplo: Gaseosas, Paquetes, Dulces"></textarea>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button className="btn-cancelar" onclick="cerrarModal()">Cancelar</button>
        <button className="btn-guardar" onclick="guardarProveedor()">Crear Proveedor</button>
      </div>
    </div>
  </div>

    </>
  )
}
