import React from "react";
import "../styles/card.css";

export default function AutoCard({ item }) {
  const {
    marca,
    modelo,
    categoria,
    año,
    capacidadPasajeros,
    transmision,
    combustible,
    precioDia,
    ubicacion,
    caracteristicas,
    imagenes,
    disponible,
  } = item;

  return (
    <div className="service-card">
      {imagenes && imagenes.length > 0 && (
        <div className="card-image">
          <img src={imagenes[0]} alt={`${marca} ${modelo}`} />
          <span className="tipo-badge tipo-auto">{categoria}</span>
        </div>
      )}

      <div className="card-header">
        <h3 className="card-title">
          {marca} {modelo}
        </h3>
        <p className="empresa">📍 {ubicacion}</p>
      </div>

      <div className="card-content">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Año</span>
            <span className="info-value">{año}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Pasajeros</span>
            <span className="info-value">{capacidadPasajeros}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Transmisión</span>
            <span className="info-value">{transmision}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Combustible</span>
            <span className="info-value">{combustible}</span>
          </div>
        </div>

        {caracteristicas && caracteristicas.length > 0 && (
          <div className="features">
            <ul className="features-list">
              {caracteristicas.slice(0, 4).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="precio-info">
          <span className="precio">${precioDia}</span>
          <span className="precio-unit">/ día</span>
        </div>
        <button className="btn-primary" disabled={!disponible}>
          {disponible ? "Reservar" : "No disponible"}
        </button>
      </div>
    </div>
  );
}
