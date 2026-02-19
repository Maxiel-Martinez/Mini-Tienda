import './ProfileLayout.css'
import { Link, Outlet } from 'react-router'

export default function ProfileLayout() {
    return (
        <div className="main-content">
            <div className="header">
                <h1>Panel de Control</h1>
                <div className="user-section">
                    <div className="notification-badge">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        <span className="badge">3</span>
                    </div>
                    <div className="user-avatar" id="user-avatar"></div>
                    <span id="user-role" style={{ color: "#333", fontWeight: 500 }}></span>
                </div>
            </div>

            <div id="sidebar-container">
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h1>Variedades Dakota</h1>
                        <p>Sistema de Gestión</p>
                    </div>

                    <Link to="" className="menu-item" data-page="dashboard">
                        <span className="menu-icon">📊</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link to="sales" className="menu-item" data-page="ventas">
                        <span className="menu-icon">🛒</span>
                        <span>Ventas</span>
                    </Link>
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
                </div>
            </div>
            <div className='profile'>
                   <Outlet />
            </div>
        </div>
    )
}
