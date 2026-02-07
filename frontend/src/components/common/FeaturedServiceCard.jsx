import React from "react";
import { useNavigate } from "react-router-dom";
import { getFirstImageUrl } from "../../utils/imageUtils";
import "../../styles/featuredServices.css";

const categoryLabels = {
  alojamiento: "Alojamiento",
  auto: "Auto",
  circuito: "Circuito",
  crucero: "Crucero",
  excursion: "Excursión",
  paquete: "Paquete",
  pasaje: "Pasaje",
  salidaGrupal: "Salida Grupal",
  seguro: "Seguro",
  transfer: "Transfer",
};

const categoryIcons = {
  alojamiento: "🏨",
  auto: "🚗",
  circuito: "🗺️",
  crucero: "🚢",
  excursion: "🏞️",
  paquete: "📦",
  pasaje: "✈️",
  salidaGrupal: "👥",
  seguro: "🛡️",
  transfer: "🚐",
};

const categoryRoutes = {
  alojamiento: "/alojamiento",
  auto: "/autos",
  circuito: "/circuitos",
  crucero: "/cruceros",
  excursion: "/excursiones",
  paquete: "/paquetes",
  pasaje: "/vuelos",
  salidaGrupal: "/salidas-grupales",
  seguro: "/seguros",
  transfer: "/transfers",
};

export default function FeaturedServiceCard({ service, detailData }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const route = categoryRoutes[service.category];
    if (route) {
      navigate(route);
    }
  };

  // Obtener la primera imagen del servicio si existe
  const imageUrl = detailData?.imagenes
    ? getFirstImageUrl(detailData.imagenes)
    : null;

  const categoryLabel = categoryLabels[service.category] || service.category;
  const categoryIcon = categoryIcons[service.category] || "📍";

  return (
    <div className="featured-service-card" onClick={handleClick}>
      <div className="featured-service-image">
        {imageUrl ? (
          <img src={imageUrl} alt={service.serviceName || categoryLabel} />
        ) : (
          <div className="featured-service-placeholder">
            <span className="placeholder-icon">{categoryIcon}</span>
          </div>
        )}
        <div className="featured-service-badge">
          <span className="badge-icon">🔥</span>
          <span className="badge-text">{service.clicks} clicks</span>
        </div>
      </div>
      <div className="featured-service-content">
        <div className="featured-service-category">
          <span className="category-icon">{categoryIcon}</span>
          <span className="category-text">{categoryLabel}</span>
        </div>
        <h3 className="featured-service-title">
          {service.serviceName || `${categoryLabel} destacado`}
        </h3>
        {detailData?.descripcion && (
          <p className="featured-service-description">
            {detailData.descripcion.length > 80
              ? `${detailData.descripcion.substring(0, 80)}...`
              : detailData.descripcion}
          </p>
        )}
        {detailData?.precio && (
          <div className="featured-service-price">
            <span className="price-label">Desde</span>
            <span className="price-value">
              ${parseFloat(detailData.precio).toLocaleString("es-AR")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
