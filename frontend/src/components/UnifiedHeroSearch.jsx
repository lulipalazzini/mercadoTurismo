import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/unifiedSearch.css";

/**
 * Componente de búsqueda unificado para el Hero
 * Permite seleccionar tipo de servicio y ajusta campos dinámicamente
 */
export default function UnifiedHeroSearch() {
  const navigate = useNavigate();
  
  const [searchType, setSearchType] = useState("paquetes");
  const [filters, setFilters] = useState({
    // Campos comunes
    destino: "",
    fechaInicio: "",
    fechaFin: "",
    
    // Paquetes específicos
    duracion: "",
    precioMax: "",
    
    // Cruceros específicos
    puertoSalida: "",
    
    // Alojamientos específicos
    ubicacion: "",
    tipo: "",
    habitaciones: 1,
    
    // Autos específicos
    categoria: "",
    capacidad: "",
    
    // Excursiones específicas
    tipoExcursion: "",
  });

  const searchTypes = [
    { id: "paquetes", label: "Paquetes", icon: "🎒", route: "/paquetes" },
    { id: "alojamientos", label: "Alojamientos", icon: "🏨", route: "/alojamientos" },
    { id: "cruceros", label: "Cruceros", icon: "🚢", route: "/cruceros" },
    { id: "autos", label: "Autos", icon: "🚗", route: "/autos" },
    { id: "excursiones", label: "Excursiones", icon: "🎭", route: "/excursiones" },
  ];

  const handleTypeChange = (type) => {
    setSearchType(type);
    // Limpiar filtros al cambiar de tipo
    setFilters({
      destino: "",
      fechaInicio: "",
      fechaFin: "",
      duracion: "",
      precioMax: "",
      puertoSalida: "",
      ubicacion: "",
      tipo: "",
      habitaciones: 1,
      categoria: "",
      capacidad: "",
      tipoExcursion: "",
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedType = searchTypes.find(t => t.id === searchType);
    if (!selectedType) return;

    // Construir query params según el tipo de búsqueda
    const params = new URLSearchParams();
    
    // Agregar solo los campos relevantes y no vacíos
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    // Navegar al módulo correspondiente con los filtros
    navigate(`${selectedType.route}?${params.toString()}`);
  };

  return (
    <div className="unified-search">
      {/* Selector de tipo de búsqueda */}
      <div className="search-type-selector">
        {searchTypes.map(type => (
          <button
            key={type.id}
            type="button"
            className={`type-btn ${searchType === type.id ? "active" : ""}`}
            onClick={() => handleTypeChange(type.id)}
          >
            <span className="type-icon">{type.icon}</span>
            <span className="type-label">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Formulario dinámico según el tipo */}
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-fields">
          
          {/* PAQUETES */}
          {searchType === "paquetes" && (
            <>
              <div className="search-field">
                <label htmlFor="destino">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Destino
                </label>
                <input
                  type="text"
                  id="destino"
                  placeholder="¿A dónde quieres ir?"
                  value={filters.destino}
                  onChange={(e) => handleFilterChange("destino", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="fechaInicio">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={filters.fechaInicio}
                  onChange={(e) => handleFilterChange("fechaInicio", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="duracion">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Duración (días)
                </label>
                <input
                  type="number"
                  id="duracion"
                  placeholder="Ej: 7"
                  min="1"
                  value={filters.duracion}
                  onChange={(e) => handleFilterChange("duracion", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="precioMax">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Precio máximo
                </label>
                <input
                  type="number"
                  id="precioMax"
                  placeholder="Ej: 5000"
                  min="0"
                  value={filters.precioMax}
                  onChange={(e) => handleFilterChange("precioMax", e.target.value)}
                />
              </div>
            </>
          )}

          {/* ALOJAMIENTOS */}
          {searchType === "alojamientos" && (
            <>
              <div className="search-field">
                <label htmlFor="ubicacion">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Ubicación
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  placeholder="Ciudad o región"
                  value={filters.ubicacion}
                  onChange={(e) => handleFilterChange("ubicacion", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="fechaInicio">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Check-in
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={filters.fechaInicio}
                  onChange={(e) => handleFilterChange("fechaInicio", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="fechaFin">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Check-out
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  value={filters.fechaFin}
                  onChange={(e) => handleFilterChange("fechaFin", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="tipo">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  Tipo
                </label>
                <select
                  id="tipo"
                  value={filters.tipo}
                  onChange={(e) => handleFilterChange("tipo", e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostel</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="resort">Resort</option>
                  <option value="cabaña">Cabaña</option>
                </select>
              </div>
            </>
          )}

          {/* CRUCEROS */}
          {searchType === "cruceros" && (
            <>
              <div className="search-field">
                <label htmlFor="puertoSalida">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
                    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
                  </svg>
                  Puerto de salida
                </label>
                <input
                  type="text"
                  id="puertoSalida"
                  placeholder="Ej: Buenos Aires"
                  value={filters.puertoSalida}
                  onChange={(e) => handleFilterChange("puertoSalida", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="fechaInicio">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Fecha de salida
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={filters.fechaInicio}
                  onChange={(e) => handleFilterChange("fechaInicio", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="duracion">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Duración (noches)
                </label>
                <input
                  type="number"
                  id="duracion"
                  placeholder="Ej: 7"
                  min="1"
                  value={filters.duracion}
                  onChange={(e) => handleFilterChange("duracion", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="precioMax">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Precio máximo
                </label>
                <input
                  type="number"
                  id="precioMax"
                  placeholder="Precio desde..."
                  min="0"
                  value={filters.precioMax}
                  onChange={(e) => handleFilterChange("precioMax", e.target.value)}
                />
              </div>
            </>
          )}

          {/* AUTOS */}
          {searchType === "autos" && (
            <>
              <div className="search-field">
                <label htmlFor="ubicacion">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Ubicación de retiro
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  placeholder="Ciudad o aeropuerto"
                  value={filters.ubicacion}
                  onChange={(e) => handleFilterChange("ubicacion", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="fechaInicio">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Fecha de retiro
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={filters.fechaInicio}
                  onChange={(e) => handleFilterChange("fechaInicio", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="fechaFin">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Fecha de devolución
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  value={filters.fechaFin}
                  onChange={(e) => handleFilterChange("fechaFin", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="categoria">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                    <polygon points="12 15 17 21 7 21 12 15" />
                  </svg>
                  Categoría
                </label>
                <select
                  id="categoria"
                  value={filters.categoria}
                  onChange={(e) => handleFilterChange("categoria", e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="economico">Económico</option>
                  <option value="compacto">Compacto</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="lujo">Lujo</option>
                  <option value="van">Van</option>
                </select>
              </div>
            </>
          )}

          {/* EXCURSIONES */}
          {searchType === "excursiones" && (
            <>
              <div className="search-field">
                <label htmlFor="destino">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Destino
                </label>
                <input
                  type="text"
                  id="destino"
                  placeholder="¿Dónde?"
                  value={filters.destino}
                  onChange={(e) => handleFilterChange("destino", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="tipoExcursion">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Tipo de excursión
                </label>
                <select
                  id="tipoExcursion"
                  value={filters.tipoExcursion}
                  onChange={(e) => handleFilterChange("tipoExcursion", e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="cultural">Cultural</option>
                  <option value="aventura">Aventura</option>
                  <option value="naturaleza">Naturaleza</option>
                  <option value="gastronomica">Gastronómica</option>
                  <option value="deportiva">Deportiva</option>
                </select>
              </div>

              <div className="search-field">
                <label htmlFor="duracion">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Duración (horas)
                </label>
                <input
                  type="number"
                  id="duracion"
                  placeholder="Ej: 4"
                  min="1"
                  value={filters.duracion}
                  onChange={(e) => handleFilterChange("duracion", e.target.value)}
                />
              </div>

              <div className="search-field">
                <label htmlFor="precioMax">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Precio máximo
                </label>
                <input
                  type="number"
                  id="precioMax"
                  placeholder="Ej: 2000"
                  min="0"
                  value={filters.precioMax}
                  onChange={(e) => handleFilterChange("precioMax", e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <button type="submit" className="search-submit-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Buscar {searchTypes.find(t => t.id === searchType)?.label}
        </button>
      </form>
    </div>
  );
}
