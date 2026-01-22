import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  FaTimes,
  FaWhatsapp,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaPlane,
  FaCar,
  FaShip,
  FaShieldAlt,
  FaHotel,
  FaRoute,
} from "react-icons/fa";
import { abrirWhatsApp } from "../utils/whatsapp";
import "../styles/serviceDetailModal.css";

export default function ServiceDetailModal({ item, tipo, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!item) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "Fecha no disponible";
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Fecha no disponible";
      
      return dateObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Fecha no disponible";
    }
  };

  const handleReservar = () => {
    abrirWhatsApp(tipo, item);
  };

  const getIcon = () => {
    const icons = {
      alojamiento: <FaHotel />,
      paquete: <FaRoute />,
      auto: <FaCar />,
      pasaje: <FaPlane />,
      transfer: <FaCar />,
      circuito: <FaRoute />,
      excursion: <FaMapMarkerAlt />,
      salidaGrupal: <FaUsers />,
      crucero: <FaShip />,
      seguro: <FaShieldAlt />,
    };
    return icons[tipo] || <FaMapMarkerAlt />;
  };

  const nextImage = () => {
    if (item.imagenes && item.imagenes.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % item.imagenes.length);
    }
  };

  const prevImage = () => {
    if (item.imagenes && item.imagenes.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? item.imagenes.length - 1 : prev - 1,
      );
    }
  };

  const renderEstrellas = (estrellas) => {
    return (
      <div className="detail-stars">
        {[...Array(estrellas || 0)].map((_, i) => (
          <FaStar key={i} className="star-icon" />
        ))}
      </div>
    );
  };

  const renderField = (label, value, icon) => {
    if (!value && value !== 0) return null;
    return (
      <div className="detail-field">
        {icon && <span className="field-icon">{icon}</span>}
        <div className="field-content">
          <span className="field-label">{label}</span>
          <span className="field-value">{value}</span>
        </div>
      </div>
    );
  };

  const renderServices = (services) => {
    if (!services) return null;

    // Si es un array, convertir a lista con viñetas
    if (Array.isArray(services)) {
      return (
        <ul className="services-list">
          {services.map((service, idx) => (
            <li key={idx}>{service.replace(/_/g, " ")}</li>
          ))}
        </ul>
      );
    }

    // Si es string, mostrar como está
    return <p className="section-text">{services}</p>;
  };

  const modalContent = (
    <div className="service-detail-overlay" onClick={onClose}>
      <div
        className="service-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        {/* Galería de imágenes */}
        <div className="modal-gallery">
          {item.imagenes && item.imagenes.length > 0 ? (
            <>
              <img
                src={item.imagenes[currentImageIndex]}
                alt={item.nombre || item.modelo || "Servicio"}
                className="gallery-main-image"
              />
              {item.imagenes.length > 1 && (
                <>
                  <button className="gallery-btn prev" onClick={prevImage}>
                    ‹
                  </button>
                  <button className="gallery-btn next" onClick={nextImage}>
                    ›
                  </button>
                  <div className="gallery-indicators">
                    {item.imagenes.map((_, idx) => (
                      <span
                        key={idx}
                        className={`indicator ${idx === currentImageIndex ? "active" : ""}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : item.imagen ? (
            <img
              src={item.imagen}
              alt={item.nombre || item.modelo || "Servicio"}
              className="gallery-main-image"
            />
          ) : (
            <div className="gallery-placeholder">
              <div className="placeholder-icon">{getIcon()}</div>
              <p>Sin imágenes disponibles</p>
            </div>
          )}
        </div>

        <div className="service-modal-content">
          {/* Header */}
          <div className="modal-header">
            <div className="header-icon">{getIcon()}</div>
            <div className="header-text">
              <h2 className="modal-title">{item.nombre || item.modelo}</h2>
              {item.tipo && (
                <span className="service-type-badge">{item.tipo}</span>
              )}
              {item.marca && (
                <span className="service-type-badge">{item.marca}</span>
              )}
            </div>
          </div>

          {/* Estrellas */}
          {item.estrellas && renderEstrellas(item.estrellas)}

          {/* Grid de información principal */}
          <div className="details-grid">
            {/* Alojamientos */}
            {tipo === "alojamiento" && (
              <>
                {renderField("Ubicación", item.ubicacion, <FaMapMarkerAlt />)}
                {renderField(
                  "Habitaciones disponibles",
                  item.habitacionesDisponibles,
                )}
                {renderField(
                  "Precio por noche",
                  formatCurrency(item.precioNoche),
                )}
              </>
            )}

            {/* Paquetes */}
            {tipo === "paquete" && (
              <>
                {renderField("Destino", item.destino, <FaMapMarkerAlt />)}
                {renderField("Duración", `${item.duracion} días`)}
                {renderField(
                  "Salida",
                  formatDate(item.fechaInicio),
                  <FaCalendarAlt />,
                )}
                {renderField("Precio", formatCurrency(item.precio))}
              </>
            )}

            {/* Autos */}
            {tipo === "auto" && (
              <>
                {renderField("Modelo", item.modelo, <FaCar />)}
                {renderField("Año", item.anio)}
                {renderField(
                  "Capacidad",
                  `${item.capacidad} personas`,
                  <FaUsers />,
                )}
                {renderField("Ubicación", item.ubicacion, <FaMapMarkerAlt />)}
                {renderField("Precio por día", formatCurrency(item.precioDia))}
              </>
            )}

            {/* Pasajes */}
            {tipo === "pasaje" && (
              <>
                {renderField("Origen", item.origen, <FaPlane />)}
                {renderField("Destino", item.destino, <FaPlane />)}
                {renderField("Aerolínea", item.aerolinea)}
                {renderField(
                  "Fecha",
                  formatDate(item.fechaSalida),
                  <FaCalendarAlt />,
                )}
                {renderField("Asientos disponibles", item.asientosDisponibles)}
                {renderField("Precio", formatCurrency(item.precio))}
              </>
            )}

            {/* Transfers */}
            {tipo === "transfer" && (
              <>
                {renderField("Origen", item.origen, <FaMapMarkerAlt />)}
                {renderField("Destino", item.destino, <FaMapMarkerAlt />)}
                {renderField("Tipo de vehículo", item.tipoVehiculo, <FaCar />)}
                {renderField(
                  "Capacidad",
                  `${item.capacidad} personas`,
                  <FaUsers />,
                )}
                {renderField("Precio", formatCurrency(item.precio))}
              </>
            )}

            {/* Circuitos */}
            {tipo === "circuito" && (
              <>
                {renderField("Destinos", item.destinos, <FaRoute />)}
                {renderField("Duración", `${item.duracion} días`, <FaClock />)}
                {renderField(
                  "Salida",
                  formatDate(item.fechaInicio),
                  <FaCalendarAlt />,
                )}
                {renderField("Precio", formatCurrency(item.precio))}
              </>
            )}

            {/* Excursiones */}
            {tipo === "excursion" && (
              <>
                {renderField("Ubicación", item.ubicacion, <FaMapMarkerAlt />)}
                {renderField("Duración", item.duracion, <FaClock />)}
                {renderField("Precio", formatCurrency(item.precio))}
              </>
            )}

            {/* Salidas Grupales */}
            {tipo === "salidaGrupal" && (
              <>
                {renderField("Destino", item.destino, <FaMapMarkerAlt />)}
                {renderField("Duración", `${item.duracion} días`, <FaClock />)}
                {renderField(
                  "Salida",
                  formatDate(item.fechaSalida),
                  <FaCalendarAlt />,
                )}
                {renderField(
                  "Cupos disponibles",
                  item.cuposDisponibles,
                  <FaUsers />,
                )}
                {renderField("Precio", formatCurrency(item.precio))}
              </>
            )}

            {/* Cruceros */}
            {tipo === "crucero" && (
              <>
                {renderField("Naviera", item.naviera, <FaShip />)}
                {renderField("Itinerario", item.itinerario, <FaRoute />)}
                {renderField(
                  "Duración",
                  `${item.duracion} noches`,
                  <FaClock />,
                )}
                {renderField(
                  "Salida",
                  formatDate(item.fechaSalida),
                  <FaCalendarAlt />,
                )}
                {renderField("Precio", formatCurrency(item.precio))}
              </>
            )}

            {/* Seguros */}
            {tipo === "seguro" && (
              <>
                {renderField("Cobertura", item.cobertura, <FaShieldAlt />)}
                {renderField("Duración", `${item.duracion} días`, <FaClock />)}
                {renderField("Precio", formatCurrency(item.precio))}
              </>
            )}
          </div>

          {/* Descripción completa */}
          {item.descripcion && (
            <div className="detail-section">
              <h3 className="section-title">Descripción</h3>
              <p className="section-text">{item.descripcion}</p>
            </div>
          )}

          {/* Servicios/Incluye */}
          {item.servicios && (
            <div className="detail-section">
              <h3 className="section-title">Servicios</h3>
              {renderServices(item.servicios)}
            </div>
          )}

          {item.incluye && (
            <div className="detail-section">
              <h3 className="section-title">Incluye</h3>
              {renderServices(item.incluye)}
            </div>
          )}

          {item.noIncluye && (
            <div className="detail-section">
              <h3 className="section-title">No Incluye</h3>
              {renderServices(item.noIncluye)}
            </div>
          )}

          {/* Botón de reserva */}
          <div className="modal-footer">
            <button className="btn-reservar-modal" onClick={handleReservar}>
              <FaWhatsapp />
              Reservar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
