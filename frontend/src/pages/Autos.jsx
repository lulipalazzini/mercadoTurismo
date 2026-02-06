import React, { useState, useEffect } from "react";
import AutoCard from "../components/AutoCard";
import ModuleFilters from "../components/ModuleFilters";
import "../styles/servicios.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3003/api";

export default function Autos() {
  const [autos, setAutos] = useState([]);
  const [allAutos, setAllAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async (queryParams = {}) => {
    try {
      // Construir query string desde los filtros
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key]) {
          params.append(key, queryParams[key]);
        }
      });
      
      const url = `${API_BASE_URL}/autos${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al cargar los autos");
      }
      const data = await response.json();
      setAutos(data);
      setAllAutos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    // Usar filtros del backend
    setLoading(true);
    fetchAutos(filters);
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando autos...</div>
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
      <h1 className="servicios-title">Renta de Autos</h1>
      
      <ModuleFilters 
        module="autos" 
        onFiltersChange={handleFiltersChange}
      />

      <div className="servicios-grid">
        {autos.length > 0 ? (
          autos.map((auto) => <AutoCard key={auto.id} item={auto} />)
        ) : (
          <p className="no-results">
            No se encontraron autos que coincidan con los filtros seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
