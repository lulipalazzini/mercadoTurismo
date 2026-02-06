import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaClipboardList,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import "../../styles/dashboard.css";

export default function ReservasAnotador() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const isAdmin = user.role === "admin" || user.role === "sysadmin";

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/reservas-anotador",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setReservas(data);
      }
    } catch (error) {
      console.error("Error cargando reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReservas = reservas.filter((item) => {
    const matchesSearch =
      item.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.servicio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !estadoFilter || item.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "confirmada":
        return {
          icon: <FaCheckCircle />,
          class: "success",
          text: "Confirmada",
        };
      case "pendiente":
        return { icon: <FaClock />, class: "warning", text: "Pendiente" };
      case "cancelada":
        return { icon: <FaTimesCircle />, class: "danger", text: "Cancelada" };
      default:
        return { icon: <FaClock />, class: "default", text: estado };
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <div className="header-left">
          <FaClipboardList className="section-icon" />
          <div>
            <h1>Reservas (Anotador)</h1>
            <p>Registro interno de reservas - No transaccional</p>
          </div>
        </div>
      </div>

      <div className="section-toolbar">
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Nueva Reserva
        </button>
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <input
              type="text"
              placeholder="Buscar reservas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaClipboardList />
          </div>
          <div className="stat-info">
            <span className="stat-value">{filteredReservas.length}</span>
            <span className="stat-label">Total Reservas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {filteredReservas.filter((r) => r.estado === "confirmada").length}
            </span>
            <span className="stat-label">Confirmadas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaClock />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {filteredReservas.filter((r) => r.estado === "pendiente").length}
            </span>
            <span className="stat-label">Pendientes</span>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservas.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  No hay reservas registradas
                </td>
              </tr>
            ) : (
              filteredReservas.map((reserva) => {
                const badge = getEstadoBadge(reserva.estado);
                return (
                  <tr key={reserva.id}>
                    <td>
                      <strong>{reserva.cliente}</strong>
                    </td>
                    <td>{reserva.servicio}</td>
                    <td>
                      {new Date(reserva.fecha).toLocaleDateString("es-ES")}
                    </td>
                    <td>
                      {reserva.moneda} ${reserva.monto?.toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge badge-${badge.class}`}>
                        {badge.icon} {badge.text}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setEditingItem(reserva);
                          setIsModalOpen(true);
                        }}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ReservaModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={loadReservas}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}

function ReservaModal({ isOpen, onClose, onSave, editingItem }) {
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: "",
    fecha: new Date().toISOString().split("T")[0],
    monto: "",
    moneda: "ARS",
    estado: "pendiente",
    observaciones: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        fecha: editingItem.fecha?.split("T")[0] || "",
      });
    }
  }, [editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingItem
        ? `http://localhost:3000/api/reservas-anotador/${editingItem.id}`
        : "http://localhost:3000/api/reservas-anotador";

      const response = await fetch(url, {
        method: editingItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        onClose();
      }
    } catch (error) {
      console.error("Error guardando reserva:", error);
      alert("Error al guardar la reserva");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaClipboardList /> {editingItem ? "Editar" : "Nueva"} Reserva
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Cliente *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.cliente}
                  onChange={(e) =>
                    setFormData({ ...formData, cliente: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Servicio *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.servicio}
                  onChange={(e) =>
                    setFormData({ ...formData, servicio: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Moneda *</label>
                <select
                  className="form-control"
                  value={formData.moneda}
                  onChange={(e) =>
                    setFormData({ ...formData, moneda: e.target.value })
                  }
                  required
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div className="form-group">
                <label>Monto *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estado *</label>
                <select
                  className="form-control"
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Observaciones</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
