import React, { useState } from "react";
import "../styles/card.css";
import { FaArrowRight, FaUser } from "react-icons/fa";
import { trackCardClick } from "../services/clickStats.service";
import { abrirWhatsApp } from "../utils/whatsapp";
import { getUser } from "../services/auth.service";
import ServiceDetailModal from "./ServiceDetailModal";

export default function PasajeCard({ item, isPreview = false }) {
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
    vendedor,
  } = item;

  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const formatDate = (date) => {
    if (!date) return "Fecha no disponible";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Fecha no disponible";

      return dateObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      });
    } catch (error) {
      return "Fecha no disponible";
    }
  };

  const handleCardClick = () => {
    trackCardClick("pasaje", item.id, `${origen} - ${destino}`).catch(
      console.error,
    );
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp("pasaje", item);
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
        <button
          className="btn-primary"
          onClick={handleReservar}
          disabled={asientosDisponibles === 0 || isPreview}
        >
          {asientosDisponibles > 0 ? "Reservar" : "Sin asientos"}
        </button>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={item}
          tipo="pasaje"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
