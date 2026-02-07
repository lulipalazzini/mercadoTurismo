import React, { useState, useEffect } from "react";
import CupoCard from "../components/CupoCard";
import { API_URL as API_BASE_URL } from '../config/api.config.js';
import "../styles/servicios.css";

export default function Cupos() {
  const [cupos, setCupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCupos();
  }, []);

  const fetchCupos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cupos-mercado`);
      if (!response.ok) {
        throw new Error("Error al cargar los cupos");
      }
      const data = await response.json();
      // Filtrar solo los cupos disponibles para mostrar en el frontend minorista
      const cuposDisponibles = data.filter(
        (cupo) => cupo.estado === "disponible",
      );
      setCupos(cuposDisponibles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando cupos...</div>
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
      <h1 className="servicios-title">Cupos Disponibles</h1>
      <div className="servicios-grid">
        {cupos.length > 0 ? (
          cupos.map((cupo) => <CupoCard key={cupo.id} item={cupo} />)
        ) : (
          <p className="no-results">No hay cupos disponibles</p>
        )}
      </div>
    </div>
  );
}
