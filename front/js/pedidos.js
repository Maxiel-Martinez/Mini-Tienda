import { apiFetch } from "../utils/APIfetch.js";
const newPedidoBtn = document.getElementById('btn-nuevo')
const modalOverlay = document.getElementById('modal-overlay')
const closeBtn = document.getElementById('btn-close')
const cancelBtn = document.getElementById('btn-cancel')
const pedidosForm = document.getElementById('formNuevoPedido')
const imageInput = document.getElementById('imagen')
const pedidosTable = document.getElementById('table-pedidos')
const cerrarDetalles = document.getElementById('cerrar-detalle')
const botoncerrar = document.getElementById('boton-cerrar')
const detalleOverlay = document.getElementById('overlay-detalle')

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

pedidosTable.addEventListener('click', async (e) => {
  const showDetails  = e.target.closest('.btn-action')
  const recibirPedido = e.target.closest('.btn-recibir')

  if (showDetails){
    const pedidoId = showDetails.getAttribute('data-id')
    const {success, pedido} =  await getpedidoById(pedidoId)
    if (!success) {
      alert('Error al obtener los detalles del pedido')
      return
    }
    document.getElementById('id_pedido').textContent = pedido.id
    document.getElementById('nombre_proveedor').textContent = pedido.nombre_proveedor
    document.getElementById('fecha_pedido').textContent = formatearFechaHora(pedido.fecha)
    document.getElementById('total_pedido').textContent = `$${pedido.total}`
    document.getElementById('estado_pedido').textContent = pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)
    document.getElementById('estado_pedido').className = `etiqueta-estado ${pedido.estado === "pendiente" ? "estado-pendiente" : pedido.estado === "en_transito" ? "estado-transito" : "estado-entregado"}`
    document.getElementById('nombre_producto').textContent = pedido.nombre
    document.getElementById('precio_producto').textContent = `$${pedido.precio}`
    document.getElementById('stock_producto').textContent = `${pedido.stock} unidades`
    const subtotal = pedido.precio * pedido.stock
    document.getElementById('subtotal').textContent = `$${subtotal}`
    detalleOverlay.classList.add('active')
  }

  if (recibirPedido){
    const pedidoId = recibirPedido.getAttribute('data-id')
    const confirmacion = confirm('¿Estás seguro de que deseas marcar este pedido como recibido?')
    if (!confirmacion) return
    const {success} = await updatePedidoStatus(pedidoId, 'recibido')
    if (!success){
      alert('Error al actualizar el estado del pedido')
      return
    }
    alert('Pedido marcado como recibido exitosamente')
    location.reload()
  }
})

cerrarDetalles.addEventListener('click', () => {
  detalleOverlay.classList.remove('active')
})

botoncerrar.addEventListener('click', () => {
  detalleOverlay.classList.remove('active')
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
const getpedidoById = (id) => apiFetch(`/pedidos/${id}`)
const updatePedidoStatus = (id, status) => apiFetch(`/pedidos/${id}/status`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estado: status })
})

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
        <button class="btn-action" data-id="${pedido.id}">👁 Ver</button>
        ${pedido.estado === "recibido" ? '' : `<button class="btn-recibir" data-id="${pedido.id}">✓ Recibir</button>`}
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
