import React, { useState, useEffect } from "react";
import AlojamientoCard from "../components/AlojamientoCard";
import SearchBox from "../components/SearchBox";
import "../styles/alojamientos.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function Alojamientos() {
  const [alojamientos, setAlojamientos] = useState([]);
  const [allAlojamientos, setAllAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlojamientos();
  }, []);

  const fetchAlojamientos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alojamientos`);
      if (!response.ok) {
        throw new Error("Error al cargar los alojamientos");
      }
      const data = await response.json();
      setAlojamientos(data);
      setAllAlojamientos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setAlojamientos(allAlojamientos);
      return;
    }

    const filtered = allAlojamientos.filter((alojamiento) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        alojamiento.nombre?.toLowerCase().includes(searchLower) ||
        alojamiento.ubicacion?.toLowerCase().includes(searchLower) ||
        alojamiento.ciudad?.toLowerCase().includes(searchLower) ||
        alojamiento.pais?.toLowerCase().includes(searchLower) ||
        alojamiento.descripcion?.toLowerCase().includes(searchLower)
      );
    });

    setAlojamientos(filtered);
  };

  if (loading) {
    return (
      <div className="alojamientos-container">
        <div className="loading">Cargando alojamientos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alojamientos-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="alojamientos-container">
      <h1 className="alojamientos-title">Alojamientos Disponibles</h1>
      <SearchBox
        onSearch={handleSearch}
        placeholder="Buscar alojamientos por ciudad o destino..."
      />
      <div className="alojamientos-grid">
        {alojamientos.length > 0 ? (
          alojamientos.map((alojamiento) => (
            <AlojamientoCard key={alojamiento.id} alojamiento={alojamiento} />
          ))
        ) : (
          <p className="no-results">No hay alojamientos disponibles</p>
        )}
      </div>
    </div>
  );
}
