import { apiFetch } from "../utils/APIfetch.js";
const newPedidoBtn = document.getElementById('btn-nuevo')
const modalOverlay = document.getElementById('modal-overlay')
const closeBtn = document.getElementById('btn-close')
const cancelBtn = document.getElementById('btn-cancel')
const pedidosForm = document.getElementById('formNuevoPedido')
const imageInput = document.getElementById('imagen')

document.addEventListener('DOMContentLoaded', () => {
  displayPedidoStats()
  displayPedidos()
})

newPedidoBtn.addEventListener('click', () => {
  displayCategoryOptions()
  displayProveedoresOptions()
  modalOverlay.classList.add('active')
})

closeBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

imageInput.addEventListener('change', (e) => {
  showPreview(e.target.files[0]);
})

function formatearFechaHora(fecha) {
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

const getAllPedidos = () => apiFetch('/pedidos');
const getCategoryValues = () =>  apiFetch('/categories')
const getProveedores = () =>  apiFetch('/proveedores')
const getpedidosStats = () =>  apiFetch('/pedidos/stats')

pedidosForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(pedidosForm)
  const data = Object.fromEntries(formData)
  const totalPrecio = parseFloat(data.precio) * parseInt(data.stock)
  formData.append('total', totalPrecio)
  try {
    const response = await apiFetch('/pedidos', {
      method: 'POST',
      body: formData
    })

    const {success} = await response.json()
    if (!success){
      throw new Error('Error creating the pedido')
    }
    alert('Pedido creado exitosamente')
    modalOverlay.classList.remove('active')
    location.reload()
  } catch (error) {
    console.error('Error updating product image:', error)
    alert('Error al actualizar la imagen del producto')
  }
})

function showPreview(file) {
  const previewContainer = document.getElementById('preview-container');
  const imagePreview = document.getElementById('image-preview');
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

const displayPedidos = async () => {
  const {success, pedidos } = await getAllPedidos();
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
      <td>${formatearFechaHora(pedido.fecha)}</td>
      <td class="total-green">$ ${pedido.total}</td>
      <td><span class="badge ${pedido.estado === "recibido" ? "badge-delivered" : pedido.estado === "pendiente" ? "badge-pending" : "badge-transit"}">${pedido.estado}</span></td>
      <td>
        <button class="btn-action">👁 Ver</button>
        ${pedido.estado === "recibido" ? '' : '<button class="btn-recibir">✓ Recibir</button>'}
      </td>
    </tr>
    `
  ).join(''))
}

const displayCategoryOptions = async () => {
  const categorySelect = document.getElementById('categoria_id')
  const {categories} = await getCategoryValues()
  categorySelect.insertAdjacentHTML('beforeend', categories.map(category =>
    `<option value="${category.categoria_id}">${category.nombre_categoria}</option>`
  ).join(''))
}

const displayProveedoresOptions = async () => {
  const proveedorSelect = document.getElementById('proveedor')
  const {proveedores} = await getProveedores()
  proveedorSelect.insertAdjacentHTML('beforeend', proveedores.map(proveedor =>
    `<option value="${proveedor.id}">${proveedor.nombre}</option>`
  ).join(''))
}

const displayPedidoStats = async () => {
  const pedidosPendientes = document.getElementById('pedidos_pendientes')
  const entregadosHoy = document.getElementById('entregados_hoy')
  const totalMes = document.getElementById('total_mes')
  const {success, stats} = await getpedidosStats()

  if (!success) return

  pedidosPendientes.textContent = stats.pedidos_pendientes
  entregadosHoy.textContent = stats.entregados_hoy
  totalMes.textContent = `$${stats.total_mes}`
}
