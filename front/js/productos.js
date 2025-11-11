const modalOverlay = document.getElementById('modal-overlay')
const productsContainer = document.getElementById('products-grid')
const closeBtn = document.getElementById('close-btn')
const cancelBtn = document.getElementById('btn-cancel')

document.addEventListener('DOMContentLoaded', () => {
  displayProducts()
  displayProductsStats()
})

productsContainer.addEventListener('click', (e)=>{
  const target = e.target.closest('.btn-edit')
  if(target){
    modalOverlay.classList.add('active')
  }
})

closeBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

const getProducts = async () =>{
  try {
    const response = await fetch('http://localhost:4000/api/products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

const getProductsStats = async () =>{
  try {
    const response = await fetch('http://localhost:4000/api/products/stats');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products stats:', error);
    return [];
  }
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
            <button class="btn-edit" data-product="Producto Deluxe D">
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
