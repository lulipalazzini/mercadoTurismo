import React from "react";
import "../styles/card.css";
import { FaArrowRight } from "react-icons/fa";

export default function PasajeCard({ item }) {
  const {
    tipo,
    origen,
    destino,
    aerolinea,
    numeroVuelo,
    fechaSalida,
    horaSalida,
    fechaLlegada,
    horaLlegada,
    clase,
    precio,
    asientosDisponibles,
  } = item;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  const handleCardClick = () => {
    trackCardClick("pasaje").catch(console.error);
  };

  return (
    <div className="service-card" onClick={handleCardClick}>
      <div className="card-header">
        <div className="card-header-content">
          <h3 className="card-title">
            {origen} <FaArrowRight /> {destino}
          </h3>
          {aerolinea && (
            <p className="empresa">
              {aerolinea} {numeroVuelo && `• ${numeroVuelo}`}
            </p>
          )}
        </div>
        <span className="tipo-badge">{tipo}</span>
      </div>

      <div className="card-content">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Salida</span>
            <span className="info-value">{formatDate(fechaSalida)}</span>
            {horaSalida && <span className="info-time">{horaSalida}</span>}
          </div>
          <div className="info-item">
            <span className="info-label">Llegada</span>
            <span className="info-value">{formatDate(fechaLlegada)}</span>
            {horaLlegada && <span className="info-time">{horaLlegada}</span>}
          </div>
          <div className="info-item">
            <span className="info-label">Clase</span>
            <span className="info-value">{clase}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Disponibles</span>
            <span className="info-value">{asientosDisponibles}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="precio-info">
          <span className="precio-label">Desde</span>
          <span className="precio">${precio}</span>
        </div>
        <button className="btn-primary" disabled={asientosDisponibles === 0}>
          {asientosDisponibles > 0 ? "Reservar" : "Sin asientos"}
        </button>
      </div>
    </div>
  );
}
