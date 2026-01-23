import React, { useState, useEffect } from "react";
import TransferCard from "../components/TransferCard";
import SearchBox from "../components/SearchBox";
import "../styles/servicios.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [allTransfers, setAllTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transfers`);
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

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setTransfers(allTransfers);
      return;
    }

    const filtered = allTransfers.filter((transfer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        transfer.origen?.toLowerCase().includes(searchLower) ||
        transfer.destino?.toLowerCase().includes(searchLower) ||
        transfer.tipoVehiculo?.toLowerCase().includes(searchLower) ||
        transfer.descripcion?.toLowerCase().includes(searchLower)
      );
    });

    setTransfers(filtered);
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
      <h1 className="servicios-title">Transfers</h1>{" "}
      <SearchBox
        onSearch={handleSearch}
        placeholder="Buscar transfers por origen o destino..."
      />{" "}
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
