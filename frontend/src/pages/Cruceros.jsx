import React, { useState, useEffect } from "react";
import CruceroCard from "../components/CruceroCard";
import ModuleFilters from "../components/ModuleFilters";
import "../styles/servicios.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3003/api";

export default function Cruceros() {
  const [cruceros, setCruceros] = useState([]);
  const [allCruceros, setAllCruceros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCruceros();
  }, []);

  const fetchCruceros = async (queryParams = {}) => {
    try {
      // Construir query string desde los filtros
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key]) {
          params.append(key, queryParams[key]);
        }
      });
      
      const url = `${API_BASE_URL}/cruceros${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al cargar los cruceros");
      }
      const data = await response.json();
      setCruceros(data);
      setAllCruceros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    // Usar filtros del backend
    setLoading(true);
    fetchCruceros(filters);
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando cruceros...</div>
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
      <h1 className="servicios-title">Cruceros</h1>

      <ModuleFilters 
        module="cruceros" 
        onFiltersChange={handleFiltersChange}
      />

      <div className="servicios-grid">
        {cruceros.length > 0 ? (
          cruceros.map((crucero) => (
            <CruceroCard key={crucero.id} item={crucero} />
          ))
        ) : (
          <p className="no-results">
            No se encontraron cruceros que coincidan con los filtros seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
