import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api.config";
import { getFirstImageUrl } from "../utils/imageUtils";
import { FaGlobeAmericas, FaStar } from "react-icons/fa";
import ServiceDetailModal from "./ServiceDetailModal";

// Importar imágenes
import backgroundImage1 from "../assets/img/paisaje_01.png";
import backgroundImage2 from "../assets/img/paisaje_02.png";

const TIPO_LABELS = {
  paquete: "Paquete",
  alojamiento: "Alojamiento",
  auto: "Auto",
  transfer: "Transfer",
  crucero: "Crucero",
  excursion: "Excursión",
  salidaGrupal: "Salida Grupal",
  circuito: "Circuito",
  tren: "Tren",
  seguro: "Seguro",
};

export default function FeaturedCarousel() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [publicacionesDestacadas, setPublicacionesDestacadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPublicacion, setSelectedPublicacion] = useState(null);

  // Cargar publicaciones destacadas desde la API
  useEffect(() => {
    const loadPublicacionesDestacadas = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/publicaciones-destacadas`);
        
        if (!response.ok) {
          throw new Error("Error al cargar publicaciones destacadas");
        }

        const data = await response.json();
        setPublicacionesDestacadas(data.publicaciones || []);
      } catch (error) {
        console.error("Error loading featured publications:", error);
        setPublicacionesDestacadas([]);
      } finally {
        setLoading(false);
      }
    };

    loadPublicacionesDestacadas();
  }, []);

  // Rotación automática cada 2 segundos
  useEffect(() => {
    if (isHovered || publicacionesDestacadas.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Cuando llegamos al final, volvemos al principio
        const maxIndex = Math.max(0, publicacionesDestacadas.length - 4);
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 3000); // Cambio a 3 segundos para mejor experiencia

    return () => clearInterval(interval);
  }, [isHovered, publicacionesDestacadas.length]);

  // Obtener las 4 cards visibles actuales
  const getVisibleCards = () => {
    const visible = [];
    const maxVisible = Math.min(4, publicacionesDestacadas.length);
    
    for (let i = 0; i < maxVisible; i++) {
      const index = (currentIndex + i) % publicacionesDestacadas.length;
      visible.push(publicacionesDestacadas[index]);
    }
    return visible;
  };

  const handleCardClick = (publicacion) => {
    setSelectedPublicacion(publicacion);
    setShowModal(true);
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

  // No renderizar si está cargando o no hay publicaciones
  if (loading) {
    return (
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Cargando ofertas destacadas...</p>
          </div>
        </div>
      </section>
    );
  }

  if (publicacionesDestacadas.length === 0) {
    return null; // No mostrar nada si no hay publicaciones destacadas
  }

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Imagen de fondo con overlay y difuminado */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage1} 
          alt="Fondo destinos turísticos" 
          className="w-full h-full object-cover opacity-40 absolute inset-0"
        />
        <img 
          src={backgroundImage2} 
          alt="Fondo destinos turísticos" 
          className="w-full h-full object-cover opacity-40 absolute inset-0 animate-fade-cross"
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
            {visibleCards.map((publicacion, idx) => {
              const imageUrl = getFirstImageUrl(publicacion.imagenes);
              const categoryLabel = TIPO_LABELS[publicacion.tipo] || publicacion.tipo;
              const agencyName = publicacion.User?.empresaNombre || 'Agencia';
              
              return (
                <div
                  key={`${publicacion.id}-${currentIndex}-${idx}`}
                  className="animate-fade-in cursor-pointer"
                  onClick={() => handleCardClick(publicacion)}
                >
                  {/* Card */}
                  <div className="group relative h-[380px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                    {/* Imagen de fondo */}
                    <div className="absolute inset-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={publicacion.nombre}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                          <FaGlobeAmericas className="text-6xl text-white" />
                        </div>
                      )}
                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Contenido */}
                    <div className="relative h-full flex flex-col justify-between p-5">
                      {/* Nombre de la Agencia - Esquina superior derecha */}
                      <div className="flex justify-end">
                        <div className="bg-white rounded-lg shadow-lg px-3 py-2 transform transition-transform group-hover:scale-105">
                          <span className="text-xs font-semibold text-gray-700" title={agencyName}>
                            {agencyName}
                          </span>
                        </div>
                      </div>

                      {/* Información inferior */}
                      <div className="space-y-3">
                        {/* Título y destino */}
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-primary-light transition-colors">
                            {publicacion.nombre}
                          </h3>
                          {publicacion.destino && (
                            <div className="flex items-center text-white/90 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {publicacion.destino}
                            </div>
                          )}
                        </div>

                        {/* Precio destacado */}
                        {publicacion.precio && (
                          <div className="bg-primary/95 backdrop-blur-sm rounded-lg px-4 py-3 inline-block">
                            <div className="text-white/80 text-xs font-medium mb-0.5">
                              Desde
                            </div>
                            <div className="text-white text-2xl font-bold">
                              {formatPrice(parseFloat(publicacion.precio), 'ARS')}
                            </div>
                            <div className="text-white/70 text-xs mt-0.5">
                              por persona
                            </div>
                          </div>
                        )}

                        {/* Badge de categoría */}
                        <div className="flex gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            {categoryLabel}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green/90 backdrop-blur-sm text-white">
                            <FaStar className="mr-1" /> Destacado
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
              );
            })}
          </div>

          {/* Indicadores de progreso - Solo mostrar si hay más de 4 publicaciones */}
          {publicacionesDestacadas.length > 4 && (
            <div className="flex flex-col items-center gap-3 mt-8">
              {/* Contador de posición */}
              <div className="text-sm text-gray-600 font-medium">
                Mostrando {currentIndex + 1} - {Math.min(currentIndex + 4, publicacionesDestacadas.length)} de {publicacionesDestacadas.length} ofertas
              </div>
              
              {/* Indicadores de progreso - Máximo 12 puntos visibles */}
              <div className="flex justify-center gap-2">
                {Array.from({ 
                  length: Math.min(publicacionesDestacadas.length - 3, 12) 
                }).map((_, idx) => {
                  const isActive = idx === currentIndex;
                  const isNearActive = Math.abs(idx - currentIndex) <= 2;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-8 h-2 bg-primary'
                          : isNearActive
                          ? 'w-3 h-2 bg-gray-400 hover:bg-gray-500'
                          : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir a posición ${idx + 1}`}
                      title={`Ver desde publicación ${idx + 1}`}
                    />
                  );
                })}
                {publicacionesDestacadas.length > 15 && (
                  <span className="text-gray-400 text-xs self-center ml-1 font-medium">
                    +{publicacionesDestacadas.length - 15}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Controles opcionales - Solo mostrar si hay más de 4 publicaciones */}
          {publicacionesDestacadas.length > 4 && (
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setCurrentIndex((prev) => {
                  const maxIndex = Math.max(0, publicacionesDestacadas.length - 4);
                  return prev === 0 ? maxIndex : prev - 1;
                })}
                className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Anterior"
                title="Ver publicaciones anteriores"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => {
                  const maxIndex = Math.max(0, publicacionesDestacadas.length - 4);
                  return prev >= maxIndex ? 0 : prev + 1;
                })}
                className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Siguiente"
                title="Ver publicaciones siguientes"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* CTA Ver todas las ofertas */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/ofertas-destacadas')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Ver todas las ofertas destacadas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalle */}
      {showModal && selectedPublicacion && (
        <ServiceDetailModal
          item={selectedPublicacion}
          tipo={selectedPublicacion.tipo}
          onClose={() => {
            setShowModal(false);
            setSelectedPublicacion(null);
          }}
        />
      )}
    </section>
  );
}
