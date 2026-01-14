import React from "react";
import "../styles/card.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function CupoCard({ item }) {
  const {
    tipoServicio,
    servicioId,
    fecha,
    cupoTotal,
    cupoReservado,
    cupoDisponible,
    precioAjustado,
    estado,
    notas,
  } = item;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const porcentajeDisponible = ((cupoDisponible / cupoTotal) * 100).toFixed(0);
  
  const getEstadoColor = () => {
    switch (estado) {
      case "disponible":
        return "success";
      case "limitado":
        return "warning";
      case "agotado":
        return "danger";
      case "bloqueado":
        return "info";
      default:
        return "default";
    }
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      paquete: "Paquete",
      alojamiento: "Alojamiento",
      excursion: "Excursión",
      circuito: "Circuito",
      salida_grupal: "Salida Grupal",
      crucero: "Crucero",
      pasaje: "Pasaje",
      otro: "Otro",
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="service-card">
      <div className="card-header">
        <div className="card-header-content">
          <h3 className="card-title">
            {getTipoLabel(tipoServicio)} #{servicioId}
          </h3>
          <p className="empresa"><FaCalendarAlt /> {formatDate(fecha)}</p>
        </div>
        <span className="tipo-badge">{getTipoLabel(tipoServicio)}</span>
      </div>

      <div className="card-content">
        {notas && (
          <p className="descripcion">
            {notas.length > 120 ? `${notas.substring(0, 120)}...` : notas}
          </p>
        )}

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Total</span>
            <span className="info-value">{cupoTotal}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Reservado</span>
            <span className="info-value">{cupoReservado}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Disponible</span>
            <span className="info-value">{cupoDisponible}</span>
          </div>
        </div>

        <div className="cupo-bar">
          <div
            className={`cupo-bar-fill ${getEstadoColor()}`}
            style={{ width: `${porcentajeDisponible}%` }}
          ></div>
        </div>

        <div className="card-footer">
          <div className="price">
            {precioAjustado && (
              <>
                <span className="price-label">Precio:</span>
                <span className="price-value">
                  ${precioAjustado.toLocaleString()}
                </span>
              </>
            )}
          </div>
          <span className={`status-badge ${getEstadoColor()}`}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
