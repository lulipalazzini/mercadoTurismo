import React, { useState, useEffect } from "react";
import SeguroCard from "../components/SeguroCard";
import ModuleFilters from "../components/ModuleFilters";
import { API_URL as API_BASE_URL } from '../config/api.config.js';
import "../styles/servicios.css";

export default function Seguros() {
  const [seguros, setSeguros] = useState([]);
  const [allSeguros, setAllSeguros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSeguros();
  }, []);

  const fetchSeguros = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/seguros`);
      if (!response.ok) {
        throw new Error("Error al cargar los seguros");
      }
      const data = await response.json();
      setSeguros(data);
      setAllSeguros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    if (Object.keys(filters).length === 0) {
      setSeguros(allSeguros);
      return;
    }

    const filtered = allSeguros.filter((seguro) => {
      let matches = true;

      // Filtro por tipo
      if (filters.tipo && seguro.tipo) {
        matches = matches && seguro.tipo === filters.tipo;
      }

      // Filtro por destino (busca en destinos o descripción)
      if (filters.destino) {
        const destinoLower = filters.destino.toLowerCase();
        matches =
          matches &&
          (seguro.destinos?.toLowerCase().includes(destinoLower) ||
            seguro.descripcion?.toLowerCase().includes(destinoLower) ||
            seguro.nombre?.toLowerCase().includes(destinoLower));
      }

      // Filtro por precio máximo
      if (filters.precioMax && seguro.precio) {
        matches =
          matches && parseFloat(seguro.precio) <= parseFloat(filters.precioMax);
      }

      return matches;
    });

    setSeguros(filtered);
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando seguros...</div>
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
      <h1 className="servicios-title">Seguros de Viaje</h1>

      <ModuleFilters module="seguros" onFiltersChange={handleFiltersChange} />

      <div className="servicios-grid">
        {seguros.length > 0 ? (
          seguros.map((seguro) => <SeguroCard key={seguro.id} item={seguro} />)
        ) : (
          <p className="no-results">
            No se encontraron seguros que coincidan con los filtros
            seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
