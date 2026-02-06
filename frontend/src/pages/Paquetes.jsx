import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PaqueteCard from "../components/PaqueteCard";
import ModuleFilters from "../components/ModuleFilters";
import "../styles/servicios.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function Paquetes() {
  const [searchParams] = useSearchParams();
  const [paquetes, setPaquetes] = useState([]);
  const [allPaquetes, setAllPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaquetes();
  }, []);

  const fetchPaquetes = async (queryParams = {}) => {
    try {
      // Construir query string desde los filtros
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key]) {
          params.append(key, queryParams[key]);
        }
      });

      const url = `${API_BASE_URL}/paquetes${params.toString() ? "?" + params.toString() : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al cargar los paquetes");
      }
      const data = await response.json();
      setPaquetes(data);
      setAllPaquetes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros cuando cambien
  const handleFiltersChange = (filters) => {
    // Usar filtros del backend
    setLoading(true);
    fetchPaquetes(filters);
  };

  return (
    <div className="servicios-container">
      <h1 className="servicios-title">Paquetes Turísticos</h1>

      <ModuleFilters module="paquetes" onFiltersChange={handleFiltersChange} />

      <div className="servicios-grid">
        {paquetes.length > 0 ? (
          paquetes.map((paquete) => (
            <PaqueteCard key={paquete.id} item={paquete} />
          ))
        ) : (
          <p className="no-results">
            No se encontraron paquetes que coincidan con los filtros
            seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
