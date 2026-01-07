import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          MercadoTurismo
        </Link>

        <button
          className="nav-toggle"
          aria-controls="primary-navigation"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <span className="sr-only">Abrir menú</span>
          <div className={`hamburger ${open ? "open" : ""}`} />
        </button>

        <nav
          id="primary-navigation"
          className={`nav-links ${open ? "open" : ""}`}
        >
          <a href="#paquetes">Paquetes</a>
          <a href="#alojamiento">Alojamiento</a>
          <div className="nav-dropdown">
            <a href="#transporte" className="dropdown-toggle">
              Traslados
            </a>
            <div className="dropdown-menu">
              <a href="#autos">Autos</a>
              <a href="#pasajes">Pasajes</a>
              <a href="#transfer">Transfer</a>
            </div>
          </div>
          <div className="nav-dropdown">
            <a href="#actividades" className="dropdown-toggle">
              Actividades
            </a>
            <div className="dropdown-menu">
              <a href="#autos">Circuitos</a>
              <a href="#pasajes">Excursiones</a>
              <a href="#transfer">Salidas grupales</a>
            </div>
          </div>
          <a href="#cruceros">Cruceros</a>
          <a href="#cupos">Cupos</a>
          <a href="#seguros">Seguros</a>
          <a href="#ofertas" className="cta">
            Ofertas
          </a>
          <Link to="/login" className="btn-login">
            Ingresar
          </Link>
        </nav>
      </div>
    </header>
  );
}
