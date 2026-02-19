import React from 'react';
import './ventas.css';

export const Ventas = () => {
    return (
        <>
            <div class="cards-grid">
                <div class="card">
                    <div class="card-title">Ventas Hoy</div>
                    <div class="card-amount">$0</div>
                    <div class="card-subtitle">0 transacciones</div>
                </div>

                <div class="card">
                    <div class="card-title">Efectivo</div>
                    <div class="card-amount">$0</div>
                    <div class="card-subtitle">0% del total</div>
                </div>

                <div class="card">
                    <div class="card-title">Transferencias</div>
                    <div class="card-amount">$0</div>
                    <div class="card-subtitle">0% del total</div>
                </div>

                <div class="card">
                    <div class="card-title">Créditos Pendientes</div>
                    <div class="card-amount">$0</div>
                    <div class="card-subtitle">Por cobrar</div>
                </div>
            </div>

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
