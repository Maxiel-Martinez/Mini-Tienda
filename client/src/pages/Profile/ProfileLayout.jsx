import React from 'react'

export default function ProfileLayout() {
    return (
        <>
            <div className="body-dashboard">ProfileLayout</div>

            <div className="sidebar-header">
                <h1>Variedades Dakota</h1>
                <p>Sistema de Gestión</p>
            </div>

            <div className="menu-item" data-page="dashboard">
                <span className="menu-icon">📊</span>
                <span>Dashboard</span>
            </div>
            <div className="menu-item" data-page="ventas">
                <span className="menu-icon">🛒</span>
                <span>Ventas</span>
            </div>
            <div className="menu-item" data-page="pedidos">
                <span className="menu-icon">📋</span>
                <span>Pedidos</span>
            </div>
            <div className="menu-item" data-page="clientes">
                <span className="menu-icon">👥</span>
                <span>Clientes</span>
            </div>
            <div className="menu-item" data-page="productos">
                <span className="menu-icon">📦</span>
                <span>Productos</span>
            </div>
            <div className="menu-item" data-page="proveedores">
                <span className="menu-icon">🏢</span>
                <span>Proveedores</span>
            </div>

            <div className="menu-item logout" id="logout-btn">
                <span className="menu-icon">🚪</span>
                <span>Cerrar sesión</span>
            </div>
        </>
    )
}
