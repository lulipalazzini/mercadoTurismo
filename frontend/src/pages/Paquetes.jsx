import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PaqueteCard from "../components/PaqueteCard";
import SearchBox from "../components/SearchBox";
import "../styles/servicios.css";

export default function Paquetes() {
  const [searchParams] = useSearchParams();
  const [paquetes, setPaquetes] = useState([]);
  const [allPaquetes, setAllPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);

  useEffect(() => {
    fetchPaquetes();
  }, []);

  useEffect(() => {
    // Aplicar filtros de búsqueda del Hero cuando hay query params
    if (allPaquetes.length > 0) {
      applyHeroFilters();
    }
  }, [allPaquetes, searchParams]);

  const fetchPaquetes = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/paquetes");
      if (!response.ok) {
        throw new Error("Error al cargar los paquetes");
      }
      const data = await response.json();
      setPaquetes(data);
      setAllPaquetes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyHeroFilters = () => {
    const destino = searchParams.get("destino");
    const origen = searchParams.get("origen");
    const fechaIda = searchParams.get("fechaIda");
    const fechaVuelta = searchParams.get("fechaVuelta");
    const pasajeros = searchParams.get("pasajeros");

    // Si no hay parámetros de búsqueda, mostrar todos
    if (!destino && !origen && !fechaIda && !fechaVuelta) {
      setPaquetes(allPaquetes);
      setSearchInfo(null);
      return;
    }

    // Construir información de búsqueda para mostrar al usuario
    const info = [];
    if (destino) info.push(`Destino: ${destino}`);
    if (origen) info.push(`Origen: ${origen}`);
    if (fechaIda)
      info.push(
        `Ida: ${new Date(fechaIda + "T00:00:00").toLocaleDateString()}`,
      );
    if (fechaVuelta)
      info.push(
        `Vuelta: ${new Date(fechaVuelta + "T00:00:00").toLocaleDateString()}`,
      );
    if (pasajeros)
      info.push(`${pasajeros} pasajero${pasajeros > 1 ? "s" : ""}`);

    setSearchInfo(info.join(" • "));

    // Filtrar paquetes basado en los parámetros
    const filtered = allPaquetes.filter((paquete) => {
      let matches = true;

      // Filtrar por destino
      if (destino) {
        const destinoLower = destino.toLowerCase();
        matches =
          matches &&
          (paquete.destino?.toLowerCase().includes(destinoLower) ||
            paquete.nombre?.toLowerCase().includes(destinoLower) ||
            paquete.descripcion?.toLowerCase().includes(destinoLower));
      }

      // Filtrar por origen (si el paquete tiene información de origen)
      if (origen && paquete.origen) {
        matches =
          matches &&
          paquete.origen.toLowerCase().includes(origen.toLowerCase());
      }

      // Filtrar por fechas (verificar disponibilidad si existe)
      if (fechaIda && paquete.fechaInicio) {
        const fechaInicioPaquete = new Date(paquete.fechaInicio);
        const fechaIdaBusqueda = new Date(fechaIda);
        // Permitir paquetes que inician dentro de un rango de 30 días
        const diffDays = Math.abs(
          (fechaIdaBusqueda - fechaInicioPaquete) / (1000 * 60 * 60 * 24),
        );
        matches = matches && diffDays <= 30;
      }

      // Filtrar por capacidad de pasajeros (si existe)
      if (pasajeros && paquete.capacidadMaxima) {
        matches =
          matches && parseInt(paquete.capacidadMaxima) >= parseInt(pasajeros);
      }

      return matches;
    });

    setPaquetes(filtered);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setPaquetes(allPaquetes);
      setSearchInfo(null);
      return;
    }

    const filtered = allPaquetes.filter((paquete) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        paquete.nombre?.toLowerCase().includes(searchLower) ||
        paquete.destino?.toLowerCase().includes(searchLower) ||
        paquete.descripcion?.toLowerCase().includes(searchLower) ||
        paquete.incluye?.toLowerCase().includes(searchLower)
      );
    });

    setPaquetes(filtered);
    setSearchInfo(null);
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

      {searchInfo && (
        <div className="search-info-banner">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span>Búsqueda: {searchInfo}</span>
          <button
            className="clear-search-btn"
            onClick={() => {
              setPaquetes(allPaquetes);
              setSearchInfo(null);
              window.history.pushState({}, "", "/paquetes");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <SearchBox
        onSearch={handleSearch}
        placeholder="Buscar paquetes por destino..."
      />
      <div className="servicios-grid">
        {paquetes.length > 0 ? (
          paquetes.map((paquete) => (
            <PaqueteCard key={paquete.id} item={paquete} />
          ))
        ) : searchInfo ? (
          <div className="no-results-container">
            <p className="no-results">
              No se encontraron paquetes que coincidan con tu búsqueda
            </p>
            <button
              className="btn-secondary"
              onClick={() => {
                setPaquetes(allPaquetes);
                setSearchInfo(null);
                window.history.pushState({}, "", "/paquetes");
              }}
            >
              Ver todos los paquetes
            </button>
          </div>
        ) : (
          <p className="no-results">No hay paquetes disponibles</p>
        )}
      </div>
    </div>
  );
}
