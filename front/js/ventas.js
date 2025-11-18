const API_URL = 'http://localhost:3000/api';

let ventas = [];
let clientes = [];
let productos = [];
let metodosPago = [];
let productosSeleccionados = [];

window.onload = function() {
    cargarDatos();
    inicializarEventos();
};

// ============ FUNCIONES DE CARGA ============

async function cargarDatos() {
    await Promise.all([
        cargarVentas(),
        cargarEstadisticas(),
        cargarClientes(),
        cargarProductos(),
        cargarMetodosPago()
    ]);
}

async function cargarVentas() {
    try {
        const response = await fetch(`${API_URL}/ventas`);
        if (!response.ok) throw new Error('Error al cargar ventas');
        
        const data = await response.json();
        ventas = data.ventas || [];
        renderizarTabla();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/ventas/estadisticas`);
        if (!response.ok) throw new Error('Error al cargar estadísticas');
        
        const stats = await response.json();
        
        document.querySelector('.card:nth-child(1) .card-amount').textContent = 
            '$' + (parseFloat(stats.ventasHoy) || 0).toLocaleString();
        document.querySelector('.card:nth-child(1) .card-subtitle').textContent = 
            (stats.transaccionesHoy || 0) + ' transacciones';

        // Métodos de pago
        const metodosMap = {};
        stats.metodosPago.forEach(m => {
            metodosMap[m.metodo_pago] = parseFloat(m.total) || 0;
        });

        const totalDia = parseFloat(stats.ventasHoy) || 1;
        
        document.querySelector('.card:nth-child(2) .card-amount').textContent = 
            '$' + (metodosMap['Efectivo'] || 0).toLocaleString();
        document.querySelector('.card:nth-child(2) .card-subtitle').textContent = 
            Math.round((metodosMap['Efectivo'] || 0) / totalDia * 100) + '% del total';

        const transferencias = (metodosMap['Nequi'] || 0) + (metodosMap['Bancolombia'] || 0);
        document.querySelector('.card:nth-child(3) .card-amount').textContent = 
            '$' + transferencias.toLocaleString();
        document.querySelector('.card:nth-child(3) .card-subtitle').textContent = 
            Math.round(transferencias / totalDia * 100) + '% del total';

        document.querySelector('.card:nth-child(4) .card-amount').textContent = 
            '$' + (parseFloat(stats.creditosPendientes) || 0).toLocaleString();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        if (!response.ok) throw new Error('Error al cargar clientes');
        
        const data = await response.json();
        console.log('Clientes recibidos:', data); // Para debug
        
        clientes = data.clientes || data.data || data || [];
        
        console.log('Clientes cargados:', clientes.length);
    } catch (error) {
        console.error('Error cargando clientes:', error);
    }
}

async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const data = await response.json();
        console.log('Productos recibidos:', data); // Para debug
        
        // Intentar diferentes estructuras de respuesta
        productos = data.products || data.productos || data.data || data || [];
        
        console.log('Productos cargados:', productos.length);
    } catch (error) {
        console.error('Error cargando productos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los productos. Verifica que el servidor esté corriendo.',
            confirmButtonColor: '#1E90FF'
        });
    }
}

async function cargarMetodosPago() {
    // Según tu BD: Efectivo, Nequi, Bancolombia, Credito Cliente
    metodosPago = [
        { id: 1, nombre: 'Efectivo' },
        { id: 2, nombre: 'Nequi' },
        { id: 4, nombre: 'Credito Cliente' }
    ];
}

// ============ FUNCIONES DE UI ============

function renderizarTabla() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px;">No hay ventas registradas</td></tr>';
        return;
    }

    ventas.forEach(venta => {
        const fecha = new Date(venta.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-CO');
        const pagada = parseFloat(venta.saldo_restante) === 0;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${venta.id}</td>
            <td class="amount-green">$${parseFloat(venta.total).toLocaleString()}</td>
            <td><span class="badge badge-${venta.metodo_pago_nombre?.toLowerCase() || 'efectivo'}">${venta.metodo_pago_nombre || 'N/A'}</span></td>
            <td>${fechaFormateada}</td>
            <td><span class="badge ${pagada ? 'badge-completado' : 'badge-pendiente'}">${pagada ? 'Completado' : 'Pendiente'}</span></td>
            <td><button class="btn-ver" onclick="verDetalle(${venta.id})">👁 Ver</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function inicializarEventos() {
    document.querySelector('.btn-nuevo').addEventListener('click', abrirModal);
    
    if (!document.getElementById('modalVenta')) {
        crearModal();
    }
}

// ============ MODAL Y FORMULARIO ============

function crearModal() {
    const modalHTML = `
        <div class="modal" id="modalVenta">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Nueva Venta</h2>
                    <button class="btn-close" onclick="cerrarModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="formVenta" onsubmit="event.preventDefault(); guardarVenta();">
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="clienteSelect">Cliente (Opcional)</label>
                                <select id="clienteSelect">
                                    <option value="">Venta sin cliente</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="metodoPagoSelect">Método de Pago *</label>
                                <select id="metodoPagoSelect" required>
                                    <option value="">Seleccionar...</option>
                                </select>
                            </div>
                        </div>

                        <div class="productos-section">
                            <h3>Productos</h3>
                            <div class="form-row">
                                <div class="form-group" style="flex: 2;">
                                    <label for="productoSelect">Producto</label>
                                    <select id="productoSelect">
                                        <option value="">Seleccionar producto...</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="cantidadInput">Cantidad</label>
                                    <input type="number" id="cantidadInput" min="1" value="1">
                                </div>
                                <div class="form-group" style="align-self: flex-end;">
                                    <button type="button" class="btn-agregar" onclick="agregarProducto()">+ Agregar</button>
                                </div>
                            </div>
                            
                            <div id="listaProductos" class="lista-productos"></div>
                        </div>

                        <div class="totales-section">
                            <div class="total-row">
                                <span>Total:</span>
                                <span id="totalVenta" class="total-amount">$0</span>
                            </div>
                            <div class="form-group" id="saldoRestanteGroup" style="display: none;">
                                <label for="saldoRestante">Saldo Restante (Crédito)</label>
                                <input type="number" id="saldoRestante" min="0" step="0.01" value="0">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancelar" onclick="cerrarModal()">Cancelar</button>
                    <button class="btn-guardar" onclick="guardarVenta()">Registrar Venta</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    agregarEstilosModal();
    
    document.getElementById('modalVenta').addEventListener('click', function(e) {
        if (e.target === this) cerrarModal();
    });

    // Event listener para método de pago
    document.getElementById('metodoPagoSelect').addEventListener('change', function(e) {
        const saldoGroup = document.getElementById('saldoRestanteGroup');
        if (e.target.options[e.target.selectedIndex].text === 'Credito Cliente') {
            saldoGroup.style.display = 'block';
        } else {
            saldoGroup.style.display = 'none';
            document.getElementById('saldoRestante').value = 0;
        }
    });
}

function agregarEstilosModal() {
    const styles = `
        <style>
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                align-items: center;
                justify-content: center;
                overflow-y: auto;
            }
            .modal.active { display: flex; }
            .modal-content {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                margin: 20px;
            }
            .modal-header {
                padding: 24px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h2 {
                margin: 0;
                color: #00008B;
                font-size: 24px;
            }
            .btn-close {
                background: none;
                border: none;
                font-size: 28px;
                color: #999;
                cursor: pointer;
            }
            .modal-body {
                padding: 24px;
            }
            .form-row {
                display: flex;
                gap: 16px;
                margin-bottom: 16px;
            }
            .form-group {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .form-group label {
                margin-bottom: 8px;
                color: #333;
                font-weight: 500;
                font-size: 14px;
            }
            .form-group input,
            .form-group select {
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
            }
            .productos-section {
                margin: 24px 0;
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;
            }
            .productos-section h3 {
                margin: 0 0 16px 0;
                color: #333;
                font-size: 16px;
            }
            .btn-agregar {
                background: #10b981;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            }
            .lista-productos {
                margin-top: 16px;
            }
            .producto-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: white;
                border-radius: 6px;
                margin-bottom: 8px;
            }
            .producto-item button {
                background: #ef4444;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
            }
            .totales-section {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 2px solid #e5e7eb;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                font-size: 24px;
                font-weight: 700;
                color: #00008B;
                margin-bottom: 16px;
            }
            .modal-footer {
                padding: 20px 24px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }
            .btn-cancelar, .btn-guardar {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
            }
            .btn-cancelar {
                background: #f3f4f6;
                color: #666;
            }
            .btn-guardar {
                background: #1E90FF;
                color: white;
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

function abrirModal() {
    productosSeleccionados = [];
    document.getElementById('formVenta').reset();
    
    // Llenar selects
    const clienteSelect = document.getElementById('clienteSelect');
    clienteSelect.innerHTML = '<option value="">Venta sin cliente</option>';
    clientes.forEach(c => {
        clienteSelect.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });

    const metodoPagoSelect = document.getElementById('metodoPagoSelect');
    metodoPagoSelect.innerHTML = '<option value="">Seleccionar...</option>';
    metodosPago.forEach(m => {
        metodoPagoSelect.innerHTML += `<option value="${m.id}">${m.nombre}</option>`;
    });

    const productoSelect = document.getElementById('productoSelect');
    productoSelect.innerHTML = '<option value="">Seleccionar producto...</option>';
    productos.forEach(p => {
        if (p.stock > 0) {
            productoSelect.innerHTML += `<option value="${p.id}">${p.nombre} - $${parseFloat(p.precio).toLocaleString()} (Stock: ${p.stock})</option>`;
        }
    });

    renderizarListaProductos();
    document.getElementById('modalVenta').classList.add('active');
}

function cerrarModal() {
    document.getElementById('modalVenta').classList.remove('active');
    productosSeleccionados = [];
}

function agregarProducto() {
    const productoId = parseInt(document.getElementById('productoSelect').value);
    const cantidad = parseInt(document.getElementById('cantidadInput').value);

    if (!productoId || !cantidad || cantidad <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Selecciona un producto y cantidad válida',
            confirmButtonColor: '#1E90FF'
        });
        return;
    }

    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (cantidad > producto.stock) {
        Swal.fire({
            icon: 'error',
            title: 'Stock insuficiente',
            text: `Disponible: ${producto.stock} unidades`,
            confirmButtonColor: '#1E90FF'
        });
        return;
    }

    const existe = productosSeleccionados.find(p => p.producto_id === productoId);
    if (existe) {
        existe.cantidad += cantidad;
    } else {
        productosSeleccionados.push({
            producto_id: productoId,
            nombre: producto.nombre,
            precio_unitario: parseFloat(producto.precio),
            cantidad: cantidad
        });
    }

    document.getElementById('productoSelect').value = '';
    document.getElementById('cantidadInput').value = 1;
    renderizarListaProductos();
}

function eliminarProducto(index) {
    Swal.fire({
        title: '¿Eliminar producto?',
        text: "Se quitará de la lista",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            productosSeleccionados.splice(index, 1);
            renderizarListaProductos();
        }
    });
}

function renderizarListaProductos() {
    const lista = document.getElementById('listaProductos');
    lista.innerHTML = '';

    let total = 0;
    productosSeleccionados.forEach((p, index) => {
        const subtotal = p.cantidad * p.precio_unitario;
        total += subtotal;

        lista.innerHTML += `
            <div class="producto-item">
                <div>
                    <strong>${p.nombre}</strong><br>
                    ${p.cantidad} x $${p.precio_unitario.toLocaleString()} = $${subtotal.toLocaleString()}
                </div>
                <button onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
            </div>
        `;
    });

    document.getElementById('totalVenta').textContent = '$' + total.toLocaleString();
}

async function guardarVenta() {
    const cliente_id = document.getElementById('clienteSelect').value || null;
    const metodo_pago_id = parseInt(document.getElementById('metodoPagoSelect').value);
    const saldo_restante = parseFloat(document.getElementById('saldoRestante').value) || 0;

    if (!metodo_pago_id) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Selecciona un método de pago',
            confirmButtonColor: '#1E90FF'
        });
        return;
    }

    if (productosSeleccionados.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin productos',
            text: 'Agrega al menos un producto',
            confirmButtonColor: '#1E90FF'
        });
        return;
    }

    const total = productosSeleccionados.reduce((sum, p) => sum + (p.cantidad * p.precio_unitario), 0);

    if (saldo_restante > total) {
        Swal.fire({
            icon: 'error',
            title: 'Error en saldo',
            text: 'El saldo restante no puede ser mayor al total',
            confirmButtonColor: '#1E90FF'
        });
        return;
    }

    const ventaData = {
        cliente_id,
        total,
        saldo_restante,
        metodo_pago_id,
        productos: productosSeleccionados
    };

    try {
        const response = await fetch(`${API_URL}/ventas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ventaData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al registrar venta');
        }

        const result = await response.json();
        
        await Swal.fire({
            icon: 'success',
            title: '¡Venta registrada!',
            text: result.msg || 'La venta se registró exitosamente',
            confirmButtonColor: '#1E90FF'
        });
        
        cerrarModal();
        cargarDatos();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
            confirmButtonColor: '#1E90FF'
        });
    }
}

async function verDetalle(id) {
    try {
        const response = await fetch(`${API_URL}/ventas/${id}`);
        if (!response.ok) throw new Error('Error al cargar detalle');
        
        const data = await response.json();
        const venta = data.venta;

        let productosHTML = '<div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;"><strong style="color: #0369a1;">Productos:</strong><ul style="margin: 10px 0; padding-left: 20px;">';
        venta.productos.forEach(p => {
            productosHTML += `<li style="margin: 5px 0; color: #334155;">${p.producto_nombre}: <strong>${p.cantidad}</strong> x ${parseFloat(p.precio_unitario).toLocaleString()} = <strong style="color: #0891b2;">${(p.cantidad * parseFloat(p.precio_unitario)).toLocaleString()}</strong></li>`;
        });
        productosHTML += '</ul></div>';

        const pagado = parseFloat(venta.saldo_restante) === 0;

        Swal.fire({
            title: `<span style="color: #00008B;">Detalle de Venta #${venta.id}</span>`,
            html: `
                <div style="text-align: left; font-size: 14px;">
                    <div style="background: #dbeafe; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                        <p style="margin: 8px 0;"><strong style="color: #1e40af;">👤 Cliente:</strong> <span style="color: #334155;">${venta.cliente_nombre || 'Venta sin cliente'}</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #1e40af;">📅 Fecha:</strong> <span style="color: #334155;">${new Date(venta.fecha).toLocaleString('es-CO')}</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #1e40af;">💳 Método de Pago:</strong> <span style="color: #334155;">${venta.metodo_pago_nombre}</span></p>
                    </div>
                    
                    ${productosHTML}
                    
                    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e90ff 100%); padding: 15px; border-radius: 8px; color: white; margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                            <span style="font-size: 16px;"><strong>💰 Total:</strong></span>
                            <span style="font-size: 18px; font-weight: bold;">${parseFloat(venta.total).toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                            <span><strong>📊 Saldo Restante:</strong></span>
                            <span style="font-weight: bold;">${parseFloat(venta.saldo_restante).toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 8px 0; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);">
                            <span><strong>✅ Estado:</strong></span>
                            <span style="background: ${pagado ? '#10b981' : '#f59e0b'}; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 13px;">
                                ${pagado ? '✓ Pagado' : '⏳ Pendiente'}
                            </span>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonColor: '#1E90FF',
            confirmButtonText: 'Cerrar',
            width: '650px',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el detalle de la venta',
            confirmButtonColor: '#1E90FF'
        });
    }
}