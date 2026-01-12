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
          <Link to="/paquetes">Paquetes</Link>
          <Link to="/alojamientos">Alojamiento</Link>
          <div className="nav-dropdown">
            <span className="dropdown-toggle">
              Traslados
            </span>
            <div className="dropdown-menu">
              <Link to="/autos">Autos</Link>
              <Link to="/pasajes">Pasajes</Link>
              <Link to="/transfers">Transfer</Link>
            </div>
          </div>
          <div className="nav-dropdown">
            <span className="dropdown-toggle">
              Actividades
            </span>
            <div className="dropdown-menu">
              <Link to="/circuitos">Circuitos</Link>
              <Link to="/excursiones">Excursiones</Link>
              <Link to="/salidas-grupales">Salidas grupales</Link>
            </div>
          </div>
          <Link to="/cruceros">Cruceros</Link>
          <Link to="/cupos">Cupos</Link>
          <Link to="/seguros">Seguros</Link>
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
