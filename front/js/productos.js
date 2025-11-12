const modalOverlay = document.getElementById('modal-overlay')
const productsContainer = document.getElementById('products-grid')
const closeBtn = document.getElementById('close-btn')
const cancelBtn = document.getElementById('btn-cancel')
const editProductForm = document.getElementById('basic-info-form')
const imageUpload = document.getElementById('image-upload')
const imageInput = document.getElementById('image-input')
const imageForm = document.getElementById('form-image')
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');

document.addEventListener('DOMContentLoaded', () => {
  displayProducts()
  displayProductsStats()
})

productsContainer.addEventListener('click', async (e)=>{
  const target = e.target.closest('.btn-edit')
  displayCategoryOptions()
  if(target){
    const productId = target.getAttribute('data-product')
    const product = await getProductById(productId)
    document.getElementById('producto_id').value = product.id
    document.getElementById('producto_id_image').value = product.id
    document.getElementById('nombre').value = product.nombre
    document.getElementById('precio').value = product.precio
    document.getElementById('stock').value = product.stock
    document.getElementById('descripcion').value = product.descripcion
    document.getElementById('categoria_id').value = product.categoria_id
    modalOverlay.classList.add('active')
  }
})

closeBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Generic API fetcher function
 * @param {string} endpoint - API endpoint (e.g., '/products' or '/products/1')
 * @param {object} [options={}] - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Parsed JSON response or [] if error
 */
const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

const getProducts = () => apiFetch('/products')

const getProductById = (id) => apiFetch(`/products/${id}`)

const getProductsStats = () => apiFetch('/products/stats')

const getCategoryValues = () =>  apiFetch('/categories')

editProductForm.addEventListener('submit', async (e) =>{
  e.preventDefault();
  const formData = new FormData(editProductForm)
  const data = Object.fromEntries(formData)
  console.log("🚀 ~ data:", data)
  try {
    const response = await fetch(`${API_BASE_URL}/products/${data.producto_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const dataBack = await response.json();
    alert('Producto actualizado correctamente')
    modalOverlay.classList.remove('active');
    location.reload()
  } catch (error) {
    console.error('Error updating product:', error);
    alert('Error al actualizar el producto');
  }
})

let selectedImageFile = null
imageUpload.addEventListener('click', () =>{
  imageInput.click()
})
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  selectedImageFile = file
  showPreview(file)
})

imageForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (!selectedImageFile) {
        alert('Por favor selecciona una imagen primero');
        return;
    }
    document.getElementById('btn-img-upload').disabled = true
    document.getElementById('btn-img-upload').textContent = 'subiendo la imagen...'
  try {
    const productoId = document.getElementById('producto_id_image').value
    const formData = new FormData()
    formData.append('image', selectedImageFile)
    const response = await fetch(`${API_BASE_URL}/products/image/${productoId}`, {
      method: 'PUT',
      body: formData
    })
    const dataBack = await response.json()
    if(!dataBack.success){
      throw new Error(dataBack.error || 'Error al actualizar la imagen del producto')
    }
    alert('Imagen del producto actualizada correctamente')
    modalOverlay.classList.remove('active');
    resetUpload()
    location.reload()
  } catch (error) {
    console.error('Error updating product image:', error);
    alert('Error al actualizar la imagen del producto');
  }
})

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
}
function resetUpload() {
    selectedImageFile = null;
    imageInput.value = '';
    previewContainer.style.display = 'none';
    imagePreview.src = '';
}

const displayProducts = async () => {
  const {products} = await getProducts()
  productsContainer.insertAdjacentHTML('beforeend', products.map(product =>
    `<div class="product-card">
        <div class="product-image">
          <img src="${product.imagen_url}" alt="${product.nombre}">
          <span class="status-badge activo">Activo</span>
        </div>
        <div class="product-info">
          <div class="product-name">${product.nombre}</div>
          <div class="product-category">${product.nombre_categoria}</div>
          <div class="product-footer">
            <div>
              <div class="product-price">$ ${product.precio}</div>
            </div>
            <button class="btn-edit" data-product="${product.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
          </div>
        </div>
      </div>
    `
    ).join(''))
}

const displayProductsStats = async () => {
  const totalProductos = document.getElementById('total_productos')
  const bajoStock = document.getElementById('bajo_stock')
  const agotados = document.getElementById('agotados')
  const valorInventario = document.getElementById('valor_inventario')
  const {stats} = await getProductsStats()

  totalProductos.textContent = stats.total_productos
  bajoStock.textContent = stats.bajo_stock
  agotados.textContent = stats.agotados
  valorInventario.textContent = `$${stats.valor_inventario.toLocaleString()}`
}

const displayCategoryOptions = async () => {
  const categorySelect = document.getElementById('categoria_id')
  const {categories} = await getCategoryValues()
  categorySelect.insertAdjacentHTML('beforeend', categories.map(category =>
    `<option value="${category.categoria_id}">${category.nombre_categoria}</option>`
  ).join(''))
}
