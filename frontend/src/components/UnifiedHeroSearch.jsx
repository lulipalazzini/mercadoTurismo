import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PassengerSelector from "./common/PassengerSelector";
import DestinoAutocomplete from "./common/DestinoAutocomplete";
import { API_URL } from "../config/api.config";
import "../styles/unifiedSearch.css";

/**
 * Componente de búsqueda unificado para el Hero
 * Búsqueda simplificada con origen, destino, precio y pasajeros
 */
export default function UnifiedHeroSearch() {
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState("paquetes");
  const [searchTypes, setSearchTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [filters, setFilters] = useState({
    origen: "",
    destino: "",
    precioMax: "",
    adults: 1,
    minors: 0,
  });

  // Cargar tipos de servicios desde la API
  useEffect(() => {
    const loadTiposServicios = async () => {
      try {
        setLoadingTypes(true);
        const response = await fetch(
          `${API_URL}/publicaciones-destacadas/tipos-servicios`,
        );

        if (!response.ok) {
          throw new Error("Error al cargar tipos de servicios");
        }

        const data = await response.json();

        // Mapear los tipos de la API al formato esperado
        const tiposFormateados = data.tipos.map((tipo) => ({
          id: tipo.id,
          label: tipo.label,
          route: tipo.route,
          count: tipo.count,
          available: tipo.available,
        }));

        setSearchTypes(tiposFormateados);

        // Si el tipo actual no está disponible, seleccionar el primero disponible
        const tipoActualDisponible = tiposFormateados.find(
          (t) => t.id === searchType,
        );
        if (!tipoActualDisponible && tiposFormateados.length > 0) {
          setSearchType(tiposFormateados[0].id);
        }
      } catch (error) {
        console.error("Error loading service types:", error);
        // Fallback a tipos por defecto en caso de error
        setSearchTypes([
          {
            id: "paquetes",
            label: "Paquetes",
            route: "/paquetes",
            available: true,
          },
          {
            id: "alojamientos",
            label: "Alojamientos",
            route: "/alojamientos",
            available: true,
          },
          {
            id: "cruceros",
            label: "Cruceros",
            route: "/cruceros",
            available: true,
          },
        ]);
      } finally {
        setLoadingTypes(false);
      }
    };

    loadTiposServicios();
  }, []);

  const handleTypeChange = (type) => {
    setSearchType(type);
    // Limpiar filtros que no son comunes al cambiar de tipo
    setFilters((prev) => ({
      origen: "",
      destino: "",
      precioMax: prev.precioMax, // Mantener precio
      adults: prev.adults, // Mantener pasajeros
      minors: prev.minors,
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDestinoChange = (e) => {
    setFilters((prev) => ({ ...prev, destino: e.target.value }));
  };

  const handleOrigenChange = (e) => {
    setFilters((prev) => ({ ...prev, origen: e.target.value }));
  };

  const handlePassengerChange = ({ adults, minors }) => {
    setFilters((prev) => ({ ...prev, adults, minors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedType = searchTypes.find((t) => t.id === searchType);
    if (!selectedType) return;

    // Construir query params
    const params = new URLSearchParams();

    // Agregar solo los campos no vacíos
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
      {/* Formulario de búsqueda */}
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-fields">
          {/* Selector de tipo de servicio - Siempre visible */}
          <div className="search-field">
            <label htmlFor="searchType">
              <i className="fas fa-search"></i>
              ¿Qué estás buscando?
            </label>
            <select
              id="searchType"
              value={searchType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="search-type-input"
              disabled={loadingTypes}
            >
              {loadingTypes ? (
                <option>Cargando...</option>
              ) : (
                searchTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label} {type.count > 0 ? `(${type.count})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Origen - Para paquetes, cruceros, autos, transfers */}
          {["paquetes", "cruceros", "autos", "transfers"].includes(
            searchType,
          ) && (
            <div className="search-field search-field-animated">
              <label htmlFor="origen">
                <i className="fas fa-plane-departure"></i>
                Origen
              </label>
              <DestinoAutocomplete
                name="origen"
                value={filters.origen}
                onChange={handleOrigenChange}
                placeholder="¿Desde dónde?"
                hideLabel={true}
              />
            </div>
          )}

          {/* Destino/Ubicación - Dinámico según categoría */}
          {["paquetes", "excursiones", "salidas-grupales"].includes(
            searchType,
          ) && (
            <div className="search-field search-field-animated">
              <label htmlFor="destino">
                <i className="fas fa-map-marker-alt"></i>
                Destino
              </label>
              <DestinoAutocomplete
                name="destino"
                value={filters.destino}
                onChange={handleDestinoChange}
                placeholder="¿A dónde quieres ir?"
                hideLabel={true}
              />
            </div>
          )}

          {/* Ubicación para Alojamientos */}
          {searchType === "alojamientos" && (
            <div className="search-field search-field-animated">
              <label htmlFor="destino">
                <i className="fas fa-map-marker-alt"></i>
                Ubicación
              </label>
              <DestinoAutocomplete
                name="destino"
                value={filters.destino}
                onChange={handleDestinoChange}
                placeholder="Ciudad o región"
                hideLabel={true}
              />
            </div>
          )}

          {/* Puerto de salida para Cruceros */}
          {searchType === "cruceros" && (
            <div className="search-field search-field-animated">
              <label htmlFor="destino">
                <i className="fas fa-anchor"></i>
                Puerto de destino
              </label>
              <DestinoAutocomplete
                name="destino"
                value={filters.destino}
                onChange={handleDestinoChange}
                placeholder="Puerto de destino"
                hideLabel={true}
              />
            </div>
          )}

          {/* Ubicación de retiro/devolución para Autos */}
          {searchType === "autos" && (
            <div className="search-field search-field-animated">
              <label htmlFor="destino">
                <i className="fas fa-map-marker-alt"></i>
                Devolución
              </label>
              <DestinoAutocomplete
                name="destino"
                value={filters.destino}
                onChange={handleDestinoChange}
                placeholder="Lugar de devolución"
                hideLabel={true}
              />
            </div>
          )}

          {/* Destino para Transfers */}
          {searchType === "transfers" && (
            <div className="search-field search-field-animated">
              <label htmlFor="destino">
                <i className="fas fa-map-marker-alt"></i>
                Destino
              </label>
              <DestinoAutocomplete
                name="destino"
                value={filters.destino}
                onChange={handleDestinoChange}
                placeholder="¿A dónde?"
                hideLabel={true}
              />
            </div>
          )}

          {/* Cobertura para Seguros */}
          {searchType === "seguros" && (
            <div className="search-field search-field-animated">
              <label htmlFor="destino">
                <i className="fas fa-globe"></i>
                Destino/Cobertura
              </label>
              <DestinoAutocomplete
                name="destino"
                value={filters.destino}
                onChange={handleDestinoChange}
                placeholder="País o región"
                hideLabel={true}
              />
            </div>
          )}

          {/* Precio máximo - Siempre visible */}
          <div className="search-field">
            <label htmlFor="precioMax">
              <i className="fas fa-dollar-sign"></i>
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

          {/* Pasajeros - Solo para servicios que lo necesitan */}
          {[
            "paquetes",
            "alojamientos",
            "cruceros",
            "excursiones",
            "salidas-grupales",
          ].includes(searchType) && (
            <div className="search-field search-field-full search-field-animated">
              <PassengerSelector
                adults={filters.adults}
                minors={filters.minors}
                onChange={handlePassengerChange}
              />
            </div>
          )}
        </div>

        <button type="submit" className="search-submit-btn">
          <i className="fas fa-search"></i>
          Buscar {searchTypes.find((t) => t.id === searchType)?.label}
        </button>
      </form>
    </div>
  );
}
