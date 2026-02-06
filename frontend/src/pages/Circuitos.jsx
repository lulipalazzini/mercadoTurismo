import React, { useState, useEffect } from "react";
import CircuitoCard from "../components/CircuitoCard";
import ModuleFilters from "../components/ModuleFilters";
import "../styles/servicios.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function Circuitos() {
  const [circuitos, setCircuitos] = useState([]);
  const [allCircuitos, setAllCircuitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCircuitos();
  }, []);

  const fetchCircuitos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/circuitos`);
      if (!response.ok) {
        throw new Error("Error al cargar los circuitos");
      }
      const data = await response.json();
      setCircuitos(data);
      setAllCircuitos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    if (Object.keys(filters).length === 0) {
      setCircuitos(allCircuitos);
      return;
    }

    const filtered = allCircuitos.filter((circuito) => {
      let matches = true;

      // Filtro por destino (busca en nombre, descripción y destinos JSON)
      if (filters.destino) {
        const destinoLower = filters.destino.toLowerCase();
        matches =
          matches &&
          (circuito.nombre?.toLowerCase().includes(destinoLower) ||
            circuito.descripcion?.toLowerCase().includes(destinoLower) ||
            (Array.isArray(circuito.destinos) &&
              circuito.destinos.some((d) =>
                d.toLowerCase().includes(destinoLower),
              )));
      }

      // Filtro por duración
      if (filters.duracion && circuito.duracion) {
        matches = matches && circuito.duracion >= parseInt(filters.duracion);
      }

      // Filtro por precio mínimo
      if (filters.precioMin && circuito.precio) {
        matches =
          matches &&
          parseFloat(circuito.precio) >= parseFloat(filters.precioMin);
      }

      // Filtro por precio máximo
      if (filters.precioMax && circuito.precio) {
        matches =
          matches &&
          parseFloat(circuito.precio) <= parseFloat(filters.precioMax);
      }

      return matches;
    });

    setCircuitos(filtered);
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando circuitos...</div>
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
      <h1 className="servicios-title">Circuitos Turísticos</h1>

      <ModuleFilters module="circuitos" onFiltersChange={handleFiltersChange} />

      <div className="servicios-grid">
        {circuitos.length > 0 ? (
          circuitos.map((circuito) => (
            <CircuitoCard key={circuito.id} item={circuito} />
          ))
        ) : (
          <p className="no-results">
            No se encontraron circuitos que coincidan con los filtros
            seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
