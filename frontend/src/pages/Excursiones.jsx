import React, { useState, useEffect } from "react";
import ExcursionCard from "../components/ExcursionCard";
import ModuleFilters from "../components/ModuleFilters";
import { API_URL as API_BASE_URL } from '../config/api.config.js';
import "../styles/servicios.css";

export default function Excursiones() {
  const [excursiones, setExcursiones] = useState([]);
  const [allExcursiones, setAllExcursiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExcursiones();
  }, []);

  const fetchExcursiones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/excursiones`);
      if (!response.ok) {
        throw new Error("Error al cargar las excursiones");
      }
      const data = await response.json();
      setExcursiones(data);
      setAllExcursiones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    if (Object.keys(filters).length === 0) {
      setExcursiones(allExcursiones);
      return;
    }

    const filtered = allExcursiones.filter((excursion) => {
      let matches = true;

      // Filtro por destino
      if (filters.destino) {
        const destinoLower = filters.destino.toLowerCase();
        matches =
          matches &&
          (excursion.destino?.toLowerCase().includes(destinoLower) ||
            excursion.nombre?.toLowerCase().includes(destinoLower) ||
            excursion.ubicacion?.toLowerCase().includes(destinoLower));
      }

      // Filtro por tipo
      if (filters.tipo && excursion.tipo) {
        matches = matches && excursion.tipo === filters.tipo;
      }

      // Filtro por duración
      if (filters.duracion && excursion.duracion) {
        matches = matches && excursion.duracion >= parseInt(filters.duracion);
      }

      // Filtro por precio máximo
      if (filters.precioMax && excursion.precio) {
        matches =
          matches &&
          parseFloat(excursion.precio) <= parseFloat(filters.precioMax);
      }

      return matches;
    });

    setExcursiones(filtered);
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando excursiones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="servicios-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="servicios-container">
      <h1 className="servicios-title">Excursiones</h1>

      <ModuleFilters
        module="excursiones"
        onFiltersChange={handleFiltersChange}
      />

      <div className="servicios-grid">
        {excursiones.length > 0 ? (
          excursiones.map((excursion) => (
            <ExcursionCard key={excursion.id} item={excursion} />
          ))
        ) : (
          <p className="no-results">
            No se encontraron excursiones que coincidan con los filtros
            seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
