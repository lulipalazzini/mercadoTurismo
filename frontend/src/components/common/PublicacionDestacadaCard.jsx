import React, { useState } from "react";
import { getFirstImageUrl } from "../../utils/imageUtils";
import ServiceDetailModal from "../ServiceDetailModal";
import {
  FaBox,
  FaHotel,
  FaCar,
  FaShuttleVan,
  FaShip,
  FaMountain,
  FaUsers,
  FaMap,
  FaTrain,
  FaShieldAlt,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../../styles/featuredServices.css";

const TIPO_LABELS = {
  paquete: "Paquete",
  alojamiento: "Alojamiento",
  auto: "Auto",
  transfer: "Transfer",
  crucero: "Crucero",
  excursion: "Excursión",
  salidaGrupal: "Salida Grupal",
  circuito: "Circuito",
  tren: "Tren",
  seguro: "Seguro",
};

const TIPO_ICONS = {
  paquete: FaBox,
  alojamiento: FaHotel,
  auto: FaCar,
  transfer: FaShuttleVan,
  crucero: FaShip,
  excursion: FaMountain,
  salidaGrupal: FaUsers,
  circuito: FaMap,
  tren: FaTrain,
  seguro: FaShieldAlt,
};

export default function PublicacionDestacadaCard({ publicacion }) {
  const [showModal, setShowModal] = useState(false);

  if (!publicacion) return null;

  const handleClick = () => {
    setShowModal(true);
  };

  const imageUrl = getFirstImageUrl(publicacion.imagenes);
  const categoryLabel = TIPO_LABELS[publicacion.tipo] || publicacion.tipo;
  const CategoryIcon = TIPO_ICONS[publicacion.tipo] || FaMapMarkerAlt;

  return (
    <>
      <div className="featured-service-card" onClick={handleClick}>
        <div className="featured-service-image">
          {imageUrl ? (
            <img src={imageUrl} alt={publicacion.nombre || categoryLabel} />
          ) : (
            <div className="featured-service-placeholder">
              <CategoryIcon className="placeholder-icon" />
            </div>
          )}
          <div className="featured-service-badge">
            <FaStar className="badge-icon" />
            <span className="badge-text">Destacado</span>
          </div>
        </div>

        <div className="featured-service-content">
          <div className="featured-service-category">
            <CategoryIcon className="category-icon" />
            <span className="category-text">{categoryLabel}</span>
          </div>

          <h3 className="featured-service-title">
            {publicacion.nombre || `${categoryLabel} destacado`}
          </h3>

          {publicacion.descripcion && (
            <p className="featured-service-description">
              {publicacion.descripcion.length > 80
                ? `${publicacion.descripcion.substring(0, 80)}...`
                : publicacion.descripcion}
            </p>
          )}

          {publicacion.destino && (
            <p className="featured-service-destination">
              <FaMapMarkerAlt className="inline mr-1" /> {publicacion.destino}
            </p>
          )}

          {publicacion.precio && (
            <div className="featured-service-price">
              <span className="price-label">Desde</span>
              <span className="price-value">
                ${parseFloat(publicacion.precio).toLocaleString("es-AR")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {showModal && (
        <ServiceDetailModal
          item={publicacion}
          tipo={publicacion.tipo}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
