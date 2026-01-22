import React, { useState, useEffect } from "react";
import SalidaGrupalCard from "../components/SalidaGrupalCard";
import SearchBox from "../components/SearchBox";
import "../styles/servicios.css";

export default function SalidasGrupales() {
  const [salidas, setSalidas] = useState([]);
  const [allSalidas, setAllSalidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalidas();
  }, []);

  const fetchSalidas = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/salidas-grupales"
      );
      if (!response.ok) {
        throw new Error("Error al cargar las salidas grupales");
      }
      const data = await response.json();
      setSalidas(data);
      setAllSalidas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSalidas(allSalidas);
      return;
    }

    const filtered = allSalidas.filter((salida) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        salida.nombre?.toLowerCase().includes(searchLower) ||
        salida.destino?.toLowerCase().includes(searchLower) ||
        salida.descripcion?.toLowerCase().includes(searchLower) ||
        salida.incluye?.toLowerCase().includes(searchLower)
      );
    });

    setSalidas(filtered);
  };

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading">Cargando salidas grupales...</div>
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
      <h1 className="servicios-title">Salidas Grupales</h1>
      <SearchBox
        onSearch={handleSearch}
        placeholder="Buscar salidas grupales por destino..."
      />
      <div className="servicios-grid">
        {salidas.length > 0 ? (
          salidas.map((salida) => (
            <SalidaGrupalCard key={salida.id} item={salida} />
          ))
        ) : (
          <p className="no-results">No hay salidas grupales disponibles</p>
        )}
      </div>
    </div>
  );
}
