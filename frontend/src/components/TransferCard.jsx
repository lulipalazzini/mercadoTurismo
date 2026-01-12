import React from "react";
import "../styles/card.css";

export default function TransferCard({ item }) {
  const {
    tipo,
    origen,
    destino,
    tipoVehiculo,
    capacidadPasajeros,
    precio,
    duracionEstimada,
    serviciosIncluidos,
    disponible,
  } = item;

  return (
    <div className="service-card">
      <div className="card-header">
        <span className="tipo-badge">{tipo}</span>
        <h3 className="card-title">
          {origen} → {destino}
        </h3>
        <p className="empresa">{tipoVehiculo}</p>
      </div>

      <div className="card-content">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Capacidad</span>
            <span className="info-value">{capacidadPasajeros} pasajeros</span>
          </div>
          <div className="info-item">
            <span className="info-label">Duración</span>
            <span className="info-value">{duracionEstimada} min</span>
          </div>
        </div>

        {serviciosIncluidos && serviciosIncluidos.length > 0 && (
          <div className="features">
            <p className="features-label">Incluye:</p>
            <ul className="features-list">
              {serviciosIncluidos.slice(0, 4).map((item, index) => (
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
        <button className="btn-primary" disabled={!disponible}>
          {disponible ? "Reservar" : "No disponible"}
        </button>
      </div>
    </div>
  );
}
