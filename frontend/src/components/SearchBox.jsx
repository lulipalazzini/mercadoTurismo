import React, { useState, useEffect, useRef } from "react";
import "../styles/searchBox.css";

export default function SearchBox({
  onSearch,
  placeholder = "Buscar destino...",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce para las búsquedas
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 3) {
        fetchDestinations(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchDestinations = async (query) => {
    setLoading(true);
    try {
      // Usando OpenStreetMap Nominatim API - Gratuita y sin necesidad de API key
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=8&` +
          `accept-language=es`,
      );

      const data = await response.json();

      // Formatear resultados para mostrar ciudad, país
      const formatted = data.map((place) => {
        const parts = [];

        if (place.address.city) parts.push(place.address.city);
        else if (place.address.town) parts.push(place.address.town);
        else if (place.address.village) parts.push(place.address.village);
        else if (place.address.municipality)
          parts.push(place.address.municipality);
        else if (place.address.state) parts.push(place.address.state);

        if (place.address.country) parts.push(place.address.country);

        return {
          id: place.place_id,
          name: parts.join(", ") || place.display_name,
          fullName: place.display_name,
          type: place.type,
          icon: getIconForType(place.type, place.class),
        };
      });

      setSuggestions(formatted);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type, placeClass) => {
    if (placeClass === "place" && ["city", "town", "village"].includes(type)) {
      return "🏙️";
    }
    if (type === "administrative") return "📍";
    if (type === "country") return "🌍";
    if (placeClass === "tourism") return "🏖️";
    if (placeClass === "aeroway") return "✈️";
    return "📍";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);

    // Búsqueda local inmediata
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);

    if (onSearch) {
      onSearch(suggestion.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);

    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="search-box-container" ref={wrapperRef}>
      <form className="search-box-form" onSubmit={handleSubmit}>
        <div className="search-box-input-wrapper">
          <svg
            className="search-box-icon"
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

          <input
            type="text"
            className="search-box-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.length >= 3 && setShowSuggestions(true)}
          />

          {searchTerm && (
            <button
              type="button"
              className="search-box-clear"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <button
            type="submit"
            className="search-box-submit"
            aria-label="Buscar"
          >
            Buscar
          </button>
        </div>
      </form>

      {showSuggestions && searchTerm.length >= 3 && (
        <div className="search-box-suggestions">
          {loading ? (
            <div className="search-box-suggestion-item loading">
              <span className="loading-spinner"></span>
              Buscando destinos...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="search-box-suggestions-header">
                Destinos sugeridos
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  className="search-box-suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <div className="suggestion-content">
                    <span className="suggestion-name">{suggestion.name}</span>
                    {suggestion.fullName !== suggestion.name && (
                      <span className="suggestion-full-name">
                        {suggestion.fullName}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="search-box-suggestion-item no-results">
              No se encontraron destinos
            </div>
          )}
        </div>
      )}

      {searchTerm.length > 0 && searchTerm.length < 3 && showSuggestions && (
        <div className="search-box-suggestions">
          <div className="search-box-suggestion-item hint">
            Escribe al menos 3 caracteres para ver sugerencias
          </div>
        </div>
      )}
    </div>
  );
}
