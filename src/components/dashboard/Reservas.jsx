import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCog,
  FaClipboardList,
  FaCheckCircle,
  FaDollarSign,
  FaMoneyBillWave,
  FaEye,
  FaEdit,
  FaEllipsisV,
  FaUsers,
} from "react-icons/fa";

export default function Reservas() {
  const [reservas] = useState([
    {
      id: 1,
      codigo: "RES-2024-001",
      cliente: "Juan Pérez",
      paquete: "Mendoza Premium 5 días",
      estado: "Confirmada",
      fechaViaje: "2025-02-15",
      pasajeros: 4,
      valor: 450000,
      comision: 45000,
    },
    {
      id: 2,
      codigo: "RES-2024-002",
      cliente: "María González",
      paquete: "Bariloche Ski Week",
      estado: "Pendiente",
      fechaViaje: "2025-03-01",
      pasajeros: 2,
      valor: 380000,
      comision: 38000,
    },
    {
      id: 3,
      codigo: "RES-2024-003",
      cliente: "Carlos Rodríguez",
      paquete: "Cataratas del Iguazú",
      estado: "Confirmada",
      fechaViaje: "2025-01-20",
      pasajeros: 3,
      valor: 320000,
      comision: 32000,
    },
    {
      id: 4,
      codigo: "RES-2024-004",
      cliente: "Ana Martínez",
      paquete: "Buenos Aires Cultural",
      estado: "Cotización",
      fechaViaje: "2025-04-10",
      pasajeros: 2,
      valor: 280000,
      comision: 28000,
    },
  ]);

  const getStatusClass = (estado) => {
    const statusMap = {
      Confirmada: "status-confirmed",
      Pendiente: "status-pending",
      Cotización: "status-quote",
      Cancelada: "status-cancelled",
    };
    return statusMap[estado] || "";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const totalReservas = reservas.reduce((sum, r) => sum + r.valor, 0);
  const totalComisiones = reservas.reduce((sum, r) => sum + r.comision, 0);

  return (
    <div className="section-container">
      {/* Toolbar */}
      <div className="section-toolbar">
        <button className="btn-primary">
          <FaPlus /> Nueva Reserva
        </button>
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar reservas..." />
          </div>
          <button className="btn-secondary">
            <FaFilter /> Filtrar
          </button>
          <button className="btn-secondary">
            <FaCog /> Agrupar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h3>{reservas.length}</h3>
            <p>Total Reservas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{reservas.filter((r) => r.estado === "Confirmada").length}</h3>
            <p>Confirmadas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalReservas)}</h3>
            <p>Valor Total</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalComisiones)}</h3>
            <p>Comisiones</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Código</th>
              <th>Cliente</th>
              <th>Paquete</th>
              <th>Estado</th>
              <th>Fecha Viaje</th>
              <th>Pasajeros</th>
              <th>Valor</th>
              <th>Comisión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="cell-code">{reserva.codigo}</td>
                <td>
                  <div className="cell-client">
                    <div className="client-avatar">
                      {reserva.cliente
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span>{reserva.cliente}</span>
                  </div>
                </td>
                <td className="cell-package">{reserva.paquete}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(reserva.estado)}`}
                  >
                    {reserva.estado}
                  </span>
                </td>
                <td className="cell-date">
                  {new Date(reserva.fechaViaje).toLocaleDateString("es-AR")}
                </td>
                <td className="cell-center">
                  <span className="passenger-badge">
                    <FaUsers /> {reserva.pasajeros}
                  </span>
                </td>
                <td className="cell-money">{formatCurrency(reserva.valor)}</td>
                <td className="cell-money cell-commission">
                  {formatCurrency(reserva.comision)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-icon" title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-icon" title="Más">
                      <FaEllipsisV />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="table-summary">
        <div className="summary-item">
          <strong>Total:</strong> {reservas.length} reservas
        </div>
        <div className="summary-item">
          <strong>Valor Total:</strong> {formatCurrency(totalReservas)}
        </div>
        <div className="summary-item">
          <strong>Comisiones:</strong> {formatCurrency(totalComisiones)}
        </div>
      </div>
    </div>
  );
}
