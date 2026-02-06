import React, { useState, useEffect } from "react";
import TrenCard from "../components/TrenCard";
import ModuleFilters from "../components/ModuleFilters";
import trenesService from "../services/trenesService";
import "../styles/servicios.css";

export default function Trenes() {
  const [trenes, setTrenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchTrenes();
  }, [filters]);

  const fetchTrenes = async () => {
    try {
      setLoading(true);
      const data = await trenesService.getTrenes(filters);
      setTrenes(data || []);
      setError(null);
    } catch (error) {
      console.error("Error al cargar trenes:", error);
      setError(error.message || "Error al cargar los trenes");
      setTrenes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando trenes...</div>
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
      <h1 className="servicios-title">Trenes</h1>

      <ModuleFilters module="trenes" onFiltersChange={handleFiltersChange} />

      <div className="servicios-grid">
        {trenes && trenes.length > 0 ? (
          trenes.map((tren) => <TrenCard key={tren.id} item={tren} />)
        ) : (
          <p className="no-results">
            No se encontraron trenes que coincidan con los filtros seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
