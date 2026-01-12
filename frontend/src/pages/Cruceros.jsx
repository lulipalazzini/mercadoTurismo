import React, { useState, useEffect } from "react";
import CruceroCard from "../components/CruceroCard";
import "../styles/servicios.css";

export default function Cruceros() {
  const [cruceros, setCruceros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCruceros();
  }, []);

  const fetchCruceros = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cruceros");
      if (!response.ok) {
        throw new Error("Error al cargar los cruceros");
      }
      const data = await response.json();
      setCruceros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="servicios-grid">
        {cruceros.length > 0 ? (
          cruceros.map((crucero) => (
            <CruceroCard key={crucero.id} item={crucero} />
          ))
        ) : (
          <p className="no-results">No hay cruceros disponibles</p>
        )}
      </div>
    </div>
  );
}
