import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaChartBar,
  FaCalendarAlt,
  FaUsers,
  FaShoppingBag,
  FaMousePointer,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import { apiGet, apiPut } from "../../utils/apiFetch";
import UsuarioDetalleModal from "./UsuarioDetalleModal";
import AlertModal from "../common/AlertModal";
import ConfirmModal from "../common/ConfirmModal";
import "../../styles/admin.css";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Estados para modales
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "error",
    message: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/admin/usuarios");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setAlertConfig({
        type: "error",
        message: error.message || "Error al cargar usuarios",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadUsuarios();
      return;
    }

    try {
      setSearching(true);
      const data = await apiGet("/admin/usuarios/search", { q: searchTerm });
      setUsuarios(data);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setAlertConfig({
        type: "error",
        message: error.message || "Error en la búsqueda",
      });
      setShowAlert(true);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleViewDetail = (usuario) => {
    setSelectedUser(usuario);
    setShowDetailModal(true);
  };

  const handleActivar = async (usuario) => {
    if (usuario.role === "admin" || usuario.role === "sysadmin") {
      setAlertConfig({
        type: "info",
        message: "Los administradores siempre están activos",
      });
      setShowAlert(true);
      return;
    }

    setConfirmConfig({
      title: "Activar Usuario",
      message: `¿Confirmar activación de usuario?\n\nNombre: ${usuario.nombre}\nEmail: ${usuario.email}\n\nEl usuario podrá acceder a la plataforma.`,
      onConfirm: async () => {
        try {
          await apiPut(`/admin/usuarios/${usuario.id}/estado`, {
            activo: true,
          });
          setAlertConfig({
            type: "success",
            message: `Usuario activado: ${usuario.nombre}`,
          });
          setShowAlert(true);
          loadUsuarios();
        } catch (error) {
          console.error("Error al activar usuario:", error);
          setAlertConfig({
            type: "error",
            message: error.message || "Error al activar usuario",
          });
          setShowAlert(true);
        }
      },
    });
    setShowConfirm(true);
  };

  const handleDesactivar = async (usuario) => {
    if (usuario.role === "admin" || usuario.role === "sysadmin") {
      setAlertConfig({
        type: "error",
        message: "No se puede desactivar a un administrador del sistema",
      });
      setShowAlert(true);
      return;
    }

    setConfirmConfig({
      title: "⚠️ Desactivar Usuario",
      message: `¿Confirmar desactivación de usuario?\n\nNombre: ${usuario.nombre}\nEmail: ${usuario.email}\n\nEl usuario NO podrá acceder a la plataforma hasta que sea reactivado.`,
      danger: true,
      onConfirm: async () => {
        try {
          await apiPut(`/admin/usuarios/${usuario.id}/estado`, {
            activo: false,
          });
          setAlertConfig({
            type: "success",
            message: `Usuario desactivado: ${usuario.nombre}`,
          });
          setShowAlert(true);
          loadUsuarios();
        } catch (error) {
          console.error("Error al desactivar usuario:", error);
          setAlertConfig({
            type: "error",
            message: error.message || "Error al desactivar usuario",
          });
          setShowAlert(true);
        }
      },
    });
    setShowConfirm(true);
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { label: "Admin", color: "#c53030", bg: "#fee" },
      sysadmin: { label: "SysAdmin", color: "#c2185b", bg: "#fce4ec" },
      agencia: { label: "Agencia", color: "#0d47a1", bg: "#e3f2fd" },
      operador: { label: "Operador", color: "#2e7d32", bg: "#e8f5e9" },
    };
    const badge = badges[role] || { label: role, color: "#333", bg: "#eee" };
    return (
      <span
        style={{
          backgroundColor: badge.bg,
          color: badge.color,
          padding: "0.25rem 0.75rem",
          borderRadius: "12px",
          fontSize: "0.85rem",
          fontWeight: "500",
        }}
      >
        {badge.label}
      </span>
    );
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-AR");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>
            <FaUsers /> Gestión de Usuarios
          </h1>
          <p className="admin-subtitle">
            Administración completa de usuarios y estadísticas
          </p>
        </div>
      </div>

      {/* Buscador avanzado */}
      <div className="admin-search-box">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Buscar por nombre, empresa, email... (Ej: @agencia.com, turismo)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          className="btn-primary"
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? "Buscando..." : "Buscar"}
        </button>
        {searchTerm && (
          <button
            className="btn-secondary"
            onClick={() => {
              setSearchTerm("");
              loadUsuarios();
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Estadísticas generales */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e3f2fd" }}>
            <FaUsers style={{ color: "#1976d2" }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{usuarios.length}</div>
            <div className="stat-label">Total Usuarios</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e8f5e9" }}>
            <FaCheckCircle style={{ color: "#388e3c" }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {usuarios.filter((u) => u.activo !== false).length}
            </div>
            <div className="stat-label">Activos</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fff3e0" }}>
            <FaShoppingBag style={{ color: "#f57c00" }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {usuarios.reduce(
                (sum, u) => sum + (parseInt(u.totalPublicaciones) || 0),
                0,
              )}
            </div>
            <div className="stat-label">Total Publicaciones</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fce4ec" }}>
            <FaMousePointer style={{ color: "#c2185b" }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {usuarios.reduce(
                (sum, u) => sum + (parseInt(u.totalClicksRecibidos) || 0),
                0,
              )}
            </div>
            <div className="stat-label">Total Clicks</div>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Empresa</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Publicaciones</th>
              <th>Clicks</th>
              <th>Última Actividad</th>
              <th>Fecha Alta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  {searchTerm
                    ? "No se encontraron usuarios"
                    : "No hay usuarios registrados"}
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{usuario.nombre}</div>
                      <div className="user-email">{usuario.email}</div>
                    </div>
                  </td>
                  <td>{usuario.razonSocial || "-"}</td>
                  <td>{getRoleBadge(usuario.role)}</td>
                  <td>
                    {usuario.activo !== false ? (
                      <span className="status-badge status-active">
                        <FaCheckCircle /> Activo
                      </span>
                    ) : (
                      <span className="status-badge status-inactive">
                        <FaTimesCircle /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <span className="stat-badge">
                      {usuario.totalPublicaciones || 0}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="stat-badge">
                      {usuario.totalClicksRecibidos || 0}
                    </span>
                  </td>
                  <td className="text-muted">
                    {formatFecha(usuario.ultimaActividad)}
                  </td>
                  <td className="text-muted">
                    {formatFecha(usuario.createdAt)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn-icon btn-view"
                        onClick={() => handleViewDetail(usuario)}
                        title="Ver detalle completo"
                      >
                        <FaEye />
                      </button>
                      {usuario.activo !== false ? (
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDesactivar(usuario)}
                          title="Desactivar usuario"
                          disabled={
                            usuario.role === "admin" ||
                            usuario.role === "sysadmin"
                          }
                          style={{
                            opacity:
                              usuario.role === "admin" ||
                              usuario.role === "sysadmin"
                                ? 0.4
                                : 1,
                            cursor:
                              usuario.role === "admin" ||
                              usuario.role === "sysadmin"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <FaUserTimes />
                        </button>
                      ) : (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleActivar(usuario)}
                          title="Activar usuario"
                        >
                          <FaUserCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle */}
      {showDetailModal && selectedUser && (
        <UsuarioDetalleModal
          userId={selectedUser.id}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Modales de alerta y confirmación */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type={alertConfig.type}
        message={alertConfig.message}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={confirmConfig.title}
        message={confirmConfig.message}
        danger={confirmConfig.danger}
        onConfirm={confirmConfig.onConfirm}
      />
    </div>
  );
}
