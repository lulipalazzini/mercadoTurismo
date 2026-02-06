import React, { useState } from "react";
import "../styles/card.css";
import { FaArrowRight, FaUser, FaClock, FaRoad } from "react-icons/fa";
import { abrirWhatsApp } from "../utils/whatsapp";
import { getUser } from "../services/auth.service";
import { trackCardClick } from "../services/clickStats.service";
import ServiceDetailModal from "./ServiceDetailModal";

export default function TrenCard({ item, isPreview = false }) {
  const {
    nombre,
    empresa,
    tipo,
    clase,
    origen,
    destino,
    duracionHoras,
    distanciaKm,
    horarioSalida,
    precio,
    moneda,
    servicios,
    vendedor,
  } = item;

  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const handleCardClick = () => {
    trackCardClick("tren", item.id, nombre).catch(console.error);
    setShowModal(true);
  };

  const handleReservar = (e) => {
    e.stopPropagation();
    abrirWhatsApp("tren", item);
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      "alta-velocidad": "Alta Velocidad",
      regional: "Regional",
      turistico: "Turístico",
      nocturno: "Nocturno",
      suburbano: "Suburbano",
    };
    return labels[tipo] || tipo;
  };

  const getClaseLabel = (clase) => {
    const labels = {
      economica: "Económica",
      primera: "Primera Clase",
      ejecutiva: "Ejecutiva",
      premium: "Premium",
      suite: "Suite",
    };
    return labels[clase] || clase;
  };

  const getTipoBadgeColor = (tipo) => {
    const colors = {
      "alta-velocidad": "#2196f3",
      regional: "#4caf50",
      turistico: "#ff9800",
      nocturno: "#9c27b0",
      suburbano: "#607d8b",
    };
    return colors[tipo] || "#757575";
  };

  return (
    <>
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
                <FaUser style={{ color: "var(--primary)" }} />
                <span style={{ color: "#4a5568", fontWeight: "500" }}>
                  {vendedor.razonSocial || vendedor.nombre}
                </span>
              </div>
            )}
            <p className="empresa">{empresa}</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🚆</span>
              <span style={{ fontSize: "0.875rem", color: "#666" }}>
                {origen} <FaArrowRight style={{ fontSize: "0.75rem" }} />{" "}
                {destino}
              </span>
            </div>
          </div>
          <span
            className="tipo-badge"
            style={{ backgroundColor: getTipoBadgeColor(tipo) }}
          >
            {getTipoLabel(tipo)}
          </span>
        </div>

        <div className="card-content">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Clase</span>
              <span className="info-value">{getClaseLabel(clase)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <FaClock /> Duración
              </span>
              <span className="info-value">{duracionHoras}h</span>
            </div>
          </div>

          <div className="info-grid" style={{ marginTop: "0.5rem" }}>
            {distanciaKm && (
              <div className="info-item">
                <span className="info-label">
                  <FaRoad /> Distancia
                </span>
                <span className="info-value">{distanciaKm} km</span>
              </div>
            )}
            {horarioSalida && (
              <div className="info-item">
                <span className="info-label">Salida</span>
                <span className="info-value">{horarioSalida}</span>
              </div>
            )}
          </div>

          {servicios && servicios.length > 0 && (
            <div className="features">
              <p className="features-label">Servicios:</p>
              <ul className="features-list">
                {servicios.slice(0, 4).map((servicio, index) => (
                  <li key={index}>{servicio}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card-footer">
          <div className="price-section">
            <span className="price-label">Desde</span>
            <span className="price">
              {moneda === "USD" && "$"}
              {moneda === "EUR" && "€"}
              {moneda === "ARS" && "$"}
              {moneda === "BRL" && "R$"}
              {moneda === "CLP" && "$"}
              {precio.toLocaleString()}{" "}
              {moneda !== "USD" && moneda !== "EUR" ? moneda : ""}
            </span>
          </div>
          <button className="btn-reservar" onClick={handleReservar} disabled={isPreview}>
            Consultar
          </button>
        </div>
      </div>

      {showModal && (
        <ServiceDetailModal
          item={item}
          onClose={() => setShowModal(false)}
          serviceType="tren"
        />
      )}
    </>
  );
}
