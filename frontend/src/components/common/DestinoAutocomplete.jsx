import React, { useState, useEffect, useRef } from "react";
import "../../styles/autocomplete.css";

export default function DestinoAutocomplete({
  label,
  name,
  value,
  onChange,
  placeholder = "Ingresa un destino...",
  error,
  required = false,
  hideLabel = false,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  const fetchDestinations = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}` +
          `&format=json` +
          `&limit=8` +
          `&addressdetails=1` +
          `&accept-language=es` +
          `&featuretype=city`,
      );

      const data = await response.json();

      const formattedSuggestions = data
        .filter((place) => {
          const type = place.type;
          const placeClass = place.class;
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
          const state = place.address?.state || "";
          const country = place.address?.country || "";

          let icon = "🏙️";
          if (place.type === "airport" || place.class === "aeroway") {
            icon = "✈️";
          } else if (place.type === "city" || place.type === "administrative") {
            icon = "🏙️";
          }

          return {
            name: city,
            state: state,
            country: country,
            display: `${city}${state ? ", " + state : ""}${country ? ", " + country : ""}`,
            icon: icon,
          };
        })
        .slice(0, 8);

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange({ target: { name, value: inputValue } });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (inputValue.length >= 3) {
      timeoutRef.current = setTimeout(() => {
        fetchDestinations(inputValue);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange({ target: { name, value: suggestion.display } });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-group" ref={containerRef}>
      {!hideLabel && label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="autocomplete-container">
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={error ? "error" : ""}
          autoComplete="off"
          required={required}
        />
        {loading && (
          <div className="autocomplete-loading">
            <div className="spinner-small"></div>
          </div>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="autocomplete-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="autocomplete-item"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <span className="autocomplete-icon">{suggestion.icon}</span>
                <div className="autocomplete-text">
                  <span className="autocomplete-name">{suggestion.name}</span>
                  {(suggestion.state || suggestion.country) && (
                    <span className="autocomplete-location">
                      {suggestion.state}
                      {suggestion.state && suggestion.country && ", "}
                      {suggestion.country}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
