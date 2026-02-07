import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Buscador dinámico que cambia los campos según el tipo de servicio seleccionado
 * Diseñado para Mercado Turismo - Marketplace de agencias
 */

const SERVICE_TYPES = [
  { id: "paquetes", label: "Paquetes", icon: "📦", route: "/paquetes" },
  { id: "alojamientos", label: "Alojamiento", icon: "🏨", route: "/alojamientos" },
  { id: "vuelos", label: "Vuelos", icon: "✈️", route: "/vuelos" },
  { id: "autos", label: "Autos", icon: "🚗", route: "/autos" },
  { id: "transfers", label: "Transfers", icon: "🚐", route: "/transfers" },
  { id: "excursiones", label: "Excursiones", icon: "🏞️", route: "/excursiones" },
];

const DESTINATIONS = [
  "Buenos Aires", "Bariloche", "Mendoza", "Ushuaia", "Salta", "Iguazú",
  "Mar del Plata", "Córdoba", "El Calafate", "Puerto Madryn"
];

const ORIGINS = [
  "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Tucumán", "Salta"
];

export default function DynamicSearchBox() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("paquetes");
  const [searchForm, setSearchForm] = useState({
    origin: "",
    destination: "",
    checkIn: "",
    checkOut: "",
    passengers: 1,
    budget: "",
    currency: "ARS"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const service = SERVICE_TYPES.find(s => s.id === selectedService);
    const params = new URLSearchParams();
    
    // Agregar parámetros según el tipo de servicio
    if (searchForm.origin) params.append('origin', searchForm.origin);
    if (searchForm.destination) params.append('destination', searchForm.destination);
    if (searchForm.checkIn) params.append('checkIn', searchForm.checkIn);
    if (searchForm.checkOut) params.append('checkOut', searchForm.checkOut);
    if (searchForm.passengers) params.append('passengers', searchForm.passengers);
    if (searchForm.budget) params.append('budget', searchForm.budget);
    if (searchForm.currency) params.append('currency', searchForm.currency);
    
    navigate(`${service.route}?${params.toString()}`);
  };

  // Renderizar campos específicos según el tipo de servicio
  const renderSearchFields = () => {
    switch (selectedService) {
      case "paquetes":
        return (
          <>
            <SearchInput
              label="Origen"
              name="origin"
              type="select"
              options={ORIGINS}
              value={searchForm.origin}
              onChange={handleInputChange}
              icon="location"
              placeholder="Seleccionar origen"
            />
            <SearchInput
              label="Destino"
              name="destination"
              type="select"
              options={DESTINATIONS}
              value={searchForm.destination}
              onChange={handleInputChange}
              icon="globe"
              placeholder="¿A dónde querés ir?"
            />
            <BudgetInput
              label="Presupuesto"
              budget={searchForm.budget}
              currency={searchForm.currency}
              onBudgetChange={(e) => handleInputChange(e)}
              onCurrencyChange={(e) => handleInputChange(e)}
            />
          </>
        );
      
      case "alojamientos":
        return (
          <>
            <SearchInput
              label="Destino"
              name="destination"
              type="select"
              options={DESTINATIONS}
              value={searchForm.destination}
              onChange={handleInputChange}
              icon="location"
              placeholder="Ciudad o zona"
            />
            <SearchInput
              label="Check-in"
              name="checkIn"
              type="date"
              value={searchForm.checkIn}
              onChange={handleInputChange}
              icon="calendar"
            />
            <SearchInput
              label="Check-out"
              name="checkOut"
              type="date"
              value={searchForm.checkOut}
              onChange={handleInputChange}
              icon="calendar"
            />
            <SearchInput
              label="Huéspedes"
              name="passengers"
              type="number"
              value={searchForm.passengers}
              onChange={handleInputChange}
              icon="users"
              min="1"
              max="10"
            />
          </>
        );
      
      case "autos":
        return (
          <>
            <SearchInput
              label="Lugar de retiro"
              name="origin"
              type="select"
              options={DESTINATIONS}
              value={searchForm.origin}
              onChange={handleInputChange}
              icon="location"
              placeholder="¿Dónde retirás?"
            />
            <SearchInput
              label="Fecha de retiro"
              name="checkIn"
              type="date"
              value={searchForm.checkIn}
              onChange={handleInputChange}
              icon="calendar"
            />
            <SearchInput
              label="Fecha de devolución"
              name="checkOut"
              type="date"
              value={searchForm.checkOut}
              onChange={handleInputChange}
              icon="calendar"
            />
          </>
        );
      
      case "vuelos":
        return (
          <>
            <SearchInput
              label="Origen"
              name="origin"
              type="select"
              options={ORIGINS}
              value={searchForm.origin}
              onChange={handleInputChange}
              icon="airplane"
              placeholder="¿Desde dónde?"
            />
            <SearchInput
              label="Destino"
              name="destination"
              type="select"
              options={DESTINATIONS}
              value={searchForm.destination}
              onChange={handleInputChange}
              icon="airplane"
              placeholder="¿A dónde?"
            />
            <SearchInput
              label="Fecha de ida"
              name="checkIn"
              type="date"
              value={searchForm.checkIn}
              onChange={handleInputChange}
              icon="calendar"
            />
            <SearchInput
              label="Pasajeros"
              name="passengers"
              type="number"
              value={searchForm.passengers}
              onChange={handleInputChange}
              icon="users"
              min="1"
              max="9"
            />
          </>
        );
      
      default:
        return (
          <>
            <SearchInput
              label="Destino"
              name="destination"
              type="select"
              options={DESTINATIONS}
              value={searchForm.destination}
              onChange={handleInputChange}
              icon="globe"
              placeholder="¿A dónde?"
            />
            <BudgetInput
              label="Presupuesto"
              budget={searchForm.budget}
              currency={searchForm.currency}
              onBudgetChange={(e) => handleInputChange(e)}
              onCurrencyChange={(e) => handleInputChange(e)}
            />
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Selector de tipo de servicio */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {SERVICE_TYPES.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              selectedService === service.id
                ? "bg-primary text-white shadow-md transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-lg">{service.icon}</span>
            {service.label}
          </button>
        ))}
      </div>

      {/* Formulario de búsqueda */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSearchFields()}
            
            {/* Botón de búsqueda */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-transparent select-none">.</label>
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
        </form>
      </div>
    </div>
  );
}

// Componente auxiliar para inputs de búsqueda
function SearchInput({ label, name, type, value, onChange, icon, placeholder, options, min, max }) {
  const renderIcon = () => {
    const icons = {
      location: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
      globe: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
      airplane: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l3.057-3L20 6l2 2-5 5-4 4-2 2-3-3-4-4-2-2 3-3z" />,
    };
    return icons[icon] || icons.location;
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {renderIcon()}
        </svg>
        {type === "select" ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
          >
            <option value="">{placeholder || `Seleccionar ${label.toLowerCase()}`}</option>
            {options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
          />
        )}
      </div>
    </div>
  );
}

// Componente auxiliar para presupuesto
function BudgetInput({ label, budget, currency, onBudgetChange, onCurrencyChange }) {
  return (
    <div className="space-y-2">
      <label htmlFor="budget" className="block text-sm font-semibold text-gray-700">
        {label}
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
            value={budget}
            onChange={onBudgetChange}
            placeholder="Máximo"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
          />
        </div>
        <select
          name="currency"
          value={currency}
          onChange={onCurrencyChange}
          className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white font-semibold text-gray-700"
        >
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
        </select>
      </div>
    </div>
  );
}
