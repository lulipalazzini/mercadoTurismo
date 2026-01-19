import React, { useState } from "react";
import "../styles/card.css";
import { FaGlobe, FaUser } from "react-icons/fa";
import { abrirWhatsApp } from "../utils/whatsapp";
import { getUser } from "../services/auth.service";
import { trackCardClick } from "../services/clickStats.service";
import ServiceDetailModal from "./ServiceDetailModal";

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
    vendedor,
  } = item;

  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const handleCardClick = () => {
    trackCardClick("seguro").catch(console.error);
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp('seguro', item);
  };

  return (
    <div className="service-card" onClick={handleCardClick}>
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
          <p className="aseguradora">{aseguradora}</p>
        </div>
        <span className="tipo-badge tipo-seguro">{tipo}</span>
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
            <span className="destinos-icon">
              <FaGlobe />
            </span>
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
        <button className="btn-primary" onClick={handleReservar}>Reservar</button>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={item}
          tipo="seguro"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
