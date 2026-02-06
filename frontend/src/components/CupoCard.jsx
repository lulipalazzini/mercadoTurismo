import React from "react";
import "../styles/card.css";
import { FaCalendarAlt, FaPlane } from "react-icons/fa";

export default function CupoCard({ item }) {
  if (!item) return null;

  const {
    aerolinea,
    descripcion,
    cantidad,
    precioMinorista,
    fechaVencimiento,
    fechaOrigen,
    estado,
    observaciones,
  } = item;

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "N/A";

      return dateObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getEstadoColor = () => {
    switch (estado) {
      case "disponible":
        return "success";
      case "vendido":
        return "danger";
      case "vencido":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="service-card">
      <div className="card-header">
        <div className="card-header-content">
          <h3 className="card-title">
            <FaPlane style={{ marginRight: "0.5rem" }} />
            {aerolinea || "Vuelo"}
          </h3>
          <p className="empresa">
            <FaCalendarAlt /> Fecha vuelo: {formatDate(fechaOrigen)}
          </p>
        </div>
        <span className="tipo-badge">Aéreo</span>
      </div>

      <div className="card-content">
        <p className="descripcion">
          {descripcion && descripcion.length > 120
            ? `${descripcion.substring(0, 120)}...`
            : descripcion || "Sin descripción"}
        </p>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Disponibles</span>
            <span className="info-value">{cantidad}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Vencimiento</span>
            <span className="info-value">{formatDate(fechaVencimiento)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Precio</span>
            <span className="info-value">
              {formatCurrency(precioMinorista)}
            </span>
          </div>
        </div>>
            <span className="info-label">Precio</span>
            <span className="info-value">
              {formatCurrency(precioMinorista)}
            </span>
          </div>
        </div>

        {observaciones && (
          <div className="cupo-observaciones">
            <p className="observaciones-text">{observaciones}</p>
          </div>
        )}

        <div className="card-footer">
          <div className="price">
            <span className="price-label">Precio por unidad:</span>
            <span className="price-value">
              {formatCurrency(precioMinorista)}
            </span>
          </div>
          <span className={`status-badge ${getEstadoColor()}`}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
