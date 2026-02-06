import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Columna 1: Sobre nosotros */}
          <div className="footer-column">
            <h3 className="footer-title">Mercado Turismo</h3>
            <p className="footer-description">
              Tu marketplace de confianza para comparar servicios de múltiples
              agencias de viajes. Encontrá el mejor precio y las mejores
              experiencias en un solo lugar.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="footer-column">
            <h4 className="footer-column-title">Servicios</h4>
            <ul className="footer-links">
              <li>
                <Link to="/paquetes">Paquetes Turísticos</Link>
              </li>
              <li>
                <Link to="/alojamientos">Alojamientos</Link>
              </li>
              <li>
                <Link to="/autos">Alquiler de Autos</Link>
              </li>
              <li>
                <Link to="/transfers">Transfers</Link>
              </li>
              <li>
                <Link to="/cruceros">Cruceros</Link>
              </li>
              <li>
                <Link to="/seguros">Seguros de Viaje</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Experiencias */}
          <div className="footer-column">
            <h4 className="footer-column-title">Experiencias</h4>
            <ul className="footer-links">
              <li>
                <Link to="/circuitos">Circuitos</Link>
              </li>
              <li>
                <Link to="/excursiones">Excursiones</Link>
              </li>
              <li>
                <Link to="/salidas-grupales">Salidas Grupales</Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Ayuda */}
          <div className="footer-column">
            <h4 className="footer-column-title">Ayuda</h4>
            <ul className="footer-links">
              <li>
                <a href="#faq">Preguntas Frecuentes</a>
              </li>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
              <li>
                <a href="#terminos">Términos y Condiciones</a>
              </li>
              <li>
                <a href="#privacidad">Política de Privacidad</a>
              </li>
              <li>
                <Link to="/login">Área de Agencias</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Mercado Turismo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
