import './Dashboard.css'

export const Dashboard = () => {
    return (
        <>
            <div class="dashboard-title">
                <h2>Dashboard</h2>
                <p>Resumen general del negocio</p>
            </div>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Ventas del Mes</span>
                        <div className="stat-icon dark-blue">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-value">$67,000</div>
                    <div className="stat-change positive">
                        <span>↑ +12%</span>
                        <span>vs mes anterior</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Clientes con Deuda</span>
                        <div className="stat-icon medium-blue">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-value">24</div>
                    <div className="stat-change negative">
                        <span>↓ -5%</span>
                        <span>vs mes anterior</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Pedidos Pendientes</span>
                        <div className="stat-icon light-blue">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M9 2a1 1 0 00-1 1v1H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-4V3a1 1 0 00-1-1H9z" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-value">8</div>
                    <div className="stat-change positive">
                        <span>↑ +3%</span>
                        <span>vs mes anterior</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-title">Productos Bajo Stock</span>
                        <div className="stat-icon medium-blue">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-value">12</div>
                    <div className="stat-change positive">
                        <span>↑ +2%</span>
                        <span>vs mes anterior</span>
                    </div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <div className="chart-title">Ventas y Pedidos - Últimos 6 Meses</div>
                    <canvas id="lineChart"></canvas>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Métodos de Pago</div>
                    <canvas id="pieChart"></canvas>
                </div>
            </div>
        </>
    );

}
