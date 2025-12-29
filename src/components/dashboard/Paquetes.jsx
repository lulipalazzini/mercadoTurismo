import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaBullseye,
  FaStar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaBox,
  FaEye,
  FaClipboardList,
  FaEllipsisV,
  FaCheckCircle,
} from "react-icons/fa";

export default function Paquetes() {
  const [paquetes] = useState([
    {
      id: 1,
      nombre: "Mendoza Premium 5 días",
      destino: "Mendoza",
      duracion: "5 días / 4 noches",
      categoria: "Premium",
      precio: 112500,
      comision: 10,
      incluye: ["Hotel 4★", "Desayuno", "Traslados", "2 Excursiones"],
      disponible: true,
      stock: 15,
    },
    {
      id: 2,
      nombre: "Bariloche Ski Week",
      destino: "Bariloche",
      duracion: "7 días / 6 noches",
      categoria: "Premium",
      precio: 190000,
      comision: 10,
      incluye: ["Hotel 5★", "Media Pensión", "Pase Ski", "Clases"],
      disponible: true,
      stock: 8,
    },
    {
      id: 3,
      nombre: "Cataratas del Iguazú",
      destino: "Misiones",
      duracion: "4 días / 3 noches",
      categoria: "Estándar",
      precio: 106667,
      comision: 10,
      incluye: ["Hotel 3★", "Desayuno", "Entrada Parque", "Guía"],
      disponible: true,
      stock: 20,
    },
    {
      id: 4,
      nombre: "Buenos Aires Cultural",
      destino: "Buenos Aires",
      duracion: "3 días / 2 noches",
      categoria: "Estándar",
      precio: 140000,
      comision: 10,
      incluye: ["Hotel Boutique", "Desayuno", "City Tour", "Show Tango"],
      disponible: true,
      stock: 12,
    },
    {
      id: 5,
      nombre: "Salta y Jujuy Mágico",
      destino: "Salta",
      duracion: "6 días / 5 noches",
      categoria: "Premium",
      precio: 145000,
      comision: 12,
      incluye: ["Hotel 4★", "Desayuno", "Excursiones", "Traslados"],
      disponible: true,
      stock: 10,
    },
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getCategoryColor = (categoria) => {
    return categoria === "Premium" ? "category-premium" : "category-standard";
  };

  return (
    <div className="section-container">
      {/* Toolbar */}
      <div className="section-toolbar">
        <button className="btn-primary">
          <FaPlus /> Nuevo Paquete
        </button>
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar paquetes..." />
          </div>
          <select className="filter-select">
            <option>Todos los destinos</option>
            <option>Mendoza</option>
            <option>Bariloche</option>
            <option>Buenos Aires</option>
            <option>Salta</option>
          </select>
          <select className="filter-select">
            <option>Todas las categorías</option>
            <option>Premium</option>
            <option>Estándar</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaBullseye />
          </div>
          <div className="stat-content">
            <h3>{paquetes.length}</h3>
            <p>Paquetes Activos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <FaStar />
          </div>
          <div className="stat-content">
            <h3>{paquetes.filter((p) => p.categoria === "Premium").length}</h3>
            <p>Premium</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaMapMarkerAlt />
          </div>
          <div className="stat-content">
            <h3>{new Set(paquetes.map((p) => p.destino)).size}</h3>
            <p>Destinos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>10-12%</h3>
            <p>Comisión Promedio</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="packages-grid">
        {paquetes.map((paquete) => (
          <div key={paquete.id} className="package-card">
            <div className="package-header">
              <div className="package-category">
                <span
                  className={`category-badge ${getCategoryColor(
                    paquete.categoria
                  )}`}
                >
                  {paquete.categoria}
                </span>
                {paquete.disponible && (
                  <span className="available-badge">
                    <FaCheckCircle /> Disponible
                  </span>
                )}
              </div>
              <button className="btn-icon">
                <FaEllipsisV />
              </button>
            </div>

            <div className="package-body">
              <h3 className="package-title">{paquete.nombre}</h3>
              <div className="package-info">
                <div className="info-item">
                  <span className="info-icon">
                    <FaMapMarkerAlt />
                  </span>
                  <span>{paquete.destino}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">
                    <FaCalendarAlt />
                  </span>
                  <span>{paquete.duracion}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">
                    <FaBox />
                  </span>
                  <span>{paquete.stock} disponibles</span>
                </div>
              </div>

              <div className="package-includes">
                <strong>Incluye:</strong>
                <div className="includes-tags">
                  {paquete.incluye.map((item, index) => (
                    <span key={index} className="include-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="package-pricing">
                <div className="price-main">
                  <span className="price-label">Precio por persona</span>
                  <span className="price-amount">
                    {formatCurrency(paquete.precio)}
                  </span>
                </div>
                <div className="price-commission">
                  <span className="commission-label">Tu comisión:</span>
                  <span className="commission-amount">
                    {paquete.comision}% (
                    {formatCurrency((paquete.precio * paquete.comision) / 100)})
                  </span>
                </div>
              </div>
            </div>

            <div className="package-footer">
              <button className="btn-secondary btn-block">
                <FaEye /> Ver Detalles
              </button>
              <button className="btn-primary btn-block">
                <FaClipboardList /> Reservar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
