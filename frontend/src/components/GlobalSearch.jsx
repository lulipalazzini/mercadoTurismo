import React, { useState, useEffect, useRef, useCallback } from "react";
import AlojamientoCard from "./AlojamientoCard";
import PaqueteCard from "./PaqueteCard";
import AutoCard from "./AutoCard";
import TransferCard from "./TransferCard";
import TrenCard from "./TrenCard";
import CircuitoCard from "./CircuitoCard";
import ExcursionCard from "./ExcursionCard";
import SalidaGrupalCard from "./SalidaGrupalCard";
import CruceroCard from "./CruceroCard";
import SeguroCard from "./SeguroCard";
import "../styles/globalSearch.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({
    alojamientos: [],
    paquetes: [],
    autos: [],
    transfers: [],
    trenes: [],
    circuitos: [],
    excursiones: [],
    salidasGrupales: [],
    cruceros: [],
    seguros: [],
  });
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState(null);
  const searchInputRef = useRef(null);

  const fetchAllData = async () => {
    try {
      // Solo servicios minoristas (sin Cupos que es exclusivo de mayoristas)
      const endpoints = [
        { key: "alojamientos", url: `${API_BASE_URL}/alojamientos` },
        { key: "paquetes", url: `${API_BASE_URL}/paquetes` },
        { key: "autos", url: `${API_BASE_URL}/autos` },
        { key: "trenes", url: `${API_BASE_URL}/trenes` },
        { key: "transfers", url: `${API_BASE_URL}/transfers` },
        { key: "circuitos", url: `${API_BASE_URL}/circuitos` },
        { key: "excursiones", url: `${API_BASE_URL}/excursiones` },
        {
          key: "salidasGrupales",
          url: `${API_BASE_URL}/salidas-grupales`,
        },
        { key: "cruceros", url: `${API_BASE_URL}/cruceros` },
        { key: "seguros", url: `${API_BASE_URL}/seguros` },
      ];

      const promises = endpoints.map((endpoint) =>
        fetch(endpoint.url)
          .then((res) => res.json())
          .then((data) => ({ key: endpoint.key, data }))
          .catch(() => ({ key: endpoint.key, data: [] })),
      );

      const responses = await Promise.all(promises);
      const data = {};
      responses.forEach((response) => {
        data[response.key] = response.data;
      });

      setAllData(data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    fetchAllData();
  }, []);

  // Enfocar input cuando se abre el modal
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const searchInText = useCallback((text, term) => {
    if (!text) return false;
    return String(text).toLowerCase().includes(term.toLowerCase());
  }, []);

  const performSearch = useCallback(() => {
    if (!searchTerm.trim() || !allData) {
      setResults({
        alojamientos: [],
        paquetes: [],
        autos: [],
        transfers: [],
        circuitos: [],
        excursiones: [],
        salidasGrupales: [],
        cruceros: [],
        seguros: [],
      });
      return;
    }

    setLoading(true);

    const newResults = {
      alojamientos: allData.alojamientos.filter(
        (item) =>
          searchInText(item.nombre, searchTerm) ||
          searchInText(item.ubicacion, searchTerm) ||
          searchInText(item.descripcion, searchTerm) ||
          searchInText(item.ciudad, searchTerm) ||
          searchInText(item.pais, searchTerm),
      ),
      paquetes: allData.paquetes.filter(
        (item) =>
          searchInText(item.nombre, searchTerm) ||
          searchInText(item.destino, searchTerm) ||
          searchInText(item.descripcion, searchTerm) ||
          searchInText(item.incluye, searchTerm),
      ),
      autos: allData.autos.filter(
        (item) =>
          searchInText(item.modelo, searchTerm) ||
          searchInText(item.marca, searchTerm) ||
          searchInText(item.ubicacion, searchTerm) ||
          searchInText(item.descripcion, searchTerm),
      ),
      transfers: allData.transfers.filter(
        (item) =>
          searchInText(item.origen, searchTerm) ||
          searchInText(item.destino, searchTerm) ||
          searchInText(item.tipoVehiculo, searchTerm) ||
          searchInText(item.descripcion, searchTerm),
      ),
      circuitos: allData.circuitos.filter(
        (item) =>
          searchInText(item.nombre, searchTerm) ||
          searchInText(item.destinos, searchTerm) ||
          searchInText(item.descripcion, searchTerm) ||
          searchInText(item.incluye, searchTerm),
      ),
      excursiones: allData.excursiones.filter(
        (item) =>
          searchInText(item.nombre, searchTerm) ||
          searchInText(item.ubicacion, searchTerm) ||
          searchInText(item.descripcion, searchTerm) ||
          searchInText(item.incluye, searchTerm),
      ),
      salidasGrupales: allData.salidasGrupales.filter(
        (item) =>
          searchInText(item.nombre, searchTerm) ||
          searchInText(item.destino, searchTerm) ||
          searchInText(item.descripcion, searchTerm) ||
          searchInText(item.incluye, searchTerm),
      ),
      cruceros: allData.cruceros.filter(
        (item) =>
          searchInText(item.nombre, searchTerm) ||
          searchInText(item.naviera, searchTerm) ||
          searchInText(item.itinerario, searchTerm) ||
          searchInText(item.descripcion, searchTerm),
      ),
      seguros: allData.seguros.filter(
        (item) =>
          searchInText(item.nombre, searchTerm) ||
          searchInText(item.cobertura, searchTerm) ||
          searchInText(item.descripcion, searchTerm) ||
          searchInText(item.incluye, searchTerm),
      ),
    };

    setResults(newResults);
    setLoading(false);
  }, [searchTerm, allData, searchInText]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, allData, performSearch]);

  const getTotalResults = () => {
    return Object.values(results).reduce((total, arr) => total + arr.length, 0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
    setResults({
      alojamientos: [],
      paquetes: [],
      autos: [],
      transfers: [],
      circuitos: [],
      excursiones: [],
      salidasGrupales: [],
      cruceros: [],
      seguros: [],
    });
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className="global-search-button"
        onClick={() => setIsOpen(true)}
        aria-label="Búsqueda global"
      >
        <i className="fas fa-search"></i>
      </button>

      {/* Modal de búsqueda */}
      {isOpen && (
        <div className="global-search-overlay" onClick={handleClose}>
          <div
            className="global-search-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-header">
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar en todos los servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    className="clear-button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <button className="close-button" onClick={handleClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="search-results">
              {loading ? (
                <div className="loading-message">Buscando...</div>
              ) : searchTerm && getTotalResults() === 0 ? (
                <div className="no-results-message">
                  No se encontraron resultados para "{searchTerm}"
                </div>
              ) : !searchTerm ? (
                <div className="initial-message">
                  Escribe algo para buscar en todos los servicios
                </div>
              ) : (
                <>
                  <div className="results-count">
                    {getTotalResults()} resultado(s) encontrado(s)
                  </div>

                  {results.alojamientos.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Alojamientos ({results.alojamientos.length})
                      </h2>
                      <div className="results-grid">
                        {results.alojamientos.map((item) => (
                          <AlojamientoCard key={item.id} alojamiento={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.paquetes.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Paquetes ({results.paquetes.length})
                      </h2>
                      <div className="results-grid">
                        {results.paquetes.map((item) => (
                          <PaqueteCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.autos.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Autos ({results.autos.length})
                      </h2>
                      <div className="results-grid">
                        {results.autos.map((item) => (
                          <AutoCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.transfers.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Transfers ({results.transfers.length})
                      </h2>
                      <div className="results-grid">
                        {results.transfers.map((item) => (
                          <TransferCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.trenes.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Trenes ({results.trenes.length})
                      </h2>
                      <div className="results-grid">
                        {results.trenes.map((item) => (
                          <TrenCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.circuitos.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Circuitos ({results.circuitos.length})
                      </h2>
                      <div className="results-grid">
                        {results.circuitos.map((item) => (
                          <CircuitoCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.excursiones.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Excursiones ({results.excursiones.length})
                      </h2>
                      <div className="results-grid">
                        {results.excursiones.map((item) => (
                          <ExcursionCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.salidasGrupales.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Salidas Grupales ({results.salidasGrupales.length})
                      </h2>
                      <div className="results-grid">
                        {results.salidasGrupales.map((item) => (
                          <SalidaGrupalCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.cruceros.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Cruceros ({results.cruceros.length})
                      </h2>
                      <div className="results-grid">
                        {results.cruceros.map((item) => (
                          <CruceroCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.seguros.length > 0 && (
                    <div className="result-section">
                      <h2 className="section-title">
                        Seguros ({results.seguros.length})
                      </h2>
                      <div className="results-grid">
                        {results.seguros.map((item) => (
                          <SeguroCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
