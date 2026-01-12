import React from "react";

export default function AlojamientoCard({ alojamiento }) {
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
  } = alojamiento;

  const renderEstrellas = () => {
    return (
      <div className="estrellas">
        {[...Array(estrellas || 0)].map((_, i) => (
          <span key={i} className="estrella">
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleVerDetalles = () => {
    // Por ahora solo navega, después implementaremos la página de detalle
    window.location.href = `/alojamientos/${id}`;
  };

  return (
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
        <div className="card-header">
          <h3 className="card-title">{nombre}</h3>
        </div>

        {estrellas && renderEstrellas()}

        <div className="ubicacion-info">
          <span className="location-icon">📍</span>
          <span className="ubicacion">{ubicacion}</span>
        </div>

        {descripcion && (
          <p className="card-descripcion">
            {descripcion.length > 80
              ? `${descripcion.substring(0, 80)}...`
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
            <span className="precio">${precioNoche}</span>
            <span className="precio-unit">/ noche</span>
          </div>
        </div>
      </div>
    </div>
  );
}
