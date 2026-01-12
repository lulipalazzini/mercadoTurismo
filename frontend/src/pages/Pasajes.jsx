import React, { useState, useEffect } from "react";
import PasajeCard from "../components/PasajeCard";
import "../styles/servicios.css";

export default function Pasajes() {
  const [pasajes, setPasajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPasajes();
  }, []);

  const fetchPasajes = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/pasajes");
      if (!response.ok) {
        throw new Error("Error al cargar los pasajes");
      }
      const data = await response.json();
      setPasajes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando pasajes...</div>
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
      <h1 className="servicios-title">Pasajes</h1>
      <div className="servicios-grid">
        {pasajes.length > 0 ? (
          pasajes.map((pasaje) => <PasajeCard key={pasaje.id} item={pasaje} />)
        ) : (
          <p className="no-results">No hay pasajes disponibles</p>
        )}
      </div>
    </div>
  );
}
