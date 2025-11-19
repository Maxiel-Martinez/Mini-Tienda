const API_URL = 'http://localhost:4000/api';

let proveedores = [];
let editandoId = null;

window.onload = function() {
    cargarProveedores();
    cargarEstadisticas();
    inicializarEventos();
};

// ============ FUNCIONES DE API ============

async function cargarProveedores() {
    try {
        const response = await fetch(`${API_URL}/proveedores`);
        if (!response.ok) throw new Error('Error al cargar proveedores');

        const data = await response.json();
        proveedores = data.proveedores || [];

        // Obtener total de pedidos para cada proveedor
        for (const proveedor of proveedores) {
            proveedor.totalPedidos = await obtenerTotalPedidos(proveedor.id);
        }

        renderizarTabla();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo cargar los proveedores. Verifica que el servidor esté corriendo.',
            confirmButtonColor: '#667eea'
        });
    }
}

async function obtenerTotalPedidos(proveedorId) {
    try {
        const response = await fetch(`${API_URL}/proveedores/${proveedorId}/pedidos`);
        if (!response.ok) return 0;

        const data = await response.json();
        return data.totalPedidos || 0;
    } catch (error) {
        return 0;
    }
}

async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/proveedores/estadisticas`);
        if (!response.ok) throw new Error('Error al cargar estadísticas');

        const stats = await response.json();

        document.querySelector('.stat-card:nth-child(1) .stat-card-value').textContent = stats.totalProveedores || 0;
        document.querySelector('.stat-card:nth-child(2) .stat-card-value').textContent = stats.proveedoresActivos || 0;
        document.querySelector('.stat-card:nth-child(4) .stat-card-value').textContent = stats.pedidosMes || 0;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function guardarProveedor() {
    const nombre = document.getElementById('nombreProveedor').value.trim();
    const contacto = document.getElementById('personaContacto').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    if (!nombre || !telefono) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor completa los campos obligatorios (Nombre del Proveedor y Teléfono)',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    // Estructura correcta según tu base de datos
    const proveedorData = {
        nombre: nombre,        // VARCHAR(100) - Nombre de la empresa
        telefono: telefono,    // VARCHAR(20) - Teléfono
        empresa: contacto || null  // VARCHAR(100) - Persona de contacto
    };

    try {
        let response;
        if (editandoId) {
            response = await fetch(`${API_URL}/proveedores/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedorData)
            });
        } else {
            response = await fetch(`${API_URL}/proveedores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedorData)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al guardar proveedor');
        }

        const result = await response.json();

        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: result.msg || (editandoId ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente'),
            timer: 2000,
            showConfirmButton: false
        });

        cerrarModal();
        cargarProveedores();
        cargarEstadisticas();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al guardar el proveedor: ' + error.message,
            confirmButtonColor: '#667eea'
        });
    }
}

async function eliminarProveedor(proveedorId) {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    if (!proveedor) return;

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        html: `Se eliminará a <strong>${proveedor.nombre}</strong><br>Esta acción no se puede deshacer`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
        const response = await fetch(`${API_URL}/proveedores/${proveedorId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al eliminar proveedor');
        }

        Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'Proveedor eliminado exitosamente',
            timer: 2000,
            showConfirmButton: false
        });

        cargarProveedores();
        cargarEstadisticas();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al eliminar el proveedor: ' + error.message,
            confirmButtonColor: '#667eea'
        });
    }
}

// ============ FUNCIONES DE UI ============

function renderizarTabla() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    if (proveedores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 40px;">No hay proveedores registrados</td></tr>';
        return;
    }

    proveedores.forEach(proveedor => {
        const activo = proveedor.totalPedidos > 0;

        // Generar dirección de ejemplo o "Sin dirección"
        const direccion = `Calle 123 #45-67, Bogotá`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="proveedor-info">
                    <span class="proveedor-nombre">${proveedor.nombre}</span>
                    <span class="proveedor-direccion">${direccion}</span>
                </div>
            </td>
            <td>${proveedor.empresa || 'N/A'}</td>
            <td>${proveedor.telefono}</td>
            <td><span class="badge badge-productos">${proveedor.totalPedidos} pedidos</span></td>
            <td><span class="badge ${activo ? 'badge-activo' : 'badge-inactivo'}">${activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <div class="acciones">
                    <button class="btn-accion" onclick="verProveedor(${proveedor.id})">👁 Ver</button>
                    <button class="btn-accion" onclick="editarProveedor(${proveedor.id})">✏️ Editar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function inicializarEventos() {
    // Botón nuevo proveedor
    document.querySelector('.btn-nuevo').addEventListener('click', abrirModal);

    // Cerrar modal al hacer clic fuera
    document.getElementById('modalProveedor').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModal();
        }
    });
}

function abrirModal() {
    editandoId = null;
    document.getElementById('modalTitulo').textContent = 'Nuevo Proveedor';
    document.querySelector('.btn-guardar').textContent = 'Crear Proveedor';
    document.getElementById('formProveedor').reset();
    document.getElementById('modalProveedor').classList.add('active');
}

function cerrarModal() {
    document.getElementById('modalProveedor').classList.remove('active');
    editandoId = null;
}

function editarProveedor(id) {
    editandoId = id;
    const proveedor = proveedores.find(p => p.id === id);

    if (!proveedor) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Proveedor no encontrado',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    document.getElementById('modalTitulo').textContent = 'Editar Proveedor';
    document.querySelector('.btn-guardar').textContent = 'Guardar Cambios';
    document.getElementById('nombreProveedor').value = proveedor.nombre;
    document.getElementById('personaContacto').value = proveedor.empresa || '';
    document.getElementById('telefono').value = proveedor.telefono;
    document.getElementById('direccion').value = '';

    document.getElementById('modalProveedor').classList.add('active');
}

function verProveedor(id) {
    const proveedor = proveedores.find(p => p.id === id);
    if (!proveedor) return;

    Swal.fire({
        title: `📦 ${proveedor.nombre}`,
        html: `
            <div style="text-align: left; padding: 10px;">
                <p style="margin: 10px 0;"><strong>👤 Contacto:</strong> ${proveedor.empresa || 'N/A'}</p>
                <p style="margin: 10px 0;"><strong>📞 Teléfono:</strong> ${proveedor.telefono}</p>
                <p style="margin: 10px 0;"><strong>📋 Total Pedidos:</strong> ${proveedor.totalPedidos}</p>
                <p style="margin: 10px 0;"><strong>📊 Estado:</strong> <span style="color: ${proveedor.totalPedidos > 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">${proveedor.totalPedidos > 0 ? 'Activo' : 'Inactivo'}</span></p>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#667eea',
        width: '500px'
    });
}
