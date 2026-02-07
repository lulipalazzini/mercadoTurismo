import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DESTINATIONS = [
  "Buenos Aires", "Bariloche", "Mendoza", "Ushuaia", "Salta", "Iguazú",
  "Mar del Plata", "Córdoba", "El Calafate", "Puerto Madryn", "Villa La Angostura",
  "Miami", "Nueva York", "Cancún", "Punta Cana", "Europa", "Caribe", "Brasil"
];

const ORIGINS = [
  "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Tucumán", "Salta",
  "Mar del Plata", "La Plata", "Neuquén", "Santa Fe"
];

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    origin: "",
    destination: "",
    budget: "",
    currency: "ARS"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.origin) params.append('origin', searchForm.origin);
    if (searchForm.destination) params.append('destination', searchForm.destination);
    if (searchForm.budget) params.append('budget', searchForm.budget);
    if (searchForm.currency) params.append('currency', searchForm.currency);
    
    navigate(`/paquetes?${params.toString()}`);
  };

  if (compact) {
    // Versión ultra compacta para Navbar inline - solo destino y botón
    return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex items-center gap-2">
          {/* Destino */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="destination"
                value={searchForm.destination}
                onChange={handleInputChange}
                placeholder="¿A dónde querés ir?"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            Buscar
          </button>
        </div>
      </form>
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
              <label htmlFor="origin" className="block text-sm font-semibold text-gray-700">
                Origen
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <select
                  id="origin"
                  name="origin"
                  value={searchForm.origin}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
                >
                  <option value="">Seleccionar origen</option>
                  {ORIGINS.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destino */}
            <div className="space-y-2">
              <label htmlFor="destination" className="block text-sm font-semibold text-gray-700">
                Destino
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <select
                  id="destination"
                  name="destination"
                  value={searchForm.destination}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
                >
                  <option value="">Seleccionar destino</option>
                  {DESTINATIONS.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Presupuesto Máximo */}
            <div className="space-y-2">
              <label htmlFor="budget" className="block text-sm font-semibold text-gray-700">
                Presupuesto Máximo
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={searchForm.budget}
                    onChange={handleInputChange}
                    placeholder="Ej: 500000"
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Comparar Agencias
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Compará precios y servicios de diferentes agencias de viaje en un solo lugar
          </p>
        </form>
      </div>
    </div>
  );
}
