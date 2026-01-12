import React, { useState, useEffect } from "react";
import CircuitoCard from "../components/CircuitoCard";
import "../styles/servicios.css";

export default function Circuitos() {
  const [circuitos, setCircuitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCircuitos();
  }, []);

  const fetchCircuitos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/circuitos");
      if (!response.ok) {
        throw new Error("Error al cargar los circuitos");
      }
      const data = await response.json();
      setCircuitos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="servicios-grid">
        {circuitos.length > 0 ? (
          circuitos.map((circuito) => (
            <CircuitoCard key={circuito.id} item={circuito} />
          ))
        ) : (
          <p className="no-results">No hay circuitos disponibles</p>
        )}
      </div>
    </div>
  );
}
