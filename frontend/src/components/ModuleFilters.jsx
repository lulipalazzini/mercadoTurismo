import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/moduleFilters.css";

/**
 * Barra de búsqueda específica para cada módulo
 * Similar al Hero pero más compacta, siempre visible
 */
export default function ModuleFilters({ module, onFiltersChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});

  // Inicializar filtros desde URL al cargar
  useEffect(() => {
    const initialFilters = {};
    for (const [key, value] of searchParams.entries()) {
      initialFilters[key] = value;
    }
    setFilters(initialFilters);
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };

    // Remover filtros vacíos
    if (!value || value === "") {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    setFilters(newFilters);

    // Actualizar URL
    setSearchParams(newFilters);

    // Notificar al padre
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams({});
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  // Configuración de campos por módulo
  const getModuleFields = () => {
    switch (module) {
      case "paquetes":
        return [
          {
            key: "destino",
            label: "Destino",
            type: "text",
            placeholder: "Ej: París, Roma...",
          },
          { key: "fechaInicio", label: "Fecha desde", type: "date" },
          { key: "nochesMin", label: "Noches mínimo", type: "number", min: 1 },
          { key: "nochesMax", label: "Noches máximo", type: "number", min: 1 },
          { key: "precioMin", label: "Precio mínimo", type: "number", min: 0 },
          { key: "precioMax", label: "Precio máximo", type: "number", min: 0 },
        ];

      case "cruceros":
        return [
          {
            key: "puertoSalida",
            label: "Puerto de salida",
            type: "text",
            placeholder: "Ej: Buenos Aires",
          },
          {
            key: "mes",
            label: "Mes de salida",
            type: "select",
            options: [
              { value: "", label: "Cualquier mes" },
              { value: "1", label: "Enero" },
              { value: "2", label: "Febrero" },
              { value: "3", label: "Marzo" },
              { value: "4", label: "Abril" },
              { value: "5", label: "Mayo" },
              { value: "6", label: "Junio" },
              { value: "7", label: "Julio" },
              { value: "8", label: "Agosto" },
              { value: "9", label: "Septiembre" },
              { value: "10", label: "Octubre" },
              { value: "11", label: "Noviembre" },
              { value: "12", label: "Diciembre" },
            ],
          },
          {
            key: "duracionMin",
            label: "Duración mínima (días)",
            type: "number",
            min: 1,
          },
          {
            key: "duracionMax",
            label: "Duración máxima (días)",
            type: "number",
            min: 1,
          },
          {
            key: "moneda",
            label: "Moneda",
            type: "select",
            options: [
              { value: "", label: "Todas" },
              { value: "USD", label: "USD" },
              { value: "ARS", label: "ARS" },
              { value: "EUR", label: "EUR" },
            ],
          },
        ];

      case "alojamientos":
        return [
          {
            key: "ubicacion",
            label: "Ubicación",
            type: "text",
            placeholder: "Ciudad o región",
          },
          { key: "fechaInicio", label: "Check-in", type: "date" },
          { key: "fechaFin", label: "Check-out", type: "date" },
          {
            key: "tipo",
            label: "Tipo",
            type: "select",
            options: [
              { value: "", label: "Todos" },
              { value: "hotel", label: "Hotel" },
              { value: "hostel", label: "Hostel" },
              { value: "apartamento", label: "Apartamento" },
              { value: "resort", label: "Resort" },
              { value: "cabaña", label: "Cabaña" },
            ],
          },
          {
            key: "estrellas",
            label: "Estrellas",
            type: "select",
            options: [
              { value: "", label: "Todas" },
              { value: "5", label: "5 estrellas" },
              { value: "4", label: "4 estrellas" },
              { value: "3", label: "3 estrellas" },
              { value: "2", label: "2 estrellas" },
              { value: "1", label: "1 estrella" },
            ],
          },
          {
            key: "precioMax",
            label: "Precio por noche (max)",
            type: "number",
            min: 0,
          },
        ];

      case "autos":
        return [
          {
            key: "ubicacion",
            label: "Ubicación",
            type: "text",
            placeholder: "Ciudad o aeropuerto",
          },
          { key: "fechaInicio", label: "Fecha de retiro", type: "date" },
          { key: "fechaFin", label: "Fecha de devolución", type: "date" },
          {
            key: "categoria",
            label: "Categoría",
            type: "select",
            options: [
              { value: "", label: "Todas" },
              { value: "economico", label: "Económico" },
              { value: "compacto", label: "Compacto" },
              { value: "sedan", label: "Sedan" },
              { value: "suv", label: "SUV" },
              { value: "lujo", label: "Lujo" },
              { value: "van", label: "Van" },
            ],
          },
          {
            key: "capacidad",
            label: "Pasajeros",
            type: "number",
            min: 1,
            max: 15,
          },
          {
            key: "transmision",
            label: "Transmisión",
            type: "select",
            options: [
              { value: "", label: "Todas" },
              { value: "manual", label: "Manual" },
              { value: "automatico", label: "Automático" },
            ],
          },
        ];

      case "excursiones":
        return [
          {
            key: "destino",
            label: "Destino",
            type: "text",
            placeholder: "¿Dónde?",
          },
          {
            key: "tipo",
            label: "Tipo",
            type: "select",
            options: [
              { value: "", label: "Todas" },
              { value: "cultural", label: "Cultural" },
              { value: "aventura", label: "Aventura" },
              { value: "naturaleza", label: "Naturaleza" },
              { value: "gastronomica", label: "Gastronómica" },
              { value: "deportiva", label: "Deportiva" },
            ],
          },
          {
            key: "duracion",
            label: "Duración (horas)",
            type: "number",
            min: 1,
          },
          { key: "precioMax", label: "Precio máximo", type: "number", min: 0 },
        ];

      case "transfers":
        return [
          {
            key: "origen",
            label: "Origen",
            type: "text",
            placeholder: "Ciudad o aeropuerto",
          },
          {
            key: "destino",
            label: "Destino",
            type: "text",
            placeholder: "Ciudad o aeropuerto",
          },
          {
            key: "tipoServicio",
            label: "Tipo de servicio",
            type: "select",
            options: [
              { value: "", label: "Todos" },
              { value: "privado", label: "Privado" },
              { value: "compartido", label: "Compartido" },
            ],
          },
          { key: "precioMin", label: "Precio mínimo", type: "number", min: 0 },
          { key: "precioMax", label: "Precio máximo", type: "number", min: 0 },
        ];

      case "circuitos":
        return [
          {
            key: "destino",
            label: "Destino",
            type: "text",
            placeholder: "Ciudad o país",
          },
          {
            key: "duracion",
            label: "Duración mínima (días)",
            type: "number",
            min: 1,
          },
          { key: "precioMin", label: "Precio mínimo", type: "number", min: 0 },
          { key: "precioMax", label: "Precio máximo", type: "number", min: 0 },
        ];

      case "salidas-grupales":
        return [
          {
            key: "destino",
            label: "Destino",
            type: "text",
            placeholder: "¿Dónde?",
          },
          { key: "fechaSalida", label: "Fecha de salida", type: "date" },
          {
            key: "duracion",
            label: "Duración mínima (días)",
            type: "number",
            min: 1,
          },
          { key: "precioMax", label: "Precio máximo", type: "number", min: 0 },
        ];

      case "seguros":
        return [
          {
            key: "tipo",
            label: "Tipo de seguro",
            type: "select",
            options: [
              { value: "", label: "Todos" },
              { value: "viaje", label: "Viaje" },
              { value: "medico", label: "Médico" },
              { value: "cancelacion", label: "Cancelación" },
              { value: "equipaje", label: "Equipaje" },
              { value: "asistencia", label: "Asistencia" },
              { value: "integral", label: "Integral" },
            ],
          },
          {
            key: "destino",
            label: "Destino",
            type: "text",
            placeholder: "País o región",
          },
          { key: "precioMax", label: "Precio máximo", type: "number", min: 0 },
        ];

      case "trenes":
        return [
          {
            key: "origen",
            label: "Origen",
            type: "text",
            placeholder: "Estación de salida",
          },
          {
            key: "destino",
            label: "Destino",
            type: "text",
            placeholder: "Estación de llegada",
          },
          {
            key: "tipo",
            label: "Tipo de tren",
            type: "select",
            options: [
              { value: "", label: "Todos" },
              { value: "alta-velocidad", label: "Alta Velocidad" },
              { value: "regional", label: "Regional" },
              { value: "turistico", label: "Turístico" },
              { value: "nocturno", label: "Nocturno" },
              { value: "suburbano", label: "Suburbano" },
            ],
          },
          {
            key: "clase",
            label: "Clase",
            type: "select",
            options: [
              { value: "", label: "Todas" },
              { value: "economica", label: "Económica" },
              { value: "primera", label: "Primera" },
              { value: "ejecutiva", label: "Ejecutiva" },
              { value: "premium", label: "Premium" },
              { value: "suite", label: "Suite" },
            ],
          },
          {
            key: "empresa",
            label: "Empresa",
            type: "text",
            placeholder: "Operador",
          },
          {
            key: "moneda",
            label: "Moneda",
            type: "select",
            options: [
              { value: "", label: "Todas" },
              { value: "USD", label: "USD" },
              { value: "EUR", label: "EUR" },
              { value: "ARS", label: "ARS" },
              { value: "BRL", label: "BRL" },
              { value: "CLP", label: "CLP" },
            ],
          },
          { key: "precioMin", label: "Precio mínimo", type: "number", min: 0 },
          { key: "precioMax", label: "Precio máximo", type: "number", min: 0 },
        ];

      default:
        return [];
    }
  };

  const fields = getModuleFields();

  if (fields.length === 0) {
    return null;
  }

  return (
    <div className="module-search-bar">
      <div className="search-bar-content">
        <div className="search-fields">
          {fields.map((field) => (
            <div key={field.key} className="search-field">
              <label htmlFor={field.key}>{field.label}</label>

              {field.type === "select" ? (
                <select
                  id={field.key}
                  value={filters[field.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(field.key, e.target.value)
                  }
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.key}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  value={filters[field.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(field.key, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {Object.keys(filters).length > 0 && (
        <div className="clear-filters-footer">
          <button className="clear-btn" onClick={clearFilters}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
