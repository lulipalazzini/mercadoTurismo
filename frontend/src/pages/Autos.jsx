import React, { useState, useEffect } from "react";
import AutoCard from "../components/AutoCard";
import SearchBox from "../components/SearchBox";
import "../styles/servicios.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function Autos() {
  const [autos, setAutos] = useState([]);
  const [allAutos, setAllAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/autos`);
      if (!response.ok) {
        throw new Error("Error al cargar los autos");
      }
      const data = await response.json();
      setAutos(data);
      setAllAutos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setAutos(allAutos);
      return;
    }

    const filtered = allAutos.filter((auto) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        auto.modelo?.toLowerCase().includes(searchLower) ||
        auto.marca?.toLowerCase().includes(searchLower) ||
        auto.ubicacion?.toLowerCase().includes(searchLower) ||
        auto.descripcion?.toLowerCase().includes(searchLower)
      );
    });

    setAutos(filtered);
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
      <SearchBox
        onSearch={handleSearch}
        placeholder="Buscar autos por marca, modelo o ubicación..."
      />
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
