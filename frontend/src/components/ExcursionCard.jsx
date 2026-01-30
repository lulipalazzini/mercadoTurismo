import React, { useState } from "react";
import "../styles/card.css";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { trackCardClick } from "../services/clickStats.service";
import { abrirWhatsApp } from "../utils/whatsapp";
import { getUser } from "../services/auth.service";
import ServiceDetailModal from "./ServiceDetailModal";

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
    vendedor,
  } = item;

  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const handleCardClick = () => {
    trackCardClick("excursion", item.id, nombre).catch(console.error);
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp("excursion", item);
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
              <FaUser style={{ color: "var(--primary)" }} />
              <span style={{ color: "#4a5568", fontWeight: "500" }}>
                {vendedor.razonSocial || vendedor.nombre}
              </span>
            </div>
          )}
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
        <button
          className="btn-primary"
          onClick={handleReservar}
          disabled={cupoDisponible === 0}
        >
          {cupoDisponible > 0 ? "Reservar" : "Sin cupos"}
        </button>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={item}
          tipo="excursion"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
