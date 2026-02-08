import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import DestinoAutocomplete from "./common/DestinoAutocomplete";
import { API_URL as API_BASE_URL } from "../config/api.config.js";

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    origin: "",
    destination: "",
    budget: "",
    currency: "ARS",
  });

  // Estados para búsqueda global
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [globalResults, setGlobalResults] = useState({
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
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [allData, setAllData] = useState(null);
  const popupRef = useRef(null);
  const inputRef = useRef(null);

  // Cargar todos los datos para búsqueda global
  const fetchAllData = async () => {
    try {
      const endpoints = [
        { key: "alojamientos", url: `${API_BASE_URL}/alojamientos` },
        { key: "paquetes", url: `${API_BASE_URL}/paquetes` },
        { key: "autos", url: `${API_BASE_URL}/autos` },
        { key: "trenes", url: `${API_BASE_URL}/trenes` },
        { key: "transfers", url: `${API_BASE_URL}/transfers` },
        { key: "circuitos", url: `${API_BASE_URL}/circuitos` },
        { key: "excursiones", url: `${API_BASE_URL}/excursiones` },
        { key: "salidasGrupales", url: `${API_BASE_URL}/salidas-grupales` },
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

  useEffect(() => {
    fetchAllData();
  }, []);

  // Cerrar popup al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        handleCloseGlobalSearch();
      }
    };

    if (isGlobalSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isGlobalSearchOpen]);

  const searchInText = useCallback((text, term) => {
    if (!text) return false;
    return String(text).toLowerCase().includes(term.toLowerCase());
  }, []);

  const performGlobalSearch = useCallback(
    (term) => {
      if (!term.trim() || !allData) {
        setGlobalResults({
          alojamientos: [],
          paquetes: [],
          autos: [],
          transfers: [],
          circuitos: [],
          excursiones: [],
          salidasGrupales: [],
          cruceros: [],
          seguros: [],
          trenes: [],
        });
        return;
      }

      setLoadingGlobal(true);

      const newResults = {
        alojamientos: allData.alojamientos.filter(
          (item) =>
            searchInText(item.nombre, term) ||
            searchInText(item.ubicacion, term) ||
            searchInText(item.descripcion, term) ||
            searchInText(item.ciudad, term) ||
            searchInText(item.pais, term),
        ),
        paquetes: allData.paquetes.filter(
          (item) =>
            searchInText(item.nombre, term) ||
            searchInText(item.destino, term) ||
            searchInText(item.descripcion, term) ||
            searchInText(item.incluye, term),
        ),
        autos: allData.autos.filter(
          (item) =>
            searchInText(item.modelo, term) ||
            searchInText(item.marca, term) ||
            searchInText(item.ubicacion, term) ||
            searchInText(item.descripcion, term),
        ),
        transfers: allData.transfers.filter(
          (item) =>
            searchInText(item.origen, term) ||
            searchInText(item.destino, term) ||
            searchInText(item.tipoVehiculo, term) ||
            searchInText(item.descripcion, term),
        ),
        trenes: allData.trenes.filter(
          (item) =>
            searchInText(item.nombre, term) ||
            searchInText(item.ruta, term) ||
            searchInText(item.descripcion, term),
        ),
        circuitos: allData.circuitos.filter(
          (item) =>
            searchInText(item.nombre, term) ||
            searchInText(item.destinos, term) ||
            searchInText(item.descripcion, term) ||
            searchInText(item.incluye, term),
        ),
        excursiones: allData.excursiones.filter(
          (item) =>
            searchInText(item.nombre, term) ||
            searchInText(item.ubicacion, term) ||
            searchInText(item.descripcion, term) ||
            searchInText(item.incluye, term),
        ),
        salidasGrupales: allData.salidasGrupales.filter(
          (item) =>
            searchInText(item.nombre, term) ||
            searchInText(item.destino, term) ||
            searchInText(item.descripcion, term) ||
            searchInText(item.incluye, term),
        ),
        cruceros: allData.cruceros.filter(
          (item) =>
            searchInText(item.nombre, term) ||
            searchInText(item.naviera, term) ||
            searchInText(item.itinerario, term) ||
            searchInText(item.descripcion, term),
        ),
        seguros: allData.seguros.filter(
          (item) =>
            searchInText(item.nombre, term) ||
            searchInText(item.cobertura, term) ||
            searchInText(item.descripcion, term) ||
            searchInText(item.incluye, term),
        ),
      };

      setGlobalResults(newResults);
      setLoadingGlobal(false);
    },
    [allData, searchInText],
  );

  const getTotalResults = () => {
    return Object.values(globalResults).reduce(
      (total, arr) => total + arr.length,
      0,
    );
  };

  const handleCloseGlobalSearch = () => {
    setIsGlobalSearchOpen(false);
    setGlobalSearchTerm("");
    setGlobalResults({
      alojamientos: [],
      paquetes: [],
      autos: [],
      transfers: [],
      circuitos: [],
      excursiones: [],
      salidasGrupales: [],
      cruceros: [],
      seguros: [],
      trenes: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (e) => {
    let value = e.target.value;
    // Eliminar TODOS los caracteres que no sean dígitos (0-9)
    // Esto incluye: letras, espacios, puntos, comas, signos negativos, etc.
    const cleanValue = value.replace(/\D/g, "");
    setSearchForm((prev) => ({ ...prev, budget: cleanValue }));
  };

  const handleBudgetKeyDown = (e) => {
    // Lista de teclas permitidas
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Si es una tecla permitida, dejar pasar
    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Solo permitir números del 0 al 9
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleBudgetPaste = (e) => {
    // Obtener el texto pegado
    const pasteData = e.clipboardData.getData("text");
    // Si contiene algo que no sea número, prevenir el pegado
    if (/\D/.test(pasteData)) {
      e.preventDefault();
      // Extraer solo los números y pegarlos
      const numbers = pasteData.replace(/\D/g, "");
      if (numbers) {
        setSearchForm((prev) => ({ ...prev, budget: prev.budget + numbers }));
      }
    }
  };

  const handleKeyDown = (e) => {
    // Solo abrir búsqueda global al presionar Enter
    if (e.key === "Enter" && searchForm.destination.trim()) {
      e.preventDefault();
      setGlobalSearchTerm(searchForm.destination);
      setIsGlobalSearchOpen(true);
      performGlobalSearch(searchForm.destination);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Si no hay destino, no hacer nada
    if (!searchForm.destination.trim()) return;

    // Cerrar popup si está abierto
    handleCloseGlobalSearch();

    // Navegación a paquetes con filtros explícitos
    const params = new URLSearchParams();

    // Destino es obligatorio para búsqueda de paquetes
    params.append("destino", searchForm.destination);

    // Origen opcional (si el backend lo soporta en el futuro)
    if (searchForm.origin) {
      params.append("origen", searchForm.origin);
    }

    // Presupuesto máximo se mapea a precioMax
    if (searchForm.budget) {
      params.append("precioMax", searchForm.budget);
      params.append("moneda", searchForm.currency);
    }

    // Navegar a página de paquetes con filtros
    navigate(`/paquetes?${params.toString()}`);
  };

  if (compact) {
    // Versión ultra compacta para Navbar inline - solo destino y botón
    return (
      <>
        <form onSubmit={handleSearch} className="w-full">
          <div className="flex items-center gap-2">
            {/* Destino */}
            <div className="flex-1 relative">
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  name="destination"
                  value={searchForm.destination}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="¿A dónde querés ir? (Enter para buscar)"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Popup de búsqueda global */}
        {isGlobalSearchOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
            <div
              ref={popupRef}
              className="bg-white rounded-2xl w-full max-w-6xl mt-20 mb-10 shadow-2xl max-h-[80vh] flex flex-col"
              style={{ animation: "slideDown 0.3s ease" }}
            >
              {/* Header del popup */}
              <div className="flex items-center gap-4 p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={globalSearchTerm}
                    onChange={(e) => {
                      setGlobalSearchTerm(e.target.value);
                      performGlobalSearch(e.target.value);
                    }}
                    placeholder="Buscar en todos los servicios..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleCloseGlobalSearch}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Cerrar búsqueda"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Resultados */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingGlobal ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg
                      className="animate-spin h-8 w-8 mx-auto mb-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Buscando...
                  </div>
                ) : globalSearchTerm && getTotalResults() === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No se encontraron resultados para "{globalSearchTerm}"
                  </div>
                ) : !globalSearchTerm ? (
                  <div className="text-center py-12 text-gray-500">
                    Escribe algo para buscar en todos los servicios
                  </div>
                ) : (
                  <>
                    <div className="mb-6 text-sm font-semibold text-gray-600">
                      {getTotalResults()} resultado(s) encontrado(s)
                    </div>

                    {globalResults.alojamientos.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Alojamientos ({globalResults.alojamientos.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.alojamientos.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <AlojamientoCard alojamiento={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.paquetes.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Paquetes ({globalResults.paquetes.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.paquetes.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <PaqueteCard item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.autos.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Autos ({globalResults.autos.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.autos.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <AutoCard item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.transfers.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Transfers ({globalResults.transfers.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.transfers.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <TransferCard item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.trenes.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Trenes ({globalResults.trenes.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.trenes.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <TrenCard item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.circuitos.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Circuitos ({globalResults.circuitos.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.circuitos.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <CircuitoCard item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.excursiones.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Excursiones ({globalResults.excursiones.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.excursiones.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <ExcursionCard item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.salidasGrupales.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Salidas Grupales (
                          {globalResults.salidasGrupales.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.salidasGrupales.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <SalidaGrupalCard item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.cruceros.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Cruceros ({globalResults.cruceros.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.cruceros.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <CruceroCard item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalResults.seguros.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Seguros ({globalResults.seguros.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {globalResults.seguros.map((item) => (
                            <div
                              key={item.id}
                              onClick={handleCloseGlobalSearch}
                            >
                              <SeguroCard item={item} />
                            </div>
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

  // Versión completa (original para Hero o landing pages)
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Origen */}
            <div className="space-y-2">
              <DestinoAutocomplete
                label="Origen"
                name="origin"
                value={searchForm.origin}
                onChange={handleInputChange}
                placeholder="Ingresa origen..."
              />
            </div>

            {/* Destino */}
            <div className="space-y-2">
              <DestinoAutocomplete
                label="Destino"
                name="destination"
                value={searchForm.destination}
                onChange={handleInputChange}
                placeholder="Ingresa destino..."
              />
            </div>

            {/* Presupuesto Máximo */}
            <div className="space-y-2">
              <label
                htmlFor="budget"
                className="block text-sm font-semibold text-gray-700"
              >
                Presupuesto Máximo
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={searchForm.budget}
                    onChange={handleBudgetChange}
                    onKeyDown={handleBudgetKeyDown}
                    onPaste={handleBudgetPaste}
                    placeholder="Ej: 500000"
                    inputMode="numeric"
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
                <select
                  name="currency"
                  value={searchForm.currency}
                  onChange={handleInputChange}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white font-semibold text-gray-700"
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* Botón CTA */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-transparent select-none">
                .
              </label>
              <button
                type="submit"
                className="w-full h-[52px] bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Comparar Agencias
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Compará precios y servicios de diferentes agencias de viaje en un
            solo lugar
          </p>
        </form>
      </div>
    </div>
  );
}
