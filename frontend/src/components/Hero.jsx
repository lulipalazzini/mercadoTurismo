import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import videoBackground from "../assets/2169879_uhd_3840_2160_30fps_V2.mp4";

export default function Hero() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    origen: "",
    destino: "",
    fechaIda: "",
    fechaVuelta: "",
    pasajeros: 1,
  });

  // Estados para autocompletado
  const [origenSuggestions, setOrigenSuggestions] = useState([]);
  const [destinoSuggestions, setDestinoSuggestions] = useState([]);
  const [showOrigenSuggestions, setShowOrigenSuggestions] = useState(false);
  const [showDestinoSuggestions, setShowDestinoSuggestions] = useState(false);
  const origenTimeoutRef = useRef(null);
  const destinoTimeoutRef = useRef(null);
  const origenRef = useRef(null);
  const destinoRef = useRef(null);

  // Función para buscar destinos con la API de Nominatim
  const fetchDestinations = async (query) => {
    if (query.length < 3) return [];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}` +
          `&format=json` +
          `&limit=8` +
          `&addressdetails=1` +
          `&accept-language=es` +
          `&featuretype=city`, // Priorizar ciudades
      );

      const data = await response.json();

      // Filtrar y priorizar resultados más relevantes
      return data
        .filter((place) => {
          const type = place.type;
          const placeClass = place.class;
          // Priorizar ciudades, capitales, aeropuertos
          return (
            type === "city" ||
            type === "administrative" ||
            placeClass === "place" ||
            placeClass === "boundary" ||
            placeClass === "aeroway"
          );
        })
        .map((place) => {
          const city =
            place.address?.city ||
            place.address?.town ||
            place.address?.village ||
            place.name;
          const country = place.address?.country || "";

          let icon = "🏙️";
          if (place.type === "airport" || place.class === "aeroway") {
            icon = "✈️";
          } else if (place.type === "city" || place.type === "administrative") {
            icon = "🏙️";
          }

          return {
            name: city,
            country: country,
            display: `${city}${country ? ", " + country : ""}`,
            icon: icon,
          };
        })
        .slice(0, 8);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return [];
    }
  };

  // Handlers para origen
  const handleOrigenChange = (e) => {
    const value = e.target.value;
    setSearchData((prev) => ({ ...prev, origen: value }));

    if (origenTimeoutRef.current) {
      clearTimeout(origenTimeoutRef.current);
    }

    if (value.length >= 3) {
      origenTimeoutRef.current = setTimeout(async () => {
        const suggestions = await fetchDestinations(value);
        setOrigenSuggestions(suggestions);
        setShowOrigenSuggestions(true);
      }, 300);
    } else {
      setOrigenSuggestions([]);
      setShowOrigenSuggestions(false);
    }
  };

  const handleOrigenSelect = (suggestion) => {
    setSearchData((prev) => ({ ...prev, origen: suggestion.display }));
    setShowOrigenSuggestions(false);
    setOrigenSuggestions([]);
  };

  // Handlers para destino
  const handleDestinoChange = (e) => {
    const value = e.target.value;
    setSearchData((prev) => ({ ...prev, destino: value }));

    if (destinoTimeoutRef.current) {
      clearTimeout(destinoTimeoutRef.current);
    }

    if (value.length >= 3) {
      destinoTimeoutRef.current = setTimeout(async () => {
        const suggestions = await fetchDestinations(value);
        setDestinoSuggestions(suggestions);
        setShowDestinoSuggestions(true);
      }, 300);
    } else {
      setDestinoSuggestions([]);
      setShowDestinoSuggestions(false);
    }
  };

  const handleDestinoSelect = (suggestion) => {
    setSearchData((prev) => ({ ...prev, destino: suggestion.display }));
    setShowDestinoSuggestions(false);
    setDestinoSuggestions([]);
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (origenRef.current && !origenRef.current.contains(event.target)) {
        setShowOrigenSuggestions(false);
      }
      if (destinoRef.current && !destinoRef.current.contains(event.target)) {
        setShowDestinoSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construir query params para pasar a la página de paquetes
    const params = new URLSearchParams();
    if (searchData.destino) params.append("destino", searchData.destino);
    if (searchData.origen) params.append("origen", searchData.origen);
    if (searchData.fechaIda) params.append("fechaIda", searchData.fechaIda);
    if (searchData.fechaVuelta)
      params.append("fechaVuelta", searchData.fechaVuelta);
    if (searchData.pasajeros) params.append("pasajeros", searchData.pasajeros);

    // Navegar a paquetes con los parámetros de búsqueda
    navigate(`/paquetes?${params.toString()}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="hero" id="hero">
      <video
        className="hero-video"
        src={videoBackground}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <h1>Descubrí el mundo a precios de remate</h1>
        <p className="lead">
          Somos la primer plataforma que conecta mayoristas, operadores y
          viajantes en un mismo lugar.
        </p>

        {/* Formulario de Búsqueda Premium */}
        <form className="search-box" onSubmit={handleSubmit}>
          <div className="search-grid">
            <div className="search-field" ref={origenRef}>
              <label htmlFor="origen">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                Origen
              </label>
              <input
                type="text"
                id="origen"
                name="origen"
                placeholder="¿Desde dónde viajas?"
                value={searchData.origen}
                onChange={handleOrigenChange}
                autoComplete="off"
                required
              />
              {showOrigenSuggestions && origenSuggestions.length > 0 && (
                <div className="hero-suggestions-dropdown">
                  {origenSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="hero-suggestion-item"
                      onClick={() => handleOrigenSelect(suggestion)}
                    >
                      <span className="suggestion-icon">{suggestion.icon}</span>
                      <span className="suggestion-text">
                        {suggestion.display}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="search-field" ref={destinoRef}>
              <label htmlFor="destino">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Destino
              </label>
              <input
                type="text"
                id="destino"
                name="destino"
                placeholder="¿A dónde quieres ir?"
                value={searchData.destino}
                onChange={handleDestinoChange}
                autoComplete="off"
                required
              />
              {showDestinoSuggestions && destinoSuggestions.length > 0 && (
                <div className="hero-suggestions-dropdown">
                  {destinoSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="hero-suggestion-item"
                      onClick={() => handleDestinoSelect(suggestion)}
                    >
                      <span className="suggestion-icon">{suggestion.icon}</span>
                      <span className="suggestion-text">
                        {suggestion.display}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="search-field">
              <label htmlFor="fechaIda">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Fecha de ida
              </label>
              <input
                type="date"
                id="fechaIda"
                name="fechaIda"
                value={searchData.fechaIda}
                onChange={handleChange}
                required
              />
            </div>

            <div className="search-field">
              <label htmlFor="fechaVuelta">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Fecha de vuelta
              </label>
              <input
                type="date"
                id="fechaVuelta"
                name="fechaVuelta"
                value={searchData.fechaVuelta}
                onChange={handleChange}
              />
            </div>

            <div className="search-field">
              <label htmlFor="pasajeros">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Pasajeros
              </label>
              <select
                id="pasajeros"
                name="pasajeros"
                value={searchData.pasajeros}
                onChange={handleChange}
              >
                <option value="1">1 pasajero</option>
                <option value="2">2 pasajeros</option>
                <option value="3">3 pasajeros</option>
                <option value="4">4 pasajeros</option>
                <option value="5">5 pasajeros</option>
                <option value="6">6+ pasajeros</option>
              </select>
            </div>

            <button type="submit" className="search-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Buscar viajes
            </button>
          </div>
        </form>

        <div className="hero-ctas">
          <a href="#paquetes" className="btn-link">
            Explorar destinos populares
          </a>
          <span className="separator">•</span>
          <a href="#ofertas" className="btn-link">
            Ver ofertas especiales
          </a>
        </div>
      </div>
    </section>
  );
}
