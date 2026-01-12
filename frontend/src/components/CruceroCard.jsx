import React from "react";
import "../styles/card.css";

export default function CruceroCard({ item }) {
  const {
    nombre,
    naviera,
    barco,
    descripcion,
    duracion,
    fechaSalida,
    fechaRegreso,
    puertoSalida,
    puertoLlegada,
    precioDesde,
    cabinasDisponibles,
    itinerario,
    serviciosABordo,
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
          <span className="tipo-badge tipo-crucero">{duracion} noches</span>
        </div>
      )}

      <div className="card-header">
        <h3 className="card-title">{nombre}</h3>
        <p className="empresa">
          {naviera} • {barco}
        </p>
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
            <span className="info-time">{puertoSalida}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Regreso</span>
            <span className="info-value">{formatDate(fechaRegreso)}</span>
            <span className="info-time">{puertoLlegada}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Cabinas</span>
            <span className="info-value">{cabinasDisponibles}</span>
          </div>
        </div>

        {itinerario && itinerario.length > 0 && (
          <div className="destinos">
            <span className="destinos-icon">⚓</span>
            <span className="destinos-text">
              {itinerario
                .slice(0, 3)
                .map((p) => p.puerto || p)
                .join(" • ")}
              {itinerario.length > 3 && ` +${itinerario.length - 3}`}
            </span>
          </div>
        )}

        {serviciosABordo && serviciosABordo.length > 0 && (
          <div className="features">
            <p className="features-label">A bordo:</p>
            <ul className="features-list">
              {serviciosABordo.slice(0, 3).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="precio-info">
          <span className="precio-label">Desde</span>
          <span className="precio">${precioDesde}</span>
        </div>
        <button className="btn-primary" disabled={cabinasDisponibles === 0}>
          {cabinasDisponibles > 0 ? "Ver cabinas" : "Sin cabinas"}
        </button>
      </div>
    </div>
  );
}
