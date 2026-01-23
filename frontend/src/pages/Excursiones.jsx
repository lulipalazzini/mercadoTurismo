import React, { useState, useEffect } from "react";
import ExcursionCard from "../components/ExcursionCard";
import SearchBox from "../components/SearchBox";
import "../styles/servicios.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function Excursiones() {
  const [excursiones, setExcursiones] = useState([]);
  const [allExcursiones, setAllExcursiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExcursiones();
  }, []);

  const fetchExcursiones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/excursiones`);
      if (!response.ok) {
        throw new Error("Error al cargar las excursiones");
      }
      const data = await response.json();
      setExcursiones(data);
      setAllExcursiones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setExcursiones(allExcursiones);
      return;
    }

    const filtered = allExcursiones.filter((excursion) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        excursion.nombre?.toLowerCase().includes(searchLower) ||
        excursion.ubicacion?.toLowerCase().includes(searchLower) ||
        excursion.descripcion?.toLowerCase().includes(searchLower) ||
        excursion.incluye?.toLowerCase().includes(searchLower)
      );
    });

    setExcursiones(filtered);
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
      <SearchBox
        onSearch={handleSearch}
        placeholder="Buscar excursiones por ubicación o actividad..."
      />
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
