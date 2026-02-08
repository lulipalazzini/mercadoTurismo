import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api.config";
import { getFirstImageUrl } from "../utils/imageUtils";
import ServiceDetailModal from "../components/ServiceDetailModal";
import { 
  FaBox, 
  FaHotel, 
  FaCar, 
  FaShuttleVan, 
  FaShip, 
  FaMountain, 
  FaUsers, 
  FaMap, 
  FaTrain, 
  FaShieldAlt, 
  FaStar, 
  FaMapMarkerAlt 
} from "react-icons/fa";

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

const TIPO_ICONS = {
  paquete: FaBox,
  alojamiento: FaHotel,
  auto: FaCar,
  transfer: FaShuttleVan,
  crucero: FaShip,
  excursion: FaMountain,
  salidaGrupal: FaUsers,
  circuito: FaMap,
  tren: FaTrain,
  seguro: FaShieldAlt,
};

export default function PublicacionesDestacadasPage() {
  const navigate = useNavigate();
  const [publicacionesDestacadas, setPublicacionesDestacadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublicacion, setSelectedPublicacion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todos");

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

  const handleCardClick = (publicacion) => {
    setSelectedPublicacion(publicacion);
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  // Filtrar publicaciones por tipo
  const publicacionesFiltradas =
    filtroTipo === "todos"
      ? publicacionesDestacadas
      : publicacionesDestacadas.filter((pub) => pub.tipo === filtroTipo);

  // Obtener tipos únicos para el filtro
  const tiposDisponibles = [
    ...new Set(publicacionesDestacadas.map((pub) => pub.tipo)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando ofertas destacadas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (publicacionesDestacadas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ofertas Destacadas
            </h1>
            <p className="text-gray-600">
              No hay ofertas destacadas en este momento.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {/* Botón de volver */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm font-medium"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FaStar className="text-yellow-500" /> Ofertas Destacadas
              </h1>
              <p className="text-lg text-gray-600">
                {publicacionesDestacadas.length}{" "}
                {publicacionesDestacadas.length === 1
                  ? "oferta destacada"
                  : "ofertas destacadas"}{" "}
                disponibles
              </p>
            </div>

            {/* Filtro por tipo */}
            {tiposDisponibles.length > 1 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Filtrar:
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="todos">Todos los tipos</option>
                  {tiposDisponibles.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {TIPO_LABELS[tipo]}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Grid de publicaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publicacionesFiltradas.map((publicacion) => {
            const imageUrl = getFirstImageUrl(publicacion.imagenes);
            const categoryLabel = TIPO_LABELS[publicacion.tipo] || publicacion.tipo;
            const CategoryIcon = TIPO_ICONS[publicacion.tipo] || FaMapMarkerAlt;
            const agencyName = publicacion.User?.empresaNombre || "Agencia";

            return (
              <div
                key={`${publicacion.tipo}-${publicacion.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleCardClick(publicacion)}
              >
                {/* Imagen */}
                <div className="relative h-48 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={publicacion.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <CategoryIcon className="text-6xl text-white" />
                    </div>
                  )}

                  {/* Badge destacado */}
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <FaStar /> Destacado
                  </div>

                  {/* Agencia */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow-md">
                    <span className="text-xs font-semibold text-gray-700">
                      {agencyName}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  {/* Categoría */}
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon className="text-lg text-primary" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      {categoryLabel}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {publicacion.nombre}
                  </h3>

                  {/* Destino */}
                  {publicacion.destino && (
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {publicacion.destino}
                    </div>
                  )}

                  {/* Descripción */}
                  {publicacion.descripcion && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {publicacion.descripcion}
                    </p>
                  )}

                  {/* Precio */}
                  {publicacion.precio && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-gray-500">Desde</span>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(publicacion.precio)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensaje si no hay resultados filtrados */}
        {publicacionesFiltradas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No hay ofertas destacadas de este tipo.
            </p>
            <button
              onClick={() => setFiltroTipo("todos")}
              className="mt-4 text-primary hover:text-primary-dark font-semibold"
            >
              Ver todas las ofertas
            </button>
          </div>
        )}
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
    </div>
  );
}
