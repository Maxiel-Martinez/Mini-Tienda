import { CardsGrid } from '../components/cards/CardsGrid';
import './Sales.css';

const stats = [
  { title: "Ventas Hoy", value: "$0", subtitle: "0 transacciones" },
  { title: "Efectivo", value: "$0", subtitle: "0% del total" },
  { title: "Transferencias", value: "$0", subtitle: "0% del total" },
  { title: "Créditos Pendientes", value: "$0", subtitle: "Por cobrar" },
];

export const Sales = () => {
    return (
        <>
        <CardsGrid arrayCards={stats} />
        <div class="table-section">
            <h2>Historial de Ventas</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Total</th>
                        <th>Método</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
        </>
    );
}
