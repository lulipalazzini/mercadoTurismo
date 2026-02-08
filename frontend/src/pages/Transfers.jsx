import React, { useState, useEffect } from "react";
import TransferCard from "../components/TransferCard";
import ModuleFilters from "../components/ModuleFilters";
import { API_URL as API_BASE_URL } from '../config/api.config.js';
import "../styles/servicios.css";

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [allTransfers, setAllTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async (queryParams = {}) => {
    try {
      // Construir query string desde los filtros
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key]) {
          params.append(key, queryParams[key]);
        }
      });

      const url = `${API_BASE_URL}/transfers${params.toString() ? "?" + params.toString() : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al cargar los transfers");
      }
      const data = await response.json();
      setTransfers(data);
      setAllTransfers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    // Usar filtros del backend
    setLoading(true);
    fetchTransfers(filters);
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando transfers...</div>
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
      <h1 className="servicios-title">Transfers</h1>

      <ModuleFilters module="transfers" onFiltersChange={handleFiltersChange} />

      <div className="servicios-grid">
        {transfers.length > 0 ? (
          transfers.map((transfer) => (
            <TransferCard key={transfer.id} item={transfer} />
          ))
        ) : (
          <p className="no-results">
            No se encontraron transfers que coincidan con los filtros
            seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
