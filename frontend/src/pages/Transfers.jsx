import React, { useState, useEffect } from "react";
import TransferCard from "../components/TransferCard";
import "../styles/servicios.css";

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/transfers");
      if (!response.ok) {
        throw new Error("Error al cargar los transfers");
      }
      const data = await response.json();
      setTransfers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="servicios-grid">
        {transfers.length > 0 ? (
          transfers.map((transfer) => (
            <TransferCard key={transfer.id} item={transfer} />
          ))
        ) : (
          <p className="no-results">No hay transfers disponibles</p>
        )}
      </div>
    </div>
  );
}
