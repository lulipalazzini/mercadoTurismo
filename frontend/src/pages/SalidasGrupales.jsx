import React, { useState, useEffect } from "react";
import SalidaGrupalCard from "../components/SalidaGrupalCard";
import ModuleFilters from "../components/ModuleFilters";
import { API_URL as API_BASE_URL } from '../config/api.config.js';
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
      const response = await fetch(`${API_BASE_URL}/salidas-grupales`);
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

  const handleFiltersChange = (filters) => {
    if (Object.keys(filters).length === 0) {
      setSalidas(allSalidas);
      return;
    }

    const filtered = allSalidas.filter((salida) => {
      let matches = true;

      // Filtro por destino
      if (filters.destino) {
        const destinoLower = filters.destino.toLowerCase();
        matches =
          matches &&
          (salida.destino?.toLowerCase().includes(destinoLower) ||
            salida.nombre?.toLowerCase().includes(destinoLower));
      }

      // Filtro por fecha de salida
      if (filters.fechaSalida && salida.fechaSalida) {
        const fechaSalida = new Date(salida.fechaSalida);
        const fechaFiltro = new Date(filters.fechaSalida);
        matches = matches && fechaSalida >= fechaFiltro;
      }

      // Filtro por duración
      if (filters.duracion && salida.duracion) {
        matches = matches && salida.duracion >= parseInt(filters.duracion);
      }

      // Filtro por precio máximo
      if (filters.precioMax && salida.precio) {
        matches =
          matches && parseFloat(salida.precio) <= parseFloat(filters.precioMax);
      }

      return matches;
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

      <ModuleFilters
        module="salidas-grupales"
        onFiltersChange={handleFiltersChange}
      />

      <div className="servicios-grid">
        {salidas.length > 0 ? (
          salidas.map((salida) => (
            <SalidaGrupalCard key={salida.id} item={salida} />
          ))
        ) : (
          <p className="no-results">
            No se encontraron salidas grupales que coincidan con los filtros
            seleccionados
          </p>
        )}
      </div>
    </div>
  );
}
