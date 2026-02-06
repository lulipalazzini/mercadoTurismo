import React, { useState, useEffect, useCallback } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaPhone,
  FaCalendarAlt,
  FaShoppingBag,
  FaMousePointer,
  FaChartBar,
  FaHistory,
  FaUsers,
} from "react-icons/fa";
import { apiGet } from "../../utils/apiFetch";
import AlertModal from "../common/AlertModal";
import "../../styles/admin.css";

export default function UsuarioDetalleModal({ userId, onClose }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const loadDetalle = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet(`/admin/usuarios/${userId}`);
      setDetalle(data);
    } catch (error) {
      console.error("Error al cargar detalle:", error);
      setAlertMessage(
        error.message || "Error al cargar el detalle del usuario",
      );
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDetalle();
  }, [loadDetalle]);

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString("es-AR");
  };

  const formatFechaCorta = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-AR");
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
          padding: "0.35rem 1rem",
          borderRadius: "16px",
          fontSize: "0.9rem",
          fontWeight: "600",
        }}
      >
        {badge.label}
      </span>
    );
  };

  const getAccionBadge = (accion) => {
    const badges = {
      create: { label: "Crear", color: "#2e7d32", bg: "#e8f5e9" },
      update: { label: "Editar", color: "#ed6c02", bg: "#fff3e0" },
      delete: { label: "Eliminar", color: "#d32f2f", bg: "#ffebee" },
      login: { label: "Login", color: "#0288d1", bg: "#e1f5fe" },
      logout: { label: "Logout", color: "#616161", bg: "#f5f5f5" },
    };
    const badge = badges[accion] || {
      label: accion,
      color: "#333",
      bg: "#eee",
    };
    return (
      <span
        style={{
          backgroundColor: badge.bg,
          color: badge.color,
          padding: "0.2rem 0.6rem",
          borderRadius: "8px",
          fontSize: "0.75rem",
          fontWeight: "500",
        }}
      >
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content modal-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Cargando detalle...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!detalle) {
    return null;
  }

  const { usuario, publicaciones, clientes, clicks, actividad } = detalle;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "1200px", maxHeight: "90vh", overflow: "auto" }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>
              <FaUser /> Detalle de Usuario
            </h2>
            <p
              style={{
                margin: "0.5rem 0 0",
                color: "#666",
                fontSize: "0.9rem",
              }}
            >
              Información completa y estadísticas de actividad
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <button
            className={activeTab === "general" ? "tab-active" : ""}
            onClick={() => setActiveTab("general")}
          >
            <FaUser /> General
          </button>
          <button
            className={activeTab === "publicaciones" ? "tab-active" : ""}
            onClick={() => setActiveTab("publicaciones")}
          >
            <FaShoppingBag /> Publicaciones
          </button>
          <button
            className={activeTab === "clicks" ? "tab-active" : ""}
            onClick={() => setActiveTab("clicks")}
          >
            <FaMousePointer /> Clicks
          </button>
          <button
            className={activeTab === "actividad" ? "tab-active" : ""}
            onClick={() => setActiveTab("actividad")}
          >
            <FaHistory /> Actividad
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {activeTab === "general" && (
            <div className="detail-section">
              {/* Datos personales */}
              <div className="detail-card">
                <h3>
                  <FaUser /> Datos Personales
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Nombre:</label>
                    <span>{usuario.nombre}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{usuario.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Teléfono:</label>
                    <span>{usuario.telefono || "-"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Empresa:</label>
                    <span>{usuario.razonSocial || "-"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Rol:</label>
                    <span>{getRoleBadge(usuario.role)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Estado:</label>
                    <span>
                      {usuario.activo !== false ? (
                        <span style={{ color: "#2e7d32", fontWeight: "600" }}>
                          ✓ Activo
                        </span>
                      ) : (
                        <span style={{ color: "#d32f2f", fontWeight: "600" }}>
                          ✗ Inactivo
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="detail-card">
                <h3>
                  <FaCalendarAlt /> Fechas
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Fecha de Alta:</label>
                    <span>{formatFecha(usuario.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Última Modificación:</label>
                    <span>{formatFecha(usuario.updatedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Última Actividad:</label>
                    <span>
                      {actividad.reciente.length > 0
                        ? formatFecha(actividad.reciente[0].createdAt)
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumen de actividad */}
              <div className="detail-card">
                <h3>
                  <FaChartBar /> Resumen de Actividad
                </h3>
                <div className="stats-grid-2">
                  <div className="stat-box">
                    <div
                      className="stat-icon-lg"
                      style={{ backgroundColor: "#fff3e0" }}
                    >
                      <FaShoppingBag style={{ color: "#f57c00" }} />
                    </div>
                    <div className="stat-value-lg">{publicaciones.total}</div>
                    <div className="stat-label-lg">Publicaciones Totales</div>
                  </div>
                  <div className="stat-box">
                    <div
                      className="stat-icon-lg"
                      style={{ backgroundColor: "#fce4ec" }}
                    >
                      <FaMousePointer style={{ color: "#c2185b" }} />
                    </div>
                    <div className="stat-value-lg">{clicks.total}</div>
                    <div className="stat-label-lg">Clicks Recibidos</div>
                  </div>
                  <div className="stat-box">
                    <div
                      className="stat-icon-lg"
                      style={{ backgroundColor: "#e1f5fe" }}
                    >
                      <FaUsers style={{ color: "#0288d1" }} />
                    </div>
                    <div className="stat-value-lg">{clientes}</div>
                    <div className="stat-label-lg">Clientes</div>
                  </div>
                  <div className="stat-box">
                    <div
                      className="stat-icon-lg"
                      style={{ backgroundColor: "#f3e5f5" }}
                    >
                      <FaHistory style={{ color: "#7b1fa2" }} />
                    </div>
                    <div className="stat-value-lg">
                      {actividad.reciente.length}
                    </div>
                    <div className="stat-label-lg">Actividades Recientes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "publicaciones" && (
            <div className="detail-section">
              <div className="detail-card">
                <h3>Publicaciones por Módulo</h3>
                <div className="stats-list">
                  <div className="stats-list-item">
                    <span>Paquetes:</span>
                    <strong>{publicaciones.paquetes}</strong>
                  </div>
                  <div className="stats-list-item">
                    <span>Alojamientos:</span>
                    <strong>{publicaciones.alojamientos}</strong>
                  </div>
                  <div className="stats-list-item">
                    <span>Autos:</span>
                    <strong>{publicaciones.autos}</strong>
                  </div>
                  <div className="stats-list-item">
                    <span>Transfers:</span>
                    <strong>{publicaciones.transfers}</strong>
                  </div>
                  <div className="stats-list-item">
                    <span>Cruceros:</span>
                    <strong>{publicaciones.cruceros}</strong>
                  </div>
                  <div className="stats-list-item">
                    <span>Excursiones:</span>
                    <strong>{publicaciones.excursiones}</strong>
                  </div>
                  <div className="stats-list-item">
                    <span>Salidas Grupales:</span>
                    <strong>{publicaciones.salidasGrupales}</strong>
                  </div>
                  <div className="stats-list-item">
                    <span>Circuitos:</span>
                    <strong>{publicaciones.circuitos}</strong>
                  </div>
                  <div className="stats-list-item">
                    <span>Cupos Mercado:</span>
                    <strong>{publicaciones.cuposMercado}</strong>
                  </div>
                  <div className="stats-list-item total">
                    <span>
                      <strong>Total:</strong>
                    </span>
                    <strong>{publicaciones.total}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clicks" && (
            <div className="detail-section">
              {/* Clicks por módulo */}
              <div className="detail-card">
                <h3>Clicks por Módulo</h3>
                {clicks.porModulo.length > 0 ? (
                  <div className="stats-list">
                    {clicks.porModulo.map((item, index) => (
                      <div key={index} className="stats-list-item">
                        <span style={{ textTransform: "capitalize" }}>
                          {item.modulo}:
                        </span>
                        <strong>{item.total}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No hay clicks registrados</p>
                )}
              </div>

              {/* Top publicaciones */}
              <div className="detail-card">
                <h3>Top Publicaciones (más clickeadas)</h3>
                {clicks.porPublicacion.length > 0 ? (
                  <div className="table-container">
                    <table className="detail-table">
                      <thead>
                        <tr>
                          <th>Módulo</th>
                          <th>Publicación</th>
                          <th className="text-center">Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clicks.porPublicacion.map((item, index) => (
                          <tr key={index}>
                            <td style={{ textTransform: "capitalize" }}>
                              {item.modulo}
                            </td>
                            <td>
                              {item.publicacionTitulo ||
                                `ID: ${item.publicacionId}`}
                            </td>
                            <td className="text-center">
                              <span className="stat-badge-lg">
                                {item.clicks}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No hay clicks registrados</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "actividad" && (
            <div className="detail-section">
              {/* Estadísticas de actividad */}
              <div className="detail-card">
                <h3>Estadísticas por Módulo y Acción</h3>
                {actividad.estadisticas.length > 0 ? (
                  <div className="table-container">
                    <table className="detail-table">
                      <thead>
                        <tr>
                          <th>Módulo</th>
                          <th>Acción</th>
                          <th className="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {actividad.estadisticas.map((item, index) => (
                          <tr key={index}>
                            <td style={{ textTransform: "capitalize" }}>
                              {item.modulo}
                            </td>
                            <td>{getAccionBadge(item.accion)}</td>
                            <td className="text-center">
                              <span className="stat-badge-lg">
                                {item.total}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No hay actividad registrada</p>
                )}
              </div>

              {/* Actividad reciente */}
              <div className="detail-card">
                <h3>Actividad Reciente (últimas 20)</h3>
                {actividad.reciente.length > 0 ? (
                  <div className="activity-timeline">
                    {actividad.reciente.map((item, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-time">
                          {formatFechaCorta(item.createdAt)}
                        </div>
                        <div className="activity-content">
                          <div className="activity-header">
                            {getAccionBadge(item.accion)}
                            <span className="activity-module">
                              {item.modulo}
                            </span>
                          </div>
                          <div className="activity-description">
                            {item.descripcion || "-"}
                          </div>
                          {item.entidadTitulo && (
                            <div className="activity-entity">
                              {item.entidadTitulo}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No hay actividad reciente</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de alerta */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type="error"
        message={alertMessage}
      />
    </div>
  );
}
