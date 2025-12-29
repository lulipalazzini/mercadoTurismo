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
} from "react-icons/fa";
import Reservas from "./dashboard/Reservas";
import Paquetes from "./dashboard/Paquetes";
import Clientes from "./dashboard/Clientes";
import Reportes from "./dashboard/Reportes";
import Facturacion from "./dashboard/Facturacion";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("reservas");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí irá la lógica de logout
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "reservas":
        return <Reservas />;
      case "paquetes":
        return <Paquetes />;
      case "clientes":
        return <Clientes />;
      case "reportes":
        return <Reportes />;
      case "facturacion":
        return <Facturacion />;
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
            <h2>
              <FaHome className="brand-icon" /> MercadoTurismo
            </h2>
            <span className="sidebar-subtitle">Panel Mayorista</span>
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
            <button className="nav-item">
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
            <h1>
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <div className="user-avatar">OP</div>
              <span className="user-name">Operador</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">{renderContent()}</div>
      </main>
    </div>
  );
}
