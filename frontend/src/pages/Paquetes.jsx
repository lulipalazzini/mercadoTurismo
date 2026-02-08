import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PaqueteCard from "../components/PaqueteCard";
import ModuleFilters from "../components/ModuleFilters";
import { API_URL as API_BASE_URL } from "../config/api.config.js";
import "../styles/servicios.css";

export default function Paquetes() {
  const [searchParams] = useSearchParams();
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar paquetes cuando cambien los searchParams
  useEffect(() => {
    setLoading(true);
    const initialFilters = {};
    for (const [key, value] of searchParams.entries()) {
      initialFilters[key] = value;
    }
    fetchPaquetes(initialFilters);
  }, [searchParams]);

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
      console.log("🔍 Fetching paquetes:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al cargar los paquetes");
      }
      const data = await response.json();
      console.log("📦 Paquetes recibidos:", data.length);
      setPaquetes(data);
    } catch (err) {
      setError(err.message);
      console.error("❌ Error fetching paquetes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="servicios-container">
      <h1 className="servicios-title">Paquetes Turísticos</h1>

      <ModuleFilters module="paquetes" onFiltersChange={() => {}} />

      <div className="servicios-grid">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : paquetes.length > 0 ? (
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
