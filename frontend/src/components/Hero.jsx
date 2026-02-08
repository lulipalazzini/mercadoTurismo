import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "../styles/hero.css";
import "../styles/featuredServices.css";
import heroImage from "../assets/img/paisaje_01.png";
import heroImage2 from "../assets/img/paisaje_02.png";
import PublicacionDestacadaCard from "./common/PublicacionDestacadaCard";
import UnifiedHeroSearch from "./UnifiedHeroSearch";
import { API_URL } from "../config/api.config";

export default function Hero() {
  // Estados para publicaciones destacadas
  const [publicacionesDestacadas, setPublicacionesDestacadas] = useState([]);
  const [loadingDestacadas, setLoadingDestacadas] = useState(true);

  // Cargar publicaciones destacadas
  useEffect(() => {
    const loadPublicacionesDestacadas = async () => {
      try {
        setLoadingDestacadas(true);

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
        setLoadingDestacadas(false);
      }
    };

    loadPublicacionesDestacadas();
  }, []);

  return (
    <>
      {/* Primera sección del hero con searchbox */}
      <section className="hero hero-section-1" id="hero">
        <img className="hero-image" src={heroImage} alt="Paisaje turístico" />

        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content">
          <h1>Compará ofertas de agencias de viajes</h1>
          <p className="lead">Un solo lugar, múltiples agencias. Vos elegís.</p>

          {/* Búsqueda Unificada */}
          <UnifiedHeroSearch />
        </div>
      </section>

      {/* Segunda sección del hero con servicios destacados */}
      <section className="hero hero-section-2">
        <img className="hero-image" src={heroImage2} alt="Destinos naturales" />

        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content">
          {/* Publicaciones Destacadas - Solo mostrar si hay datos */}
          {!loadingDestacadas && publicacionesDestacadas.length > 0 && (
            <div className="featured-services">
              <div className="featured-services-header">
                <h2 className="featured-services-title">
                  <FaStar className="inline-block mr-2 text-yellow-500" /> Ofertas Destacadas
                </h2>
                <p className="featured-services-subtitle">
                  Descubrí las mejores ofertas seleccionadas por nuestro equipo
                </p>
              </div>
              <div className="featured-services-grid">
                {publicacionesDestacadas.map((publicacion, index) => (
                  <PublicacionDestacadaCard
                    key={`${publicacion.tipo}-${publicacion.id}-${index}`}
                    publicacion={publicacion}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
