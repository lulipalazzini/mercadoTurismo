import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaFileInvoiceDollar,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import "../../styles/dashboard.css";

export default function FacturacionAnotador() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const isAdmin = user.role === "admin" || user.role === "sysadmin";

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/facturacion-anotador", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFacturas(data);
      }
    } catch (error) {
      console.error("Error cargando facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFacturas = facturas.filter((item) => {
    const matchesSearch =
      item.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.concepto?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !estadoFilter || item.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "cobrada":
        return { icon: <FaCheckCircle />, class: "success", text: "Cobrada" };
      case "emitida":
        return { icon: <FaClock />, class: "info", text: "Emitida" };
      case "pendiente":
        return { icon: <FaExclamationCircle />, class: "warning", text: "Pendiente" };
      default:
        return { icon: <FaClock />, class: "default", text: estado };
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando facturación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <div className="header-left">
          <FaFileInvoiceDollar className="section-icon" />
          <div>
            <h1>Facturación (Anotador)</h1>
            <p>Registro interno de facturación - No transaccional</p>
          </div>
        </div>
      </div>

      <div className="section-toolbar">
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Nueva Factura
        </button>
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <input
              type="text"
              placeholder="Buscar facturas..."
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
            <option value="emitida">Emitida</option>
            <option value="cobrada">Cobrada</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaFileInvoiceDollar />
          </div>
          <div className="stat-info">
            <span className="stat-value">{filteredFacturas.length}</span>
            <span className="stat-label">Total Facturas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {filteredFacturas.filter((f) => f.estado === "cobrada").length}
            </span>
            <span className="stat-label">Cobradas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaExclamationCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {filteredFacturas.filter((f) => f.estado === "pendiente").length}
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
              <th>Concepto</th>
              <th>Fecha</th>
              <th>Importe</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacturas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                  No hay facturas registradas
                </td>
              </tr>
            ) : (
              filteredFacturas.map((factura) => {
                const badge = getEstadoBadge(factura.estado);
                return (
                  <tr key={factura.id}>
                    <td>
                      <strong>{factura.cliente}</strong>
                    </td>
                    <td>{factura.concepto}</td>
                    <td>{new Date(factura.fecha).toLocaleDateString("es-ES")}</td>
                    <td>
                      {factura.moneda} ${factura.importe?.toLocaleString()}
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
                          setEditingItem(factura);
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
        <FacturaModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={loadFacturas}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}

function FacturaModal({ isOpen, onClose, onSave, editingItem }) {
  const [formData, setFormData] = useState({
    cliente: "",
    concepto: "",
    fecha: new Date().toISOString().split("T")[0],
    importe: "",
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
        ? `http://localhost:3000/api/facturacion-anotador/${editingItem.id}`
        : "http://localhost:3000/api/facturacion-anotador";

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
      console.error("Error guardando factura:", error);
      alert("Error al guardar la factura");
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
            <FaFileInvoiceDollar /> {editingItem ? "Editar" : "Nueva"} Factura
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
                <label>Concepto *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.concepto}
                  onChange={(e) =>
                    setFormData({ ...formData, concepto: e.target.value })
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
                <label>Importe *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.importe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      importe: parseFloat(e.target.value),
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
                  <option value="emitida">Emitida</option>
                  <option value="cobrada">Cobrada</option>
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
