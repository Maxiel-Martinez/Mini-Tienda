const API_URL = 'http://localhost:3000/api'; // Ajusta el puerto según tu configuración

let clientes = [];
let editandoId = null;

window.onload = function() {
    cargarClientes();
};

// ============ FUNCIONES DE API ============

async function cargarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        if (!response.ok) throw new Error('Error al cargar clientes');
        
        const data = await response.json();
        clientes = data.clientes || [];
        
        // Calcular última compra para cada cliente
        await Promise.all(clientes.map(async (cliente) => {
            cliente.ultimaCompra = await obtenerUltimaCompra(cliente.id);
        }));
        
        renderizarTabla();
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los clientes. Verifica que el servidor esté corriendo.');
    }
}

async function obtenerUltimaCompra(clienteId) {
    try {
        // Esta función obtendría la última venta del cliente
        // Si tienes un endpoint para esto, úsalo aquí
        // Por ahora retornamos un placeholder
        return 'Sin compras';
    } catch (error) {
        return 'Sin compras';
    }
}

async function guardarCliente() {
    const nombre = document.getElementById('nombreCompleto').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('email').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    if (!nombre || !telefono) {
        alert('Por favor completa los campos obligatorios (Nombre y Teléfono)');
        return;
    }

    if (!correo) {
        alert('Por favor completa el campo de correo electrónico');
        return;
    }

    const clienteData = { 
        nombre, 
        telefono, 
        correo, 
        direccion,
        saldo: 0 // Nuevo cliente sin deuda
    };

    try {
        let response;
        if (editandoId) {
            // Obtener el saldo actual del cliente antes de actualizar
            const clienteActual = clientes.find(c => c.id === editandoId);
            clienteData.saldo = clienteActual ? clienteActual.saldo : 0;

            response = await fetch(`${API_URL}/clientes/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteData)
            });
        } else {
            response = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteData)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al guardar cliente');
        }

        const result = await response.json();
        alert(result.msg || (editandoId ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente'));
        
        cerrarModal();
        cargarClientes();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el cliente: ' + error.message);
    }
}

async function actualizarDeuda(clienteId) {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    const deudaActual = parseFloat(cliente.saldo || 0);

    const accion = confirm(`Deuda actual de ${cliente.nombre}: $${deudaActual.toLocaleString()}\n\n¿Deseas registrar un pago?\n\nAceptar = Pagar\nCancelar = Agregar deuda`);
    
    const monto = prompt(accion ? '¿Cuánto va a pagar?' : '¿Cuánto se va a agregar a la deuda?');
    
    if (monto === null) return;
    
    const montoNumerico = parseFloat(monto);
    
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
        alert('Por favor ingresa un monto válido');
        return;
    }

    let nuevoSaldo;
    if (accion) {
        // Pagar
        if (montoNumerico > deudaActual) {
            alert('El monto no puede ser mayor a la deuda actual');
            return;
        }
        nuevoSaldo = deudaActual - montoNumerico;
    } else {
        // Agregar deuda
        nuevoSaldo = deudaActual + montoNumerico;
    }

    try {
        const response = await fetch(`${API_URL}/clientes/${clienteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: cliente.nombre,
                telefono: cliente.telefono,
                correo: cliente.correo,
                direccion: cliente.direccion,
                saldo: nuevoSaldo
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al actualizar deuda');
        }

        const result = await response.json();
        alert(`${accion ? 'Pago' : 'Deuda'} registrado exitosamente.\nNuevo saldo: $${nuevoSaldo.toLocaleString()}`);
        
        cargarClientes();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar la deuda: ' + error.message);
    }
}

async function eliminarCliente(clienteId) {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    if (!confirm(`¿Estás seguro de eliminar a ${cliente.nombre}?`)) return;

    try {
        const response = await fetch(`${API_URL}/clientes/${clienteId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al eliminar cliente');
        }

        const result = await response.json();
        alert(result.msg || 'Cliente eliminado exitosamente');
        cargarClientes();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el cliente: ' + error.message);
    }
}

// ============ FUNCIONES DE UI ============

function actualizarEstadisticas() {
    const totalClientes = clientes.length;
    const clientesConDeuda = clientes.filter(c => parseFloat(c.saldo || 0) > 0).length;
    const deudaTotal = clientes.reduce((sum, c) => sum + parseFloat(c.saldo || 0), 0);

    document.getElementById('totalClientes').textContent = totalClientes;
    document.getElementById('clientesConDeuda').textContent = clientesConDeuda;
    document.getElementById('deudaTotal').textContent = '$' + deudaTotal.toLocaleString();

    // Actualizar subtítulo de clientes activos
    const subtituloElement = document.querySelector('.stat-card:first-child .stat-subtitle');
    if (subtituloElement) {
        const clientesSinDeuda = totalClientes - clientesConDeuda;
        subtituloElement.textContent = `${clientesSinDeuda} sin deuda`;
    }
}

function renderizarTabla() {
    const tbody = document.getElementById('tablaClientes');
    tbody.innerHTML = '';

    if (clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px;">No hay clientes registrados</td></tr>';
        actualizarEstadisticas();
        return;
    }

    clientes.forEach(cliente => {
        const deuda = parseFloat(cliente.saldo || 0);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="cliente-info">
                    <span class="cliente-nombre">${cliente.nombre}</span>
                    <span class="cliente-email">${cliente.correo || 'Sin email'}</span>
                </div>
            </td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion || 'Sin dirección'}</td>
            <td><span class="${deuda > 0 ? 'deuda-pendiente' : 'deuda-cero'}">$${deuda.toLocaleString()}</span></td>
            <td>${cliente.ultimaCompra}</td>
            <td>
                <div class="acciones">
                    <button class="btn-editar" onclick="editarCliente(${cliente.id})">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                        Editar
                    </button>
                    <button class="btn-deuda" onclick="actualizarDeuda(${cliente.id})">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                        </svg>
                        ${deuda > 0 ? 'Cobrar' : 'Fiar'}
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    actualizarEstadisticas();
}

function abrirModal() {
    editandoId = null;
    document.getElementById('modalTitulo').textContent = 'Nuevo Cliente';
    document.getElementById('btnGuardar').textContent = 'Crear Cliente';
    document.getElementById('formCliente').reset();
    document.getElementById('modalCliente').classList.add('active');
}

function cerrarModal() {
    document.getElementById('modalCliente').classList.remove('active');
    editandoId = null;
}

function editarCliente(id) {
    editandoId = id;
    const cliente = clientes.find(c => c.id === id);

    if (!cliente) {
        alert('Cliente no encontrado');
        return;
    }

    document.getElementById('modalTitulo').textContent = 'Editar Cliente';
    document.getElementById('btnGuardar').textContent = 'Guardar Cambios';
    document.getElementById('nombreCompleto').value = cliente.nombre;
    document.getElementById('telefono').value = cliente.telefono;
    document.getElementById('email').value = cliente.correo || '';
    document.getElementById('direccion').value = cliente.direccion || '';

    document.getElementById('modalCliente').classList.add('active');
}

// Cerrar modal al hacer clic fuera
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalCliente');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });
    }
});