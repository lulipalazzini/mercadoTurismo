import React from "react";
import Hero from "./Hero";

export default function Home() {
  return (
    <>
      <Hero />

      <main>
        <section id="paquetes">
          <h2>Paquetes Destacados</h2>
          <p>
            Descubre experiencias cuidadosamente seleccionadas para ti. Cada
            destino cuenta una historia única que espera ser vivida.
          </p>
        </section>

        <section id="alojamiento">
          <h2>Alojamiento Premium</h2>
          <p>
            Hoteles excepcionales y alojamientos únicos donde cada detalle ha
            sido pensado para tu comodidad y disfrute.
          </p>
        </section>

        <section id="vuelos">
          <h2>Vuelos Inteligentes</h2>
          <p>
            Las mejores tarifas y combinaciones para que llegues a tu destino de
            la forma más cómoda y conveniente.
          </p>
        </section>

        <section id="ofertas">
          <h2>Ofertas Exclusivas</h2>
          <p>
            Oportunidades únicas y promociones especiales disponibles por tiempo
            limitado. No dejes pasar tu próxima aventura.
          </p>
        </section>

        <footer>
          <small>
            © {new Date().getFullYear()} MercadoTurismo — Creando experiencias
            inolvidables
          </small>
        </footer>
      </main>
    </>
  );
}
