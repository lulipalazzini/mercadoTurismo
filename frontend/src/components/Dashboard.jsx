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
  FaMedkit,
  FaBook,
  FaFileInvoice,
  FaTrain,
  FaShieldAlt,
  FaStar,
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
import Trenes from "./dashboard/Trenes";
import Seguros from "./dashboard/Seguros";
import MercadoCupos from "./dashboard/MercadoCupos";
import ReservasAnotador from "./dashboard/ReservasAnotador";
import FacturacionAnotador from "./dashboard/FacturacionAnotador";
import Ajustes from "./dashboard/Ajustes";
import Usuarios from "./dashboard/Usuarios";
import UsuariosAdmin from "./dashboard/UsuariosAdmin";
import ReportesAdmin from "./dashboard/ReportesAdmin";
import PublicacionesDestacadas from "./dashboard/PublicacionesDestacadas";
import {
  getUserRole,
  getRoleDisplayName,
  getRoleBadge,
  canAccessModule,
  getModulesBySection,
  isB2BUser,
  isVisibleToPassengers,
} from "../utils/rolePermissions";
import "../styles/dashboard.css";

function DashboardContent() {
  const navigate = useNavigate();

  // Obtener información del usuario del localStorage
  const user = JSON.parse(localStorage.getItem("currentUser")) || {
    nombre: "Usuario",
    email: "",
    role: "user",
  };

  // Obtener rol calculado del usuario
  const userRole = getUserRole(user);
  const userRoleDisplay = getRoleDisplayName(user);
  const userRoleBadge = getRoleBadge(user);

  // Obtener módulos visibles según el rol
  const modulesBySection = getModulesBySection(user);
  const allVisibleModules = Object.values(modulesBySection).flat();

  // Determinar sección activa inicial (primera visible para el usuario)
  const [activeSection, setActiveSection] = useState(
    allVisibleModules.length > 0 ? allVisibleModules[0].id : "ajustes",
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Validar que el usuario tenga un rol válido
  const validRoles = ["admin", "sysadmin", "agencia", "operador", "user"];
  if (!validRoles.includes(userRole)) {
    console.error("Rol de usuario inválido:", userRole);
    // Redirigir al login si el rol no es válido
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
    return null;
  }

  // Determinar el nombre completo y rol a mostrar
  const getUserDisplayName = () => {
    return user.nombre || "Usuario";
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
      trenes: "Trenes",
      seguros: "Seguros",
      "mercado-cupos": "Mercado de Cupos",
      "reservas-anotador": "Reservas (Anotador)",
      "facturacion-anotador": "Facturación (Anotador)",
      clientes: "Clientes",
      reportes: "Reportes",
      "publicaciones-destacadas": "Publicaciones Destacadas",
      facturacion: "Facturación",
      ajustes: "Ajustes",
      usuarios: "Usuarios",
    };
    return titles[activeSection] || "Dashboard";
  };

  // Mapeo de iconos por nombre de icono (string)
  const iconMap = {
    FaClipboardList: <FaClipboardList />,
    FaBullseye: <FaBullseye />,
    FaUsers: <FaUsers />,
    FaHotel: <FaHotel />,
    FaCar: <FaCar />,
    FaRoute: <FaRoute />,
    FaShip: <FaShip />,
    FaHiking: <FaHiking />,
    FaMapMarkedAlt: <FaMapMarkedAlt />,
    FaBus: <FaBus />,
    FaStore: <FaStore />,
    FaMedkit: <FaMedkit />,
    FaBook: <FaBook />,
    FaFileInvoice: <FaFileInvoice />,
    FaTrain: <FaTrain />,
    FaShieldAlt: <FaShieldAlt />,
    FaDollarSign: <FaDollarSign />,
    FaChartBar: <FaChartBar />,
    FaStar: <FaStar />,
    FaCog: <FaCog />,
  };

  const renderContent = () => {
    // Verificar que el usuario tenga acceso al módulo actual
    if (!canAccessModule(user, activeSection)) {
      return (
        <div className="access-denied">
          <h2>⚠️ Acceso Denegado</h2>
          <p>No tienes permisos para acceder a este módulo.</p>
        </div>
      );
    }

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
      case "trenes":
        return <Trenes />;
      case "seguros":
        return <Seguros />;
      case "mercado-cupos":
        return <MercadoCupos />;
      case "reservas-anotador":
        return <ReservasAnotador />;
      case "facturacion-anotador":
        return <FacturacionAnotador />;
      case "clientes":
        return <Clientes />;
      case "reportes":
        // Admin ve reportes avanzados, otros ven reportes básicos
        return userRole === "admin" || userRole === "sysadmin" ? (
          <ReportesAdmin />
        ) : (
          <Reportes />
        );
      case "publicaciones-destacadas":
        return <PublicacionesDestacadas />;
      case "facturacion":
        return <Facturacion />;
      case "ajustes":
        return <Ajustes />;
      case "usuarios":
        // Admin ve gestión completa de usuarios
        return userRole === "admin" || userRole === "sysadmin" ? (
          <UsuariosAdmin />
        ) : (
          <Usuarios />
        );
      default:
        return allVisibleModules.length > 0 ? (
          <Reservas />
        ) : (
          <div className="no-modules">
            <p>No hay módulos disponibles para tu perfil.</p>
          </div>
        );
    }
  };

  // Renderizar secciones de navegación dinámicamente
  const renderNavSection = (sectionName, modules) => {
    if (modules.length === 0) return null;

    const sectionTitles = {
      principal: "Principal",
      productos: "Productos y Servicios",
      mercado: "Mercado",
      anotadores: "Anotadores Internos",
      gestion: "Gestión",
      configuracion: "Configuración",
    };

    return (
      <div className="nav-section" key={sectionName}>
        <h3>{sectionTitles[sectionName] || sectionName}</h3>
        {modules.map((module) => (
          <button
            key={module.id}
            className={`nav-item ${activeSection === module.id ? "active" : ""}`}
            onClick={() => setActiveSection(module.id)}
          >
            <span className="nav-icon">{iconMap[module.icon]}</span>
            <span className="nav-label">{module.title}</span>
          </button>
        ))}
      </div>
    );
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
          {/* Renderizar secciones dinámicamente según rol */}
          {Object.entries(modulesBySection).map(([sectionName, modules]) =>
            renderNavSection(sectionName, modules),
          )}

          {/* Botón de Logout siempre visible */}
          <div className="nav-section">
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
                <span className="user-role">{userRoleDisplay}</span>
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
