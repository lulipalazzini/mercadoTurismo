import React from "react";
import "../../styles/passengerSelector.css";

/**
 * Selector de pasajeros con contadores independientes para adultos y menores
 * @param {number} adults - Número de adultos (18+ años)
 * @param {number} minors - Número de menores (0-17 años)
 * @param {function} onChange - Callback que recibe { adults, minors }
 * @param {number} maxTotal - Límite total de pasajeros (opcional)
 * @param {boolean} compact - Modo compacto para filtros (opcional)
 */
export default function PassengerSelector({
  adults = 1,
  minors = 0,
  onChange,
  maxTotal = 15,
  compact = false,
}) {
  const total = adults + minors;

  const handleChange = (type, delta) => {
    let newAdults = adults;
    let newMinors = minors;

    if (type === "adults") {
      newAdults = Math.max(1, adults + delta); // Mínimo 1 adulto
    } else if (type === "minors") {
      newMinors = Math.max(0, minors + delta); // Mínimo 0 menores
    }

    // Validar que no exceda el máximo total
    if (newAdults + newMinors <= maxTotal) {
      onChange({ adults: newAdults, minors: newMinors });
    }
  };

  const canDecreaseAdults = adults > 1;
  const canDecreaseMinors = minors > 0;
  const canIncrease = total < maxTotal;

  if (compact) {
    // Versión compacta para filtros
    return (
      <div className="passenger-selector-compact">
        <div className="passenger-row">
          <span className="passenger-label">Adultos</span>
          <div className="passenger-controls">
            <button
              type="button"
              className="counter-btn"
              onClick={() => handleChange("adults", -1)}
              disabled={!canDecreaseAdults}
              aria-label="Disminuir adultos"
            >
              −
            </button>
            <span className="counter-value">{adults}</span>
            <button
              type="button"
              className="counter-btn"
              onClick={() => handleChange("adults", 1)}
              disabled={!canIncrease}
              aria-label="Aumentar adultos"
            >
              +
            </button>
          </div>
        </div>
        <div className="passenger-row">
          <span className="passenger-label">Menores</span>
          <div className="passenger-controls">
            <button
              type="button"
              className="counter-btn"
              onClick={() => handleChange("minors", -1)}
              disabled={!canDecreaseMinors}
              aria-label="Disminuir menores"
            >
              −
            </button>
            <span className="counter-value">{minors}</span>
            <button
              type="button"
              className="counter-btn"
              onClick={() => handleChange("minors", 1)}
              disabled={!canIncrease}
              aria-label="Aumentar menores"
            >
              +
            </button>
          </div>
        </div>
        <div className="passenger-total">Total: {total} pasajeros</div>
      </div>
    );
  }

  // Versión completa para búsquedas principales
  return (
    <div className="passenger-selector">
      <div className="passenger-icon">
        <svg
          width="18"
          height="18"
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
        <span className="passenger-main-label">Pasajeros</span>
      </div>

      <div className="passenger-groups">
        <div className="passenger-group">
          <div className="passenger-info">
            <span className="passenger-type">Adultos</span>
            <span className="passenger-hint">18 años o más</span>
          </div>
          <div className="passenger-controls">
            <button
              type="button"
              className="counter-btn"
              onClick={() => handleChange("adults", -1)}
              disabled={!canDecreaseAdults}
              aria-label="Disminuir adultos"
            >
              −
            </button>
            <span className="counter-value">{adults}</span>
            <button
              type="button"
              className="counter-btn"
              onClick={() => handleChange("adults", 1)}
              disabled={!canIncrease}
              aria-label="Aumentar adultos"
            >
              +
            </button>
          </div>
        </div>

        <div className="passenger-group">
          <div className="passenger-info">
            <span className="passenger-type">Menores</span>
            <span className="passenger-hint">0 a 17 años</span>
          </div>
          <div className="passenger-controls">
            <button
              type="button"
              className="counter-btn"
              onClick={() => handleChange("minors", -1)}
              disabled={!canDecreaseMinors}
              aria-label="Disminuir menores"
            >
              −
            </button>
            <span className="counter-value">{minors}</span>
            <button
              type="button"
              className="counter-btn"
              onClick={() => handleChange("minors", 1)}
              disabled={!canIncrease}
              aria-label="Aumentar menores"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="passenger-summary">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
        <span>
          {total} {total === 1 ? "pasajero" : "pasajeros"} seleccionado
          {total !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
