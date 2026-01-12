import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaDownload,
  FaEye,
  FaEdit,
  FaPaperPlane,
} from "react-icons/fa";

export default function Facturacion() {
  const [facturas] = useState([
    {
      id: 1,
      numero: "FAC-2024-001",
      cliente: "María González",
      concepto: "Bariloche Ski Week - 2 pasajeros",
      fecha: "2024-12-15",
      vencimiento: "2025-01-14",
      monto: 380000,
      estado: "Pagada",
    },
    {
      id: 2,
      numero: "FAC-2024-002",
      cliente: "Carlos Rodríguez",
      concepto: "Cataratas del Iguazú - 3 pasajeros",
      fecha: "2024-12-18",
      vencimiento: "2025-01-17",
      monto: 320000,
      estado: "Pendiente",
    },
    {
      id: 3,
      numero: "FAC-2024-003",
      cliente: "Juan Pérez",
      concepto: "Mendoza Premium 5 días - 4 pasajeros",
      fecha: "2024-12-20",
      vencimiento: "2025-01-19",
      monto: 450000,
      estado: "Pagada",
    },
    {
      id: 4,
      numero: "FAC-2024-004",
      cliente: "Ana Martínez",
      concepto: "Buenos Aires Cultural - 2 pasajeros",
      fecha: "2024-12-22",
      vencimiento: "2025-01-21",
      monto: 280000,
      estado: "Vencida",
    },
    {
      id: 5,
      numero: "FAC-2024-005",
      cliente: "Roberto Silva",
      concepto: "Salta y Jujuy 7 días - 2 pasajeros",
      fecha: "2024-12-23",
      vencimiento: "2025-01-22",
      monto: 410000,
      estado: "Pendiente",
    },
  ]);

  const getStatusClass = (estado) => {
    const statusMap = {
      Pagada: "status-confirmed",
      Pendiente: "status-quote",
      Vencida: "status-pending",
      Cancelada: "status-cancelled",
    };
    return statusMap[estado] || "";
  };

  const getStatusIcon = (estado) => {
    const iconMap = {
      Pagada: <FaCheckCircle />,
      Pendiente: <FaClock />,
      Vencida: <FaTimesCircle />,
      Cancelada: <FaTimesCircle />,
    };
    return iconMap[estado] || null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const totalFacturado = facturas.reduce((sum, f) => sum + f.monto, 0);
  const totalPagado = facturas
    .filter((f) => f.estado === "Pagada")
    .reduce((sum, f) => sum + f.monto, 0);
  const totalPendiente = facturas
    .filter((f) => f.estado === "Pendiente")
    .reduce((sum, f) => sum + f.monto, 0);
  const totalVencido = facturas
    .filter((f) => f.estado === "Vencida")
    .reduce((sum, f) => sum + f.monto, 0);

  return (
    <div className="section-container">
      {/* Toolbar */}
      <div className="section-toolbar">
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar facturas..." />
          </div>
          <select className="filter-select">
            <FaFilter />
            <option>Todos los estados</option>
            <option>Pagadas</option>
            <option>Pendientes</option>
            <option>Vencidas</option>
          </select>
        </div>
        <button className="btn-primary">
          <FaPlus /> Nueva Factura
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaFileInvoiceDollar style={{ color: "#1976d2" }} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalFacturado)}</h3>
            <p>Total Facturado</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaCheckCircle style={{ color: "#388e3c" }} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalPagado)}</h3>
            <p>Total Cobrado</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaClock style={{ color: "#f57c00" }} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalPendiente)}</h3>
            <p>Pendiente de Cobro</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ffebee" }}>
            <FaTimesCircle style={{ color: "#c62828" }} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalVencido)}</h3>
            <p>Vencido</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Concepto</th>
              <th>Fecha</th>
              <th>Vencimiento</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id}>
                <td className="cell-code">{factura.numero}</td>
                <td>
                  <div className="cell-client">
                    <div className="client-avatar">
                      {factura.cliente
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span>{factura.cliente}</span>
                  </div>
                </td>
                <td className="cell-package">{factura.concepto}</td>
                <td className="cell-date">
                  {new Date(factura.fecha).toLocaleDateString("es-AR")}
                </td>
                <td className="cell-date">
                  {new Date(factura.vencimiento).toLocaleDateString("es-AR")}
                </td>
                <td className="cell-money">{formatCurrency(factura.monto)}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(factura.estado)}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    {getStatusIcon(factura.estado)}
                    {factura.estado}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-icon" title="Descargar">
                      <FaDownload />
                    </button>
                    {factura.estado !== "Pagada" && (
                      <>
                        <button className="btn-icon" title="Editar">
                          <FaEdit />
                        </button>
                        <button className="btn-icon" title="Enviar">
                          <FaPaperPlane />
                        </button>
                      </>
                    )}
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
          <strong>Total:</strong> {facturas.length} facturas
        </div>
        <div className="summary-item">
          <strong>Monto Total:</strong> {formatCurrency(totalFacturado)}
        </div>
      </div>
    </div>
  );
}
