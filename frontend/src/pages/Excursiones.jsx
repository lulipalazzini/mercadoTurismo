import React, { useState, useEffect } from "react";
import ExcursionCard from "../components/ExcursionCard";
import "../styles/servicios.css";

export default function Excursiones() {
  const [excursiones, setExcursiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExcursiones();
  }, []);

  const fetchExcursiones = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/excursiones");
      if (!response.ok) {
        throw new Error("Error al cargar las excursiones");
      }
      const data = await response.json();
      setExcursiones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando excursiones...</div>
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
      <h1 className="servicios-title">Excursiones</h1>
      <div className="servicios-grid">
        {excursiones.length > 0 ? (
          excursiones.map((excursion) => (
            <ExcursionCard key={excursion.id} item={excursion} />
          ))
        ) : (
          <p className="no-results">No hay excursiones disponibles</p>
        )}
      </div>
    </div>
  );
}
