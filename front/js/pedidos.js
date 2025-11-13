import { apiFetch } from "../utils/APIfetch.js";
const newPedidoBtn = document.getElementById('btn-nuevo')
const modalOverlay = document.getElementById('modal-overlay')
const closeBtn = document.getElementById('btn-close')
const cancelBtn = document.getElementById('btn-cancel')

document.addEventListener('DOMContentLoaded', () => {
  displayPedidos()
})

newPedidoBtn.addEventListener('click', () => {
  modalOverlay.classList.add('active')
})

closeBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

const getAllPedidos = () => apiFetch('/pedidos');

const displayPedidos = async () => {
  const {success, pedidos } = await getAllPedidos();
  console.log("🚀 ~ displayPedidos ~ pedidos:", pedidos)
  const pedidosTable = document.getElementById('table-pedidos')

  if (!success){
    pedidosTable.innerHTML = `<tr><td colspan="7">No hay pedidos en este momento</td></tr>`
    return
  }

  pedidosTable.insertAdjacentHTML('beforeend', pedidos.map(pedido =>
    `
    <tr>
      <td>${pedido.id}</td>
      <td>${pedido.nombre}</td>
      <td>${pedido.fecha}</td>
      <td>8 productos</td>
      <td class="total-green">$ ${pedido.total}</td>
      <td><span class="badge badge-pending">${pedido.estado}</span></td>
      <td>
        <button class="btn-action">👁 Ver</button>
        <button class="btn-recibir">✓ Recibir</button>
      </td>
    </tr>
    `
  ).join(''))
}
