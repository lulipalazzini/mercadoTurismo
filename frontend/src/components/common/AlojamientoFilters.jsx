import React, { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import "../../styles/advancedFilters.css";

/**
 * Componente de filtros avanzados para Alojamientos
 * Incluye filtros por tipo, estrellas y precio
 */
export default function AlojamientoFilters({ onFilterChange, totalResults }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tipo: "",
    estrellasMin: "",
    estrellasMax: "",
    precioMin: "",
    precioMax: "",
  });

  const tipos = [
    { value: "", label: "Todos los tipos" },
    { value: "hotel", label: "Hotel" },
    { value: "hostel", label: "Hostel" },
    { value: "apartamento", label: "Apartamento" },
    { value: "resort", label: "Resort" },
    { value: "cabaña", label: "Cabaña" },
    { value: "otro", label: "Otro" },
  ];

  const estrellas = [
    { value: "", label: "Cualquiera" },
    { value: "1", label: "1 ⭐" },
    { value: "2", label: "2 ⭐" },
    { value: "3", label: "3 ⭐" },
    { value: "4", label: "4 ⭐" },
    { value: "5", label: "5 ⭐" },
  ];

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      tipo: "",
      estrellasMin: "",
      estrellasMax: "",
      precioMin: "",
      precioMax: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="advanced-filters-container">
      <button
        className={`filters-toggle-btn ${hasActiveFilters ? "active" : ""}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        <FaFilter />
        <span>
          Filtros{" "}
          {hasActiveFilters &&
            `(${Object.values(filters).filter((v) => v !== "").length})`}
        </span>
      </button>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filtros Avanzados</h3>
            <button className="close-btn" onClick={() => setShowFilters(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="filters-body">
            <div className="filter-group">
              <label htmlFor="tipo">Tipo de Alojamiento</label>
              <select
                id="tipo"
                className="filter-input"
                value={filters.tipo}
                onChange={(e) => handleFilterChange("tipo", e.target.value)}
              >
                {tipos.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group-row">
              <div className="filter-group">
                <label htmlFor="estrellasMin">Estrellas Mínimas</label>
                <select
                  id="estrellasMin"
                  className="filter-input"
                  value={filters.estrellasMin}
                  onChange={(e) =>
                    handleFilterChange("estrellasMin", e.target.value)
                  }
                >
                  {estrellas.map((star) => (
                    <option key={`min-${star.value}`} value={star.value}>
                      {star.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="estrellasMax">Estrellas Máximas</label>
                <select
                  id="estrellasMax"
                  className="filter-input"
                  value={filters.estrellasMax}
                  onChange={(e) =>
                    handleFilterChange("estrellasMax", e.target.value)
                  }
                >
                  {estrellas.map((star) => (
                    <option key={`max-${star.value}`} value={star.value}>
                      {star.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-group-row">
              <div className="filter-group">
                <label htmlFor="precioMin">Precio Mínimo por Noche (ARS)</label>
                <input
                  type="number"
                  id="precioMin"
                  className="filter-input"
                  placeholder="Desde"
                  min="0"
                  value={filters.precioMin}
                  onChange={(e) =>
                    handleFilterChange("precioMin", e.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label htmlFor="precioMax">Precio Máximo por Noche (ARS)</label>
                <input
                  type="number"
                  id="precioMax"
                  className="filter-input"
                  placeholder="Hasta"
                  min="0"
                  value={filters.precioMax}
                  onChange={(e) =>
                    handleFilterChange("precioMax", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="filters-footer">
            <button className="clear-btn" onClick={clearFilters}>
              Limpiar Filtros
            </button>
            <span className="results-count">
              {totalResults} resultado{totalResults !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
