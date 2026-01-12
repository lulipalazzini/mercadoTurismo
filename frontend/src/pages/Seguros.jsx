import React, { useState, useEffect } from "react";
import SeguroCard from "../components/SeguroCard";
import "../styles/servicios.css";

export default function Seguros() {
  const [seguros, setSeguros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSeguros();
  }, []);

  const fetchSeguros = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/seguros");
      if (!response.ok) {
        throw new Error("Error al cargar los seguros");
      }
      const data = await response.json();
      setSeguros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="servicios-grid">
        {seguros.length > 0 ? (
          seguros.map((seguro) => <SeguroCard key={seguro.id} item={seguro} />)
        ) : (
          <p className="no-results">No hay seguros disponibles</p>
        )}
      </div>
    </div>
  );
}
