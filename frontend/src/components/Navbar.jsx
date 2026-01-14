import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const isDropdownActive = (paths) =>
    paths.some((path) => location.pathname === path);

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
          <Link
            to="/paquetes"
            className={isActive("/paquetes") ? "active" : ""}
          >
            Paquetes
          </Link>
          <Link
            to="/alojamientos"
            className={isActive("/alojamientos") ? "active" : ""}
          >
            Alojamiento
          </Link>
          <div
            className={`nav-dropdown ${
              isDropdownActive(["/autos", "/pasajes", "/transfers"])
                ? "active"
                : ""
            }`}
          >
            <span className="dropdown-toggle">Traslados</span>
            <div className="dropdown-menu">
              <Link to="/autos" className={isActive("/autos") ? "active" : ""}>
                Autos
              </Link>
              <Link
                to="/pasajes"
                className={isActive("/pasajes") ? "active" : ""}
              >
                Pasajes
              </Link>
              <Link
                to="/transfers"
                className={isActive("/transfers") ? "active" : ""}
              >
                Transfer
              </Link>
            </div>
          </div>
          <div
            className={`nav-dropdown ${
              isDropdownActive([
                "/circuitos",
                "/excursiones",
                "/salidas-grupales",
              ])
                ? "active"
                : ""
            }`}
          >
            <span className="dropdown-toggle">Actividades</span>
            <div className="dropdown-menu">
              <Link
                to="/circuitos"
                className={isActive("/circuitos") ? "active" : ""}
              >
                Circuitos
              </Link>
              <Link
                to="/excursiones"
                className={isActive("/excursiones") ? "active" : ""}
              >
                Excursiones
              </Link>
              <Link
                to="/salidas-grupales"
                className={isActive("/salidas-grupales") ? "active" : ""}
              >
                Salidas grupales
              </Link>
            </div>
          </div>
          <Link
            to="/cruceros"
            className={isActive("/cruceros") ? "active" : ""}
          >
            Cruceros
          </Link>
          <Link to="/cupos" className={isActive("/cupos") ? "active" : ""}>
            Cupos
          </Link>
          <Link to="/seguros" className={isActive("/seguros") ? "active" : ""}>
            Seguros
          </Link>
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
