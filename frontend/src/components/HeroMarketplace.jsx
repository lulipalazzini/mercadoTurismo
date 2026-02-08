import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DestinoAutocomplete from "./common/DestinoAutocomplete";
import heroImage from "../assets/img/paisaje_01.png";

export default function HeroMarketplace() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    origin: "",
    destination: "",
    budget: "",
    currency: "ARS",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrigenChange = (e) => {
    setSearchForm((prev) => ({ ...prev, origin: e.target.value }));
  };

  const handleDestinoChange = (e) => {
    setSearchForm((prev) => ({ ...prev, destination: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    // Note: origin no se usa en el filtrado de paquetes ya que no tienen ese campo
    // if (searchForm.origin) params.append('origin', searchForm.origin);
    if (searchForm.destination)
      params.append("destination", searchForm.destination);
    if (searchForm.budget) params.append("budget", searchForm.budget);
    if (searchForm.currency) params.append("currency", searchForm.currency);

    navigate(`/paquetes?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Imagen de fondo con overlay de baja opacidad para mayor nitidez */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Destinos turísticos"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/40 to-white/60"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          {/* Badge disclaimer - ABOVE THE FOLD */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-blue-light border border-primary/20 rounded-full text-sm font-medium text-primary animate-fade-in">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Mercado Turismo no vende viajes, conecta pasajeros con agencias
          </div>

          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Compará ofertas de{" "}
            <span className="text-primary relative">
              Agencias de Viajes
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-primary/20"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7 Q50 2, 100 7 T198 7"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl sm:text-2xl text-gray-600 font-medium">
            Un solo lugar, múltiples agencias.{" "}
            <span className="text-primary font-semibold">Vos elegís.</span>
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Origen */}
                <div className="space-y-2">
                  <label
                    htmlFor="origin"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Origen
                  </label>
                  <DestinoAutocomplete
                    name="origin"
                    value={searchForm.origin}
                    onChange={handleOrigenChange}
                    placeholder="¿Desde dónde?"
                    hideLabel={true}
                  />
                </div>

                {/* Destino */}
                <div className="space-y-2">
                  <label
                    htmlFor="destination"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Destino
                  </label>
                  <DestinoAutocomplete
                    name="destination"
                    value={searchForm.destination}
                    onChange={handleDestinoChange}
                    placeholder="¿A dónde quieres ir?"
                    hideLabel={true}
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
                        type="number"
                        id="budget"
                        name="budget"
                        value={searchForm.budget}
                        onChange={handleInputChange}
                        placeholder="Ej: 500000"
                        min="0"
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
                Compará precios y servicios de diferentes agencias de viaje en
                un solo lugar
              </p>
            </form>
          </div>
        </div>

        {/* Stats opcionales */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="text-3xl font-bold text-primary">+50</div>
            <div className="text-sm text-gray-600 font-medium">Agencias</div>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="text-3xl font-bold text-primary">+200</div>
            <div className="text-sm text-gray-600 font-medium">Destinos</div>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-gray-600 font-medium">Gratis</div>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-gray-600 font-medium">Disponible</div>
          </div>
        </div>
      </div>
    </section>
  );
}
