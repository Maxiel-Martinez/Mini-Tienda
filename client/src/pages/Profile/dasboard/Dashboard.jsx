import { CardsGrid } from '../components/cards/CardsGrid';
import './Dashboard.css'

const stats = [
  { title: "Ventas del Mes", value: "$67,000", subtitle: "↑ +12% vs mes anterior" },
  { title: "Clientes con Deuda", value: "24", subtitle: "↓ -5% vs mes anterior" },
  { title: "Pedidos Pendientes", value: "8", subtitle: "↑ +3% vs mes anterior" },
  { title: "Productos Bajo Stock", value: "12", subtitle: "↑ +2% vs mes anterior" },
];

export const Dashboard = () => {
    return (
        <>
            <div className="dashboard-title">
                <h2>Dashboard</h2>
                <p>Resumen general del negocio</p>
            </div>
            <CardsGrid arrayCards={stats} />
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
