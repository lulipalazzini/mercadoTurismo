import React, { useState, useEffect } from "react";
import PaqueteCard from "../components/PaqueteCard";
import "../styles/servicios.css";

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaquetes();
  }, []);

  const fetchPaquetes = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/paquetes");
      if (!response.ok) {
        throw new Error("Error al cargar los paquetes");
      }
      const data = await response.json();
      setPaquetes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando paquetes...</div>
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
      <h1 className="servicios-title">Paquetes Turísticos</h1>
      <div className="servicios-grid">
        {paquetes.length > 0 ? (
          paquetes.map((paquete) => (
            <PaqueteCard key={paquete.id} item={paquete} />
          ))
        ) : (
          <p className="no-results">No hay paquetes disponibles</p>
        )}
      </div>
    </div>
  );
}
