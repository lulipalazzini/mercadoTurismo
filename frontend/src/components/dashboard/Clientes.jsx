import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFileExport,
  FaUsers,
  FaStar,
  FaDollarSign,
  FaChartLine,
  FaEnvelope,
  FaPhone,
  FaClipboardList,
  FaEye,
  FaEdit,
  FaEllipsisV,
} from "react-icons/fa";

export default function Clientes() {
  const [clientes] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@email.com",
      telefono: "+54 11 1234-5678",
      reservas: 3,
      totalGastado: 1250000,
      ultimaReserva: "2025-01-15",
      estado: "Activo",
      tipo: "Frecuente",
    },
    {
      id: 2,
      nombre: "María González",
      email: "maria.gonzalez@email.com",
      telefono: "+54 11 2345-6789",
      reservas: 1,
      totalGastado: 380000,
      ultimaReserva: "2025-01-10",
      estado: "Activo",
      tipo: "Nuevo",
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      telefono: "+54 11 3456-7890",
      reservas: 5,
      totalGastado: 2100000,
      ultimaReserva: "2024-12-20",
      estado: "VIP",
      tipo: "Frecuente",
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      email: "ana.martinez@email.com",
      telefono: "+54 11 4567-8901",
      reservas: 2,
      totalGastado: 760000,
      ultimaReserva: "2024-12-15",
      estado: "Activo",
      tipo: "Regular",
    },
    {
      id: 5,
      nombre: "Roberto Sánchez",
      email: "roberto.sanchez@email.com",
      telefono: "+54 11 5678-9012",
      reservas: 7,
      totalGastado: 3200000,
      ultimaReserva: "2025-01-20",
      estado: "VIP",
      tipo: "Frecuente",
    },
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getStatusClass = (estado) => {
    const statusMap = {
      Activo: "status-active",
      VIP: "status-vip",
      Inactivo: "status-inactive",
    };
    return statusMap[estado] || "";
  };

  const getTipoClass = (tipo) => {
    const tipoMap = {
      Nuevo: "tipo-new",
      Regular: "tipo-regular",
      Frecuente: "tipo-frequent",
    };
    return tipoMap[tipo] || "";
  };

  const totalClientes = clientes.length;
  const clientesVIP = clientes.filter((c) => c.estado === "VIP").length;
  const totalFacturado = clientes.reduce((sum, c) => sum + c.totalGastado, 0);

  return (
    <div className="section-container">
      {/* Toolbar */}
      <div className="section-toolbar">
        <button className="btn-primary">
          <FaPlus /> Nuevo Cliente
        </button>
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar clientes..." />
          </div>
          <select className="filter-select">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>VIP</option>
            <option>Inactivo</option>
          </select>
          <button className="btn-secondary">
            <FaFileExport /> Exportar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{totalClientes}</h3>
            <p>Total Clientes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaStar />
          </div>
          <div className="stat-content">
            <h3>{clientesVIP}</h3>
            <p>Clientes VIP</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalFacturado)}</h3>
            <p>Facturación Total</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalFacturado / totalClientes)}</h3>
            <p>Ticket Promedio</p>
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
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Reservas</th>
              <th>Total Gastado</th>
              <th>Última Reserva</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <div className="cell-client">
                    <div className="client-avatar-large">
                      {cliente.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="client-info">
                      <strong>{cliente.nombre}</strong>
                      <span className="client-id">ID: #{cliente.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div className="contact-item">
                      <FaEnvelope /> {cliente.email}
                    </div>
                    <div className="contact-item">
                      <FaPhone /> {cliente.telefono}
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(cliente.estado)}`}
                  >
                    {cliente.estado}
                  </span>
                </td>
                <td>
                  <span className={`tipo-badge ${getTipoClass(cliente.tipo)}`}>
                    {cliente.tipo}
                  </span>
                </td>
                <td className="cell-center">
                  <span className="reservas-badge">
                    <FaClipboardList /> {cliente.reservas}
                  </span>
                </td>
                <td className="cell-money cell-highlight">
                  {formatCurrency(cliente.totalGastado)}
                </td>
                <td className="cell-date">
                  {new Date(cliente.ultimaReserva).toLocaleDateString("es-AR")}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-icon" title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-icon" title="Email">
                      <FaEnvelope />
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
          <strong>Total:</strong> {totalClientes} clientes
        </div>
        <div className="summary-item">
          <strong>VIP:</strong> {clientesVIP} clientes
        </div>
        <div className="summary-item">
          <strong>Facturación Total:</strong> {formatCurrency(totalFacturado)}
        </div>
      </div>
    </div>
  );
}
