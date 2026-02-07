import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importar imágenes
import paisaje01 from "../assets/img/paisaje_01.png";
import backgroundImage from "../assets/img/paisaje_02.png";
import paisaje02 from "../assets/img/paisaje_02.png";
import paisaje03 from "../assets/img/paisaje_03.png";
import paisaje04 from "../assets/img/paisaje_04.png";
import paisaje05 from "../assets/img/paisaje_05.png";
import paisaje06 from "../assets/img/paisaje_06.png";
import paisaje07 from "../assets/img/paisaje_07.png";

// Mock data - reemplazar con datos reales del API
const MOCK_FEATURED_SERVICES = [
  {
    id: 1,
    title: "Bariloche Todo Incluido",
    destination: "Bariloche, Argentina",
    image: paisaje01,
    price: 450000,
    currency: "ARS",
    agencyLogo: "https://via.placeholder.com/120x60?text=Agencia+1",
    agencyName: "Viajes del Sur",
    category: "paquete"
  },
  {
    id: 2,
    title: "Cataratas del Iguazú",
    destination: "Misiones, Argentina",
    image: paisaje02,
    price: 280000,
    currency: "ARS",
    agencyLogo: "https://via.placeholder.com/120x60?text=Agencia+2",
    agencyName: "Turismo Norte",
    category: "paquete"
  },
  {
    id: 3,
    title: "Mendoza - Valle del Vino",
    destination: "Mendoza, Argentina",
    image: paisaje03,
    price: 320000,
    currency: "ARS",
    agencyLogo: "https://via.placeholder.com/120x60?text=Agencia+3",
    agencyName: "Cuyo Express",
    category: "paquete"
  },
  {
    id: 4,
    title: "Ushuaia - Fin del Mundo",
    destination: "Tierra del Fuego, Argentina",
    image: paisaje04,
    price: 680000,
    currency: "ARS",
    agencyLogo: "https://via.placeholder.com/120x60?text=Agencia+4",
    agencyName: "Patagonia Travel",
    category: "paquete"
  },
  {
    id: 5,
    title: "Salta y sus valles",
    destination: "Salta, Argentina",
    image: paisaje05,
    price: 390000,
    currency: "ARS",
    agencyLogo: "https://via.placeholder.com/120x60?text=Agencia+5",
    agencyName: "Norte Mágico",
    category: "paquete"
  },
  {
    id: 6,
    title: "Península Valdés",
    destination: "Chubut, Argentina",
    image: paisaje06,
    price: 520000,
    currency: "ARS",
    agencyLogo: "https://via.placeholder.com/120x60?text=Agencia+6",
    agencyName: "Costa Atlántica",
    category: "paquete"
  },
  {
    id: 7,
    title: "El Calafate - Glaciares",
    destination: "Santa Cruz, Argentina",
    image: paisaje07,
    price: 750000,
    currency: "ARS",
    agencyLogo: "https://via.placeholder.com/120x60?text=Agencia+7",
    agencyName: "Glaciar Tours",
    category: "paquete"
  },
  {
    id: 8,
    title: "Córdoba Sierras",
    destination: "Córdoba, Argentina",
    image: paisaje01,
    price: 215000,
    currency: "ARS",
    agencyLogo: "https://via.placeholder.com/120x60?text=Agencia+8",
    agencyName: "Centro Turismo",
    category: "paquete"
  }
];

export default function FeaturedCarousel() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Rotación automática cada 2 segundos
  useEffect(() => {
    if (isHovered) return; // Pausar al hacer hover

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Cuando llegamos al final, volvemos al principio
        if (prev >= MOCK_FEATURED_SERVICES.length - 4) {
          return 0;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Obtener las 4 cards visibles actuales
  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % MOCK_FEATURED_SERVICES.length;
      visible.push(MOCK_FEATURED_SERVICES[index]);
    }
    return visible;
  };

  const handleCardClick = (service) => {
    navigate(`/paquetes/${service.id}`);
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Fondo destinos turísticos" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/70 to-white/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Ofertas Destacadas
          </h2>
          <p className="text-lg text-gray-600">
            Las mejores propuestas de nuestras agencias asociadas
          </p>
        </div>

        {/* Carrusel */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCards.map((service, idx) => (
              <div
                key={`${service.id}-${currentIndex}-${idx}`}
                className="animate-fade-in cursor-pointer"
                onClick={() => handleCardClick(service)}
              >
                {/* Card */}
                <div className="group relative h-[380px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  {/* Imagen de fondo */}
                  <div className="absolute inset-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>

                  {/* Contenido */}
                  <div className="relative h-full flex flex-col justify-between p-5">
                    {/* Logo de la Agencia - Esquina superior derecha */}
                    <div className="flex justify-end">
                      <div className="bg-white rounded-lg shadow-lg p-2 transform transition-transform group-hover:scale-105">
                        <img
                          src={service.agencyLogo}
                          alt={service.agencyName}
                          className="h-8 w-auto object-contain"
                          title={service.agencyName}
                        />
                      </div>
                    </div>

                    {/* Información inferior */}
                    <div className="space-y-3">
                      {/* Título y destino */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-primary-light transition-colors">
                          {service.title}
                        </h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {service.destination}
                        </div>
                      </div>

                      {/* Precio destacado */}
                      <div className="bg-primary/95 backdrop-blur-sm rounded-lg px-4 py-3 inline-block">
                        <div className="text-white/80 text-xs font-medium mb-0.5">
                          Desde
                        </div>
                        <div className="text-white text-2xl font-bold">
                          {formatPrice(service.price, service.currency)}
                        </div>
                        <div className="text-white/70 text-xs mt-0.5">
                          por persona
                        </div>
                      </div>

                      {/* Badge de categoría */}
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Paquete
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green/90 backdrop-blur-sm text-white">
                          ✓ Disponible
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay con "Ver más" */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white text-primary px-6 py-3 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Ver detalles →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores de progreso */}
          <div className="flex justify-center gap-2 mt-8">
            {MOCK_FEATURED_SERVICES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir a slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Controles opcionales */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + MOCK_FEATURED_SERVICES.length) % MOCK_FEATURED_SERVICES.length)}
              className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary transition-all shadow-sm"
              aria-label="Anterior"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % MOCK_FEATURED_SERVICES.length)}
              className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary transition-all shadow-sm"
              aria-label="Siguiente"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* CTA Ver todas las ofertas */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/paquetes')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Ver todas las ofertas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
