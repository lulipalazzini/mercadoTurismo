import React, { useState } from "react";
import { FaMapMarkerAlt, FaStar, FaUser } from "react-icons/fa";
import { trackCardClick } from "../services/clickStats.service";
import { abrirWhatsApp } from "../utils/whatsapp";
import { getUser } from "../services/auth.service";
import ServiceDetailModal from "./ServiceDetailModal";

export default function AlojamientoCard({ alojamiento }) {
  const [showModal, setShowModal] = useState(false);

  const {
    id,
    nombre,
    tipo,
    ubicacion,
    estrellas,
    precioNoche,
    imagenes,
    descripcion,
    servicios,
    habitacionesDisponibles,
    vendedor,
  } = alojamiento;

  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const renderEstrellas = () => {
    return (
      <div className="estrellas">
        {[...Array(estrellas || 0)].map((_, i) => (
          <span key={i} className="estrella">
            <FaStar />
          </span>
        ))}
      </div>
    );
  };

  const handleVerDetalles = () => {
    // Trackear click en segundo plano
    trackCardClick("alojamiento").catch(console.error);
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp("alojamiento", alojamiento);
  };

  return (
    <>
      <div className="alojamiento-card" onClick={handleVerDetalles}>
        <div className="card-image">
          {imagenes && imagenes.length > 0 ? (
            <img src={imagenes[0]} alt={nombre} />
          ) : (
            <div className="placeholder-image">Sin imagen</div>
          )}
          <span className="tipo-badge">{tipo}</span>
        </div>

        <div className="card-content">
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

          {estrellas > 0 && renderEstrellas()}

          <div className="ubicacion-info">
            <span className="location-icon">
              <FaMapMarkerAlt />
            </span>
            <span className="ubicacion">{ubicacion}</span>
          </div>

          {descripcion && (
            <p className="card-descripcion">
              {descripcion.length > 120
                ? `${descripcion.substring(0, 120)}...`
                : descripcion}
            </p>
          )}

          {servicios && servicios.length > 0 && (
            <div className="card-servicios">
              {servicios.slice(0, 3).map((servicio, index) => (
                <span key={index} className="servicio-item">
                  {servicio}
                </span>
              ))}
              {servicios.length > 3 && (
                <span className="servicio-item more">
                  +{servicios.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="card-footer">
            <div className="precio-info">
              <span className="precio-label">Desde</span>
              <div>
                <span className="precio">
                  ${precioNoche?.toLocaleString("es-AR")}
                </span>
              </div>
              <span className="precio-unit">por noche</span>
            </div>
            <button
              className="btn-primary"
              onClick={handleReservar}
              disabled={habitacionesDisponibles === 0}
            >
              {habitacionesDisponibles > 0 ? "Reservar" : "Sin habitaciones"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={alojamiento}
          tipo="alojamiento"
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
