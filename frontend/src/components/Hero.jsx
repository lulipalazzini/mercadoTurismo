import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import "../styles/featuredServices.css";
import heroImage from "../assets/img/paisaje_01.png";
import heroImage2 from "../assets/img/paisaje_02.png";
import FeaturedServiceCard from "./common/FeaturedServiceCard";import UnifiedHeroSearch from "./UnifiedHeroSearch";import { getTopServices } from "../services/stats.service";
import api from "../services/api";

export default function Hero() {
  // Estados para servicios destacados
  const [featuredServices, setFeaturedServices] = useState([]);
  const [servicesDetails, setServicesDetails] = useState({});
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Cargar servicios destacados
  useEffect(() => {
    const loadFeaturedServices = async () => {
      try {
        setLoadingFeatured(true);
        const topServices = await getTopServices(5);

        // Si no hay servicios con clicks, no mostrar nada
        if (!topServices || topServices.length === 0) {
          setFeaturedServices([]);
          setLoadingFeatured(false);
          return;
        }

        setFeaturedServices(topServices);

        // Cargar detalles de cada servicio
        const details = {};
        const categoryEndpoints = {
          alojamiento: "alojamientos",
          auto: "autos",
          circuito: "circuitos",
          crucero: "cruceros",
          excursion: "excursiones",
          paquete: "paquetes",
          pasaje: "pasajes",
          salidaGrupal: "salidas-grupales",
          seguro: "seguros",
          transfer: "transfers",
        };

        await Promise.all(
          topServices.map(async (service) => {
            try {
              const endpoint = categoryEndpoints[service.category];
              if (endpoint && service.serviceId) {
                const response = await api.get(
                  `/${endpoint}/${service.serviceId}`,
                );
                const data = await response.json();
                details[`${service.category}-${service.serviceId}`] = data;
              }
            } catch (error) {
              console.error(
                `Error loading details for ${service.category}-${service.serviceId}:`,
                error,
              );
            }
          }),
        );

        setServicesDetails(details);
      } catch (error) {
        console.error("Error loading featured services:", error);
        setFeaturedServices([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    loadFeaturedServices();
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
          {/* Servicios Destacados - Solo mostrar si hay datos */}
          {!loadingFeatured && featuredServices.length > 0 && (
            <div className="featured-services">
              <div className="featured-services-header">
                <h2 className="featured-services-title">
                  Más buscados por viajeros
                </h2>
                <p className="featured-services-subtitle">
                  Descubrí las ofertas más populares de nuestras agencias
                </p>
              </div>
              <div className="featured-services-grid">
                {featuredServices.map((service, index) => (
                  <FeaturedServiceCard
                    key={`${service.category}-${service.serviceId}-${index}`}
                    service={service}
                    detailData={
                      servicesDetails[
                        `${service.category}-${service.serviceId}`
                      ]
                    }
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
