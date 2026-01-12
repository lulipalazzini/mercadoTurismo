import React from "react";
import "../styles/card.css";

export default function SeguroCard({ item }) {
  const {
    nombre,
    aseguradora,
    tipo,
    descripcion,
    cobertura,
    montoCobertura,
    precio,
    duracionMaxima,
    edadMinima,
    edadMaxima,
    destinosIncluidos,
  } = item;

  return (
    <div className="service-card">
      <div className="card-header">
        <span className="tipo-badge tipo-seguro">{tipo}</span>
        <h3 className="card-title">{nombre}</h3>
        <p className="aseguradora">{aseguradora}</p>
      </div>

      <div className="card-content">
        <p className="descripcion">
          {descripcion?.length > 120
            ? `${descripcion.substring(0, 120)}...`
            : descripcion}
        </p>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Cobertura</span>
            <span className="info-value">
              ${montoCobertura?.toLocaleString()}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Duración máx.</span>
            <span className="info-value">{duracionMaxima} días</span>
          </div>
          <div className="info-item">
            <span className="info-label">Edad</span>
            <span className="info-value">
              {edadMinima}-{edadMaxima} años
            </span>
          </div>
        </div>

        {cobertura && cobertura.length > 0 && (
          <div className="features">
            <p className="features-label">Incluye:</p>
            <ul className="features-list">
              {cobertura.slice(0, 3).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
              {cobertura.length > 3 && <li>+{cobertura.length - 3} más</li>}
            </ul>
          </div>
        )}

        {destinosIncluidos && destinosIncluidos.length > 0 && (
          <div className="destinos">
            <span className="destinos-icon">🌍</span>
            <span className="destinos-text">
              {destinosIncluidos.slice(0, 2).join(", ")}
              {destinosIncluidos.length > 2 &&
                ` +${destinosIncluidos.length - 2}`}
            </span>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="precio-info">
          <span className="precio-label">Desde</span>
          <span className="precio">${precio}</span>
        </div>
        <button className="btn-primary">Ver detalles</button>
      </div>
    </div>
  );
}
