import React, { useState } from "react";
import "../styles/hero.css";
import videoBackground from "../assets/2169879-uhd_3840_2160_30fps.mp4";

export default function Hero() {
  const [searchData, setSearchData] = useState({
    origen: "",
    destino: "",
    fechaIda: "",
    fechaVuelta: "",
    pasajeros: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Búsqueda:", searchData);
    // Aquí iría la lógica de búsqueda
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
        <h1>Descubrí el mundo a tu manera</h1>
        <p className="lead">
          Experiencias únicas, destinos increíbles y momentos que permanecen
          para siempre. Tu próxima aventura comienza acá.
        </p>

        {/* Formulario de Búsqueda Premium */}
        <form className="search-box" onSubmit={handleSubmit}>
          <div className="search-grid">
            <div className="search-field">
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
                onChange={handleChange}
                required
              />
            </div>

            <div className="search-field">
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
                onChange={handleChange}
                required
              />
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
