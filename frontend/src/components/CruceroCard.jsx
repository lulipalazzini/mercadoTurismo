import React, { useState } from "react";
import "../styles/card.css";
import { FaShip, FaUser } from "react-icons/fa";
import { trackCardClick } from "../services/clickStats.service";
import { abrirWhatsApp } from "../utils/whatsapp";
import { getUser } from "../services/auth.service";
import ServiceDetailModal from "./ServiceDetailModal";

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
    vendedor,
  } = item;

  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCardClick = () => {
    trackCardClick("crucero", item.id, nombre).catch(console.error);
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp("crucero", item);
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
          {isAdmin && vendedor && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "#f7fafc",
                borderRadius: "0.375rem",
                marginBottom: "0.75rem",
                fontSize: "0.875rem",
              }}
            >
              <FaUser style={{ color: "#667eea" }} />
              <span style={{ color: "#4a5568", fontWeight: "500" }}>
                {vendedor.razonSocial || vendedor.nombre}
              </span>
            </div>
          )}
          <p className="empresa">
            <FaShip /> {naviera} • {barco}
          </p>
        </div>
        <span className="tipo-badge tipo-crucero">{duracion}N</span>
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
        <button
          className="btn-primary"
          onClick={handleReservar}
          disabled={cabinasDisponibles === 0}
        >
          {cabinasDisponibles > 0 ? "Reservar" : "Sin cabinas"}
        </button>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={item}
          tipo="crucero"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
