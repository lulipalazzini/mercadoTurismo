import React from "react";
import HeroMarketplace from "./HeroMarketplace";
import FeaturedCarousel from "./FeaturedCarousel";

/**
 * Home principal para Mercado Turismo - Marketplace de agencias de viaje
 * 
 * Componentes principales:
 * - HeroMarketplace: Hero con buscador y disclaimer de marketplace
 * - FeaturedCarousel: Carrusel de ofertas destacadas con rotación automática
 */
export default function HomeMarketplace() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Above the fold */}
      <HeroMarketplace />
      
      {/* Featured Carousel - Visible sin scroll */}
      <FeaturedCarousel />
      
      {/* Aquí se pueden agregar más secciones: 
          - Cómo funciona
          - Testimonios
          - Categorías populares
          - etc.
      */}
    </main>
  );
}
