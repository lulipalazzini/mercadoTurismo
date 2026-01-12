import React from "react";
import "../styles/card.css";

export default function SalidaGrupalCard({ item }) {
  const {
    nombre,
    descripcion,
    destinos,
    fechaSalida,
    fechaRegreso,
    duracion,
    precio,
    cupoDisponible,
    incluye,
    imagenes,
  } = item;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="service-card">
      {imagenes && imagenes.length > 0 && (
        <div className="card-image">
          <img src={imagenes[0]} alt={nombre} />
        </div>
      )}

      <div className="card-header">
        <h3 className="card-title">{nombre}</h3>
        {destinos && destinos.length > 0 && (
          <p className="empresa">🌍 {destinos.slice(0, 2).join(" • ")}</p>
        )}
      </div>

      <div className="card-content">
        <p className="descripcion">
          {descripcion?.length > 120
            ? `${descripcion.substring(0, 120)}...`
            : descripcion}
        </p>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Salida</span>
            <span className="info-value">{formatDate(fechaSalida)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Regreso</span>
            <span className="info-value">{formatDate(fechaRegreso)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Duración</span>
            <span className="info-value">{duracion} días</span>
          </div>
          <div className="info-item">
            <span className="info-label">Cupos</span>
            <span className="info-value">{cupoDisponible}</span>
          </div>
        </div>

        {incluye && incluye.length > 0 && (
          <div className="features">
            <p className="features-label">Incluye:</p>
            <ul className="features-list">
              {incluye.slice(0, 3).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="precio-info">
          <span className="precio-label">Desde</span>
          <span className="precio">${precio}</span>
        </div>
        <button className="btn-primary" disabled={cupoDisponible === 0}>
          {cupoDisponible > 0 ? "Reservar" : "Sin cupos"}
        </button>
      </div>
    </div>
  );
}
