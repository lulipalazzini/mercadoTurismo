import React from "react";
import "../styles/card.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { trackCardClick } from "../services/clickStats.service";

export default function ExcursionCard({ item }) {
  const {
    nombre,
    descripcion,
    ubicacion,
    duracion,
    precio,
    cupoDisponible,
    nivelDificultad,
    incluye,
    imagenes,
  } = item;

  const handleCardClick = () => {
    trackCardClick("excursion").catch(console.error);
  };

  return (
    <div className="service-card" onClick={handleCardClick}>
      {imagenes && imagenes.length > 0 && (
        <div className="card-image">
          <img src={imagenes[0]} alt={nombre} />
        </div>
      )}

      <div className="card-header">
        <div className="card-header-content">
          <h3 className="card-title">{nombre}</h3>
          <p className="empresa">
            <FaMapMarkerAlt /> {ubicacion}
          </p>
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
            <span className="info-value">{duracion} horas</span>
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
              {incluye.slice(0, 4).map((item, index) => (
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
