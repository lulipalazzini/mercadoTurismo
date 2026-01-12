import React from "react";
import "../styles/card.css";

export default function CupoCard({ item }) {
  const {
    nombre,
    descripcion,
    tipo,
    destino,
    fechaInicio,
    fechaFin,
    precio,
    cuposDisponibles,
    cuposMaximos,
    requisitos,
  } = item;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const porcentajeDisponible = (
    (cuposDisponibles / cuposMaximos) *
    100
  ).toFixed(0);

  return (
    <div className="service-card">
      <div className="card-header">
        <span className="tipo-badge">{tipo}</span>
        <h3 className="card-title">{nombre}</h3>
        <p className="empresa">📍 {destino}</p>
      </div>

      <div className="card-content">
        <p className="descripcion">
          {descripcion?.length > 120
            ? `${descripcion.substring(0, 120)}...`
            : descripcion}
        </p>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Inicio</span>
            <span className="info-value">{formatDate(fechaInicio)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fin</span>
            <span className="info-value">{formatDate(fechaFin)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Cupos</span>
            <span className="info-value">
              {cuposDisponibles}/{cuposMaximos}
            </span>
          </div>
        </div>

        <div className="cupo-bar">
          <div
            className="cupo-bar-fill"
            style={{ width: `${porcentajeDisponible}%` }}
          ></div>
        </div>

        {requisitos && requisitos.length > 0 && (
          <div className="features">
            <p className="features-label">Requisitos:</p>
            <ul className="features-list">
              {requisitos.slice(0, 3).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="precio-info">
          <span className="precio">${precio}</span>
        </div>
        <button className="btn-primary" disabled={cuposDisponibles === 0}>
          {cuposDisponibles > 0 ? "Reservar cupo" : "Sin cupos"}
        </button>
      </div>
    </div>
  );
}
