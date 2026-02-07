import React, { useState, useEffect } from "react";
import AlojamientoCard from "../components/AlojamientoCard";
import ModuleFilters from "../components/ModuleFilters";
import { API_URL as API_BASE_URL } from '../config/api.config.js';
import "../styles/alojamientos.css";

export default function Alojamientos() {
  const [alojamientos, setAlojamientos] = useState([]);
  const [allAlojamientos, setAllAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlojamientos();
  }, []);

  const fetchAlojamientos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alojamientos`);
      if (!response.ok) {
        throw new Error("Error al cargar los alojamientos");
      }
      const data = await response.json();
      setAlojamientos(data);
      setAllAlojamientos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    if (Object.keys(filters).length === 0) {
      setAlojamientos(allAlojamientos);
      return;
    }

    const filtered = allAlojamientos.filter((alojamiento) => {
      let matches = true;

      // Filtro por ubicación
      if (filters.ubicacion) {
        const ubicacionLower = filters.ubicacion.toLowerCase();
        matches =
          matches &&
          (alojamiento.ubicacion?.toLowerCase().includes(ubicacionLower) ||
            alojamiento.nombre?.toLowerCase().includes(ubicacionLower));
      }

      // Filtro por fecha de inicio
      if (filters.fechaInicio && alojamiento.fechaDisponibilidad) {
        const fechaAlojamiento = new Date(alojamiento.fechaDisponibilidad);
        const fechaFiltro = new Date(filters.fechaInicio);
        matches = matches && fechaAlojamiento >= fechaFiltro;
      }

      // Filtro por fecha fin (check-out)
      if (filters.fechaFin && alojamiento.fechaDisponibilidad) {
        const fechaAlojamiento = new Date(alojamiento.fechaDisponibilidad);
        const fechaFiltro = new Date(filters.fechaFin);
        matches = matches && fechaAlojamiento <= fechaFiltro;
      }

      // Filtro por tipo
      if (filters.tipo && alojamiento.tipo) {
        matches = matches && alojamiento.tipo === filters.tipo;
      }

      // Filtro por estrellas
      if (filters.estrellas && alojamiento.estrellas) {
        matches =
          matches && alojamiento.estrellas >= parseInt(filters.estrellas);
      }

      // Filtro por precio máximo
      if (filters.precioMax && alojamiento.precioNoche) {
        matches =
          matches &&
          parseFloat(alojamiento.precioNoche) <= parseFloat(filters.precioMax);
      }

      return matches;
    });

    setAlojamientos(filtered);
  };

  if (loading) {
    return (
      <div className="alojamientos-container">
        <div className="loading">Cargando alojamientos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alojamientos-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="alojamientos-container">
      <h1 className="alojamientos-title">Alojamientos Disponibles</h1>

      <ModuleFilters
        module="alojamientos"
        onFiltersChange={handleFiltersChange}
      />

      <div className="alojamientos-grid">
        {alojamientos.length > 0 ? (
          alojamientos.map((alojamiento) => (
            <AlojamientoCard key={alojamiento.id} alojamiento={alojamiento} />
          ))
        ) : (
          <p className="no-results">
            No se encontraron alojamientos que coincidan con los filtros
            seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
