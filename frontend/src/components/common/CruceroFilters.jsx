import React, { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import "../../styles/advancedFilters.css";

/**
 * Componente de filtros avanzados para Cruceros
 * Incluye filtros por puerto, mes y duración
 */
export default function CruceroFilters({ onFilterChange, totalResults }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    puertoSalida: "",
    mes: "",
    duracionMin: "",
    duracionMax: "",
    precioMin: "",
    precioMax: "",
  });

  const meses = [
    { value: "", label: "Todos los meses" },
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      puertoSalida: "",
      mes: "",
      duracionMin: "",
      duracionMax: "",
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
              <label htmlFor="puertoSalida">Puerto de Salida</label>
              <input
                type="text"
                id="puertoSalida"
                className="filter-input"
                placeholder="Ej: Miami, Barcelona..."
                value={filters.puertoSalida}
                onChange={(e) =>
                  handleFilterChange("puertoSalida", e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label htmlFor="mes">Mes de Salida</label>
              <select
                id="mes"
                className="filter-input"
                value={filters.mes}
                onChange={(e) => handleFilterChange("mes", e.target.value)}
              >
                {meses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group-row">
              <div className="filter-group">
                <label htmlFor="duracionMin">Duración Mínima (noches)</label>
                <input
                  type="number"
                  id="duracionMin"
                  className="filter-input"
                  placeholder="Ej: 3"
                  min="1"
                  value={filters.duracionMin}
                  onChange={(e) =>
                    handleFilterChange("duracionMin", e.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label htmlFor="duracionMax">Duración Máxima (noches)</label>
                <input
                  type="number"
                  id="duracionMax"
                  className="filter-input"
                  placeholder="Ej: 14"
                  min="1"
                  value={filters.duracionMax}
                  onChange={(e) =>
                    handleFilterChange("duracionMax", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="filter-group-row">
              <div className="filter-group">
                <label htmlFor="precioMin">Precio Mínimo (ARS)</label>
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
                <label htmlFor="precioMax">Precio Máximo (ARS)</label>
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
