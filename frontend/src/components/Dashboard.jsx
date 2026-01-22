import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaBullseye,
  FaUsers,
  FaHotel,
  FaDollarSign,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCar,
  FaRoute,
  FaShip,
  FaHiking,
  FaPlane,
  FaMapMarkedAlt,
  FaBus,
  FaStore,
} from "react-icons/fa";
import Reservas from "./dashboard/Reservas";
import Paquetes from "./dashboard/Paquetes";
import Clientes from "./dashboard/Clientes";
import Reportes from "./dashboard/Reportes";
import Facturacion from "./dashboard/Facturacion";
import Alojamientos from "./dashboard/Alojamientos";
import Autos from "./dashboard/Autos";
import Circuitos from "./dashboard/Circuitos";
import Cruceros from "./dashboard/Cruceros";
import Excursiones from "./dashboard/Excursiones";
import SalidasGrupales from "./dashboard/SalidasGrupales";
import Transfers from "./dashboard/Transfers";
import MercadoCupos from "./dashboard/MercadoCupos";
import Ajustes from "./dashboard/Ajustes";
import Usuarios from "./dashboard/Usuarios";
import "../styles/dashboard.css";

function DashboardContent() {
  const [activeSection, setActiveSection] = useState("reservas");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Obtener información del usuario del localStorage
  const user = JSON.parse(localStorage.getItem("currentUser")) || {
    nombre: "Usuario",
    email: "",
    role: "user",
  };

  // Determinar el nombre completo y rol a mostrar
  const getUserDisplayName = () => {
    return user.nombre || "Usuario";
  };

  const getUserRole = () => {
    const roles = {
      admin: "Administrador",
      sysadmin: "Super Administrador",
      agencia: "Agencia",
      operador: "Operador",
    };
    return roles[user.role] || "Operador";
  };

  const handleLogout = () => {
    // Limpiar el localStorage y sessionStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    sessionStorage.removeItem("adminVerified");
    navigate("/login");
  };

  const getSectionTitle = () => {
    const titles = {
      reservas: "Reservas",
      paquetes: "Paquetes",
      alojamientos: "Alojamientos",
      autos: "Autos",
      circuitos: "Circuitos",
      cruceros: "Cruceros",
      excursiones: "Excursiones",
      "salidas-grupales": "Salidas Grupales",
      transfers: "Transfers",
      "mercado-cupos": "Mercado de Cupos",
      clientes: "Clientes",
      reportes: "Reportes",
      facturacion: "Facturación",
      ajustes: "Ajustes",
      usuarios: "Usuarios",
    };
    return titles[activeSection] || "Dashboard";
  };

  const renderContent = () => {
    switch (activeSection) {
      case "reservas":
        return <Reservas />;
      case "paquetes":
        return <Paquetes />;
      case "alojamientos":
        return <Alojamientos />;
      case "autos":
        return <Autos />;
      case "circuitos":
        return <Circuitos />;
      case "cruceros":
        return <Cruceros />;
      case "excursiones":
        return <Excursiones />;
      case "salidas-grupales":
        return <SalidasGrupales />;
      case "transfers":
        return <Transfers />;
      case "mercado-cupos":
        return <MercadoCupos />;
      case "clientes":
        return <Clientes />;
      case "reportes":
        return <Reportes />;
      case "facturacion":
        return <Facturacion />;
      case "ajustes":
        return <Ajustes />;
      case "usuarios":
        return <Usuarios />;
      default:
        return <Reservas />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-full">MercadoTurismo</span>
            <span className="brand-short">MT</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>Principal</h3>
            <button
              className={`nav-item ${
                activeSection === "reservas" ? "active" : ""
              }`}
              onClick={() => setActiveSection("reservas")}
            >
              <span className="nav-icon">
                <FaClipboardList />
              </span>
              <span className="nav-label">Reservas</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "paquetes" ? "active" : ""
              }`}
              onClick={() => setActiveSection("paquetes")}
            >
              <span className="nav-icon">
                <FaBullseye />
              </span>
              <span className="nav-label">Paquetes</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "clientes" ? "active" : ""
              }`}
              onClick={() => setActiveSection("clientes")}
            >
              <span className="nav-icon">
                <FaUsers />
              </span>
              <span className="nav-label">Clientes</span>
            </button>
          </div>

          <div className="nav-section">
            <h3>Productos y Servicios</h3>
            <button
              className={`nav-item ${
                activeSection === "alojamientos" ? "active" : ""
              }`}
              onClick={() => setActiveSection("alojamientos")}
            >
              <span className="nav-icon">
                <FaHotel />
              </span>
              <span className="nav-label">Alojamientos</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "autos" ? "active" : ""
              }`}
              onClick={() => setActiveSection("autos")}
            >
              <span className="nav-icon">
                <FaCar />
              </span>
              <span className="nav-label">Autos</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "circuitos" ? "active" : ""
              }`}
              onClick={() => setActiveSection("circuitos")}
            >
              <span className="nav-icon">
                <FaRoute />
              </span>
              <span className="nav-label">Circuitos</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "cruceros" ? "active" : ""
              }`}
              onClick={() => setActiveSection("cruceros")}
            >
              <span className="nav-icon">
                <FaShip />
              </span>
              <span className="nav-label">Cruceros</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "excursiones" ? "active" : ""
              }`}
              onClick={() => setActiveSection("excursiones")}
            >
              <span className="nav-icon">
                <FaHiking />
              </span>
              <span className="nav-label">Excursiones</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "salidas-grupales" ? "active" : ""
              }`}
              onClick={() => setActiveSection("salidas-grupales")}
            >
              <span className="nav-icon">
                <FaMapMarkedAlt />
              </span>
              <span className="nav-label">Salidas Grupales</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "transfers" ? "active" : ""
              }`}
              onClick={() => setActiveSection("transfers")}
            >
              <span className="nav-icon">
                <FaBus />
              </span>
              <span className="nav-label">Transfers</span>
            </button>
          </div>

          <div className="nav-section">
            <h3>Mercado</h3>
            <button
              className={`nav-item ${
                activeSection === "mercado-cupos" ? "active" : ""
              }`}
              onClick={() => setActiveSection("mercado-cupos")}
            >
              <span className="nav-icon">
                <FaStore />
              </span>
              <span className="nav-label">Mercado de Cupos</span>
            </button>
          </div>

          <div className="nav-section">
            <h3>Gestión</h3>
            <button
              className={`nav-item ${
                activeSection === "facturacion" ? "active" : ""
              }`}
              onClick={() => setActiveSection("facturacion")}
            >
              <span className="nav-icon">
                <FaDollarSign />
              </span>
              <span className="nav-label">Facturación</span>
            </button>
            <button
              className={`nav-item ${
                activeSection === "reportes" ? "active" : ""
              }`}
              onClick={() => setActiveSection("reportes")}
            >
              <span className="nav-icon">
                <FaChartBar />
              </span>
              <span className="nav-label">Reportes</span>
            </button>
          </div>

          <div className="nav-section">
            <h3>Configuración</h3>
            {user.role === "admin" && (
              <button
                className={`nav-item ${
                  activeSection === "usuarios" ? "active" : ""
                }`}
                onClick={() => setActiveSection("usuarios")}
              >
                <span className="nav-icon">
                  <FaUsers />
                </span>
                <span className="nav-label">Usuarios</span>
              </button>
            )}
            <button
              className={`nav-item ${
                activeSection === "ajustes" ? "active" : ""
              }`}
              onClick={() => setActiveSection("ajustes")}
            >
              <span className="nav-icon">
                <FaCog />
              </span>
              <span className="nav-label">Ajustes</span>
            </button>
            <button className="nav-item" onClick={handleLogout}>
              <span className="nav-icon">
                <FaSignOutAlt />
              </span>
              <span className="nav-label">Salir</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars />
            </button>
            <h1>{getSectionTitle()}</h1>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <div className="user-avatar">
                {user?.fotoPerfil ? (
                  <img
                    src={user.fotoPerfil}
                    alt="Foto de perfil"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  getUserDisplayName().substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{getUserDisplayName()}</span>
                <span className="user-role">{getUserRole()}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">{renderContent()}</div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
