import React from "react";
import "../styles/card.css";
import { FaGlobe } from "react-icons/fa";

export default function CircuitoCard({ item }) {
  const {
    nombre,
    descripcion,
    destinos,
    duracion,
    precio,
    cupoDisponible,
    fechaInicio,
    fechaFin,
    nivelDificultad,
    incluye,
    imagenes,
  } = item;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
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
        <div className="card-header-content">
          <h3 className="card-title">{nombre}</h3>
          {destinos && destinos.length > 0 && (
            <p className="empresa">
              <FaGlobe /> {destinos.slice(0, 3).join(" • ")}
            </p>
          )}
        </div>
        <span className="tipo-badge">{nivelDificultad}</span>
      </div>

      <div className="card-content">
        <p className="descripcion">
          {descripcion?.length > 120
            ? `${descripcion.substring(0, 120)}...`
            : descripcion}
        </p>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Duración</span>
            <span className="info-value">{duracion} días</span>
          </div>
          <div className="info-item">
            <span className="info-label">Inicio</span>
            <span className="info-value">{formatDate(fechaInicio)}</span>
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
