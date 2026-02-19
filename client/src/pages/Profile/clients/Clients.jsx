import './Clients.css'
import { CardsGrid } from "../components/cards/CardsGrid"

const stats = [
  { title: "Total Clientes", value: "4", subtitle: "3 activos" },
  { title: "Clientes con Deuda", value: "3", subtitle: "Pendientes de pago" },
  { title: "Deuda Total", value: "$255,000", subtitle: "Por cobrar" },
  { title: "Compras del Mes", value: "$1,730,000", subtitle: "Enero 2024" },
];

export const Clients = () => {
  return (
    <>
    <div className="header">
      <div className="header-left">
        <h1>Clientes</h1>
        <p>Gestiona tu base de clientes y sus deudas</p>
      </div>
      <div className="header-right">
        <button className="btn-nuevo">
          <span style={{fontSize: "18px"}}>+</span>
          Nuevo Cliente
        </button>
      </div>
    </div>
    <CardsGrid arrayCards={stats} />
    <div className="table-section">
      <h2>Lista de Clientes</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Dirección</th>
              <th>Deuda</th>
              <th>Última Compra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaClientes">
          </tbody>
        </table>
      </div>
    </div>

    <div className="modal" id="modalCliente">
    <div className="modal-content">
      <div className="modal-header">
        <h2 id="modalTitulo">Nuevo Cliente</h2>
        <button className="btn-close" onclick="cerrarModal()">&times;</button>
      </div>
      <div className="modal-body">
        <form id="formCliente">
          <input type="hidden" id="clienteId" />

          <div className="form-group">
            <label for="nombreCompleto">Nombre Completo</label>
            <input type="text" id="nombreCompleto" placeholder="Nombre del cliente" required />
          </div>

          <div className="form-group">
            <label for="telefono">Teléfono</label>
            <input type="tel" id="telefono" placeholder="300-123-4567" required />
          </div>

          <div className="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="cliente@email.com" />
          </div>

          <div className="form-group">
            <label for="direccion">Dirección</label>
            <textarea id="direccion" placeholder="Dirección completa del cliente"></textarea>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button className="btn-cancelar" onclick="cerrarModal()">Cancelar</button>
        <button className="btn-guardar" id="btnGuardar" onclick="guardarCliente()">Crear Cliente</button>
      </div>
    </div>
  </div>
    </>
  )
}
