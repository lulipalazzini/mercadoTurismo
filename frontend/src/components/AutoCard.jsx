import React, { useState } from "react";
import "../styles/card.css";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { trackCardClick } from "../services/clickStats.service";
import { getUser } from "../services/auth.service";
import { abrirWhatsApp } from "../utils/whatsapp";
import ServiceDetailModal from "./ServiceDetailModal";

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
    vendedor,
  } = item;

  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const handleCardClick = () => {
    trackCardClick("auto").catch(console.error);
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp('auto', item);
  };

  return (
    <div className="service-card" onClick={handleCardClick}>
      {imagenes && imagenes.length > 0 && (
        <div className="card-image">
          <img src={imagenes[0]} alt={`${marca} ${modelo}`} />
        </div>
      )}

      <div className="card-header">
        <div className="card-header-content">
          <h3 className="card-title">
            {marca} {modelo}
          </h3>
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
            <FaMapMarkerAlt /> {ubicacion}
          </p>
        </div>
        <span className="tipo-badge tipo-auto">{categoria}</span>
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
        <button 
          className="btn-primary" 
          onClick={handleReservar}
          disabled={!disponible}
        >
          {disponible ? "Reservar" : "No disponible"}
        </button>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={item}
          tipo="auto"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
