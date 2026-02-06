import React, { useState } from "react";
import "../styles/card.css";
import { FaArrowRight, FaUser } from "react-icons/fa";
import { abrirWhatsApp } from "../utils/whatsapp";
import { getUser } from "../services/auth.service";
import { trackCardClick } from "../services/clickStats.service";
import ServiceDetailModal from "./ServiceDetailModal";

export default function TransferCard({ item, isPreview = false }) {
  const {
    tipo,
    origen,
    destino,
    tipoVehiculo,
    tipoServicio,
    capacidadPasajeros,
    precio,
    duracionEstimada,
    serviciosIncluidos,
    disponible,
    vendedor,
  } = item;

  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const handleCardClick = () => {
    trackCardClick("transfer", item.id, `${origen} - ${destino}`).catch(
      console.error,
    );
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp("transfer", item);
  };

  return (
    <div className="service-card" onClick={handleCardClick}>
      <div className="card-header">
        <div className="card-header-content">
          <h3 className="card-title">
            {origen} <FaArrowRight /> {destino}
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
              <FaUser style={{ color: "var(--primary)" }} />
              <span style={{ color: "#4a5568", fontWeight: "500" }}>
                {vendedor.razonSocial || vendedor.nombre}
              </span>
            </div>
          )}
          <p className="empresa">{tipoVehiculo}</p>
        </div>
        {tipoServicio && (
          <span
            className="tipo-badge"
            style={{
              backgroundColor:
                tipoServicio === "privado" ? "#4caf50" : "#ff9800",
            }}
          >
            {tipoServicio === "privado" ? "Privado" : "Compartido"}
          </span>
        )}
        {!tipoServicio && <span className="tipo-badge">{tipo}</span>}
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
        <button
          className="btn-primary"
          onClick={handleReservar}
          disabled={!disponible || isPreview}
        >
          {disponible ? "Reservar" : "No disponible"}
        </button>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={item}
          tipo="transfer"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
