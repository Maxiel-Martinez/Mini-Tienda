import { CardsGrid } from '../components/cards/CardsGrid';
import { TitleSection } from '../components/titleSection/TitleSection';
import './Dashboard.css'

const stats = [
  {
    title: "Ventas del Mes",
    value: "$67,000",
    trend: "↑ +12%",
    comparison: "vs mes anterior",
    iconClassName: "dark-blue",
    accentClassName: "accent-dark-blue",
    cardClassName: "theme-dark-blue",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    title: "Clientes con Deuda",
    value: "24",
    trend: "↓ -5%",
    comparison: "vs mes anterior",
    iconClassName: "medium-blue",
    accentClassName: "accent-medium-blue",
    cardClassName: "theme-medium-blue",
    trendClassName: "negative",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
      </svg>
    ),
  },
  {
    title: "Pedidos Pendientes",
    value: "8",
    trend: "↑ +3%",
    comparison: "vs mes anterior",
    iconClassName: "light-blue",
    accentClassName: "accent-light-blue",
    cardClassName: "theme-light-blue",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9 2a1 1 0 00-1 1v1H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-4V3a1 1 0 00-1-1H9z" />
      </svg>
    ),
  },
  {
    title: "Productos Bajo Stock",
    value: "12",
    trend: "↑ +2%",
    comparison: "vs mes anterior",
    iconClassName: "medium-blue",
    accentClassName: "accent-green",
    cardClassName: "theme-medium-blue",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
];

const monthlyOverview = [
  { month: 'Ene', sales: 45000, orders: 15000 },
  { month: 'Feb', sales: 52000, orders: 17000 },
  { month: 'Mar', sales: 48000, orders: 16000 },
  { month: 'Abr', sales: 63000, orders: 19000 },
  { month: 'May', sales: 55000, orders: 17500 },
  { month: 'Jun', sales: 70000, orders: 20000 },
];

const paymentMethods = [
  { label: 'Efectivo', value: 45, className: 'payment-fill-light' },
  { label: 'Transferencia', value: 35, className: 'payment-fill-medium' },
];

export const Dashboard = () => {
  const maxSales = Math.max(...monthlyOverview.map((item) => item.sales));
  const maxOrders = Math.max(...monthlyOverview.map((item) => item.orders));

  return (
    <>
      <TitleSection title="Dashboard" subtitle="Resumen general del negocio" />
      <CardsGrid arrayCards={stats} />
      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-title">Ventas y Pedidos - Últimos 6 Meses</div>
          <div className="trend-chart" aria-label="Resumen de ventas y pedidos de los últimos seis meses">
            {monthlyOverview.map((item) => (
              <div className="trend-row" key={item.month}>
                <span className="trend-month">{item.month}</span>
                <div className="trend-bars">
                  <div
                    className="trend-bar trend-bar-sales"
                    style={{ width: `${(item.sales / maxSales) * 100}%` }}
                  >
                    <span>${item.sales.toLocaleString('es-CO')}</span>
                  </div>
                  <div
                    className="trend-bar trend-bar-orders"
                    style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                  >
                    <span>${item.orders.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span><i className="legend-dot legend-sales"></i>Ventas</span>
            <span><i className="legend-dot legend-orders"></i>Pedidos</span>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Métodos de Pago</div>
          <div className="payment-list" aria-label="Distribución de métodos de pago">
            {paymentMethods.map((method) => (
              <div className="payment-item" key={method.label}>
                <div className="payment-label-row">
                  <span>{method.label}</span>
                  <strong>{method.value}%</strong>
                </div>
                <div className="payment-track">
                  <div
                    className={`payment-fill ${method.className}`}
                    style={{ width: `${method.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

}
