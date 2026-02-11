import React, { useState } from "react";
import "../styles/card.css";
import { FaGlobe, FaUser } from "react-icons/fa";
import { trackCardClick } from "../services/clickStats.service";
import { abrirWhatsApp } from "../utils/whatsapp";
import { getUser } from "../services/auth.service";
import { getFirstImageUrl } from "../utils/imageUtils";
import ServiceDetailModal from "./ServiceDetailModal";

export default function CircuitoCard({ item, isPreview = false }) {
  const {
    nombre,
    descripcion,
    destinos,
    duracion,
    precio,
    cupoDisponible,
    fechaInicio,
    fechaFin,
    nivelDificultad,
    incluye,
    imagenes,
    vendedor,
  } = item;

  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";
  const imageUrl = getFirstImageUrl(imagenes);

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
    trackCardClick("circuito", item.id, nombre).catch(console.error);
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp("circuito", item);
  };

  return (
    <div className="service-card" onClick={handleCardClick}>
      {imageUrl && (
        <div className="card-image">
          <img src={imageUrl} alt={nombre} />
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
          {destinos && destinos.length > 0 && (
            <p className="empresa">
              <FaGlobe /> {destinos.slice(0, 3).join(" • ")}
            </p>
          )}
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
            <span className="info-value">{duracion} días</span>
          </div>
          <div className="info-item">
            <span className="info-label">Inicio</span>
            <span className="info-value">{formatDate(fechaInicio)}</span>
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
              {incluye.slice(0, 3).map((item, index) => (
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
          disabled={cupoDisponible === 0 || isPreview}
        >
          {cupoDisponible > 0 ? "Reservar" : "Sin cupos"}
        </button>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={item}
          tipo="circuito"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
