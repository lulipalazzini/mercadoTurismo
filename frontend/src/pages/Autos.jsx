import React, { useState, useEffect } from "react";
import AutoCard from "../components/AutoCard";
import "../styles/servicios.css";

export default function Autos() {
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/autos");
      if (!response.ok) {
        throw new Error("Error al cargar los autos");
      }
      const data = await response.json();
      setAutos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="servicios-grid">
        {autos.length > 0 ? (
          autos.map((auto) => <AutoCard key={auto.id} item={auto} />)
        ) : (
          <p className="no-results">No hay autos disponibles</p>
        )}
      </div>
    </div>
  );
}
