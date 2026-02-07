import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/navbar.css";
import logo from "../assets/logo/MT_marca_01.webp";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const isActive = (path) => location.pathname === path;

  const isDropdownActive = (paths) =>
    paths.some((path) => location.pathname === path);

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <img src={logo} alt="Mercado Turismo" style={{ height: "40px" }} />
        </Link>

        {/* Barra de búsqueda inline - Solo visible en home */}
        {isHomePage && (
          <div className="navbar-search">
            <SearchBar compact={true} />
          </div>
        )}

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
              isDropdownActive(["/autos", "/transfers", "/trenes"])
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
                to="/transfers"
                className={isActive("/transfers") ? "active" : ""}
              >
                Transfer
              </Link>
              <Link
                to="/trenes"
                className={isActive("/trenes") ? "active" : ""}
              >
                Trenes
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
          <Link to="/seguros" className={isActive("/seguros") ? "active" : ""}>
            Seguros
          </Link>
          <Link to="/login" className="btn-login">
            Ingresar
          </Link>
        </nav>
      </div>
    </header>
  );
}
