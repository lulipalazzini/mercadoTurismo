import React, { useState, useEffect } from "react";
import CruceroCard from "../components/CruceroCard";
import SearchBox from "../components/SearchBox";
import "../styles/servicios.css";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
export default function Cruceros() {
  const [cruceros, setCruceros] = useState([]);
  const [allCruceros, setAllCruceros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCruceros();
  }, []);

  const fetchCruceros = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cruceros`);
      if (!response.ok) {
        throw new Error("Error al cargar los cruceros");
      }
      const data = await response.json();
      setCruceros(data);
      setAllCruceros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setCruceros(allCruceros);
      return;
    }

    const filtered = allCruceros.filter((crucero) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        crucero.nombre?.toLowerCase().includes(searchLower) ||
        crucero.naviera?.toLowerCase().includes(searchLower) ||
        crucero.itinerario?.toLowerCase().includes(searchLower) ||
        crucero.descripcion?.toLowerCase().includes(searchLower)
      );
    });

    setCruceros(filtered);
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
      <SearchBox
        onSearch={handleSearch}
        placeholder="Buscar cruceros por naviera o itinerario..."
      />
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
