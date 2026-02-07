import React, { useState, useEffect } from "react";
import {
  FaChartBar,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaMousePointer,
  FaHistory,
  FaUsers,
  FaFileExcel,
  FaFileCsv,
} from "react-icons/fa";
import { apiGet } from "../../utils/apiFetch";
import AlertModal from "../common/AlertModal";
import "../../styles/admin.css";

export default function ReportesAdmin() {
  const [tipoReporte, setTipoReporte] = useState("usuarios");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const data = await apiGet("/admin/usuarios");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);

      let endpoint = "";
      const params = {};

      if (fechaInicio) params.fechaInicio = fechaInicio;
      if (fechaFin) params.fechaFin = fechaFin;
      if (usuarioSeleccionado) params.userId = usuarioSeleccionado;

      switch (tipoReporte) {
        case "usuarios":
          endpoint = "/admin/reportes/usuarios";
          break;
        case "clientes":
          endpoint = "/admin/reportes/clientes";
          break;
        case "clicks":
          endpoint = "/admin/reportes/clicks";
          break;
        case "actividad":
          endpoint = "/admin/reportes/actividad";
          break;
        default:
          return;
      }

      const data = await apiGet(endpoint, params);
      setReporte(data);
    } catch (error) {
      console.error("Error al generar reporte:", error);
      setAlertMessage(error.message || "Error al generar el reporte");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reporte) return;

    let csvContent = "";
    let filename = "";

    switch (tipoReporte) {
      case "usuarios":
        filename = "reporte_usuarios.csv";
        csvContent = convertUsuariosToCSV(reporte);
        break;
      case "clientes":
        filename = "reporte_clientes.csv";
        csvContent = convertClientesToCSV(reporte);
        break;
      case "clicks":
        filename = "reporte_clicks.csv";
        csvContent = convertClicksToCSV(reporte);
        break;
      case "actividad":
        filename = "reporte_actividad.csv";
        csvContent = convertActividadToCSV(reporte);
        break;
      default:
        return;
    }

    downloadCSV(csvContent, filename);
  };

  const convertUsuariosToCSV = (data) => {
    let csv = "ID,Nombre,Email,Empresa,Rol,Total Publicaciones,Total Clicks\n";
    data.usuarios.forEach((u) => {
      csv += `${u.id},"${u.nombre}","${u.email}","${u.razonSocial || ""}","${u.role}",${u.totalPublicaciones || 0},${u.totalClicksRecibidos || 0}\n`;
    });
    return csv;
  };

  const convertClientesToCSV = (data) => {
    let csv =
      "ID Cliente,Nombre,Email,Usuario Propietario,Empresa,Fecha Alta\n";
    data.clientes.forEach((c) => {
      csv += `${c.id},"${c.nombre}","${c.email || ""}","${c.usuario?.nombre || ""}","${c.usuario?.razonSocial || ""}","${new Date(c.createdAt).toLocaleDateString()}"\n`;
    });
    return csv;
  };

  const convertClicksToCSV = (data) => {
    let csv = "Módulo,Publicación ID,Título,Propietario,Empresa,Clicks\n";
    data.resumen.clicksPorPublicacion.forEach((c) => {
      csv += `"${c.modulo}",${c.publicacionId},"${c.publicacionTitulo || ""}","${c.propietarioId}","${c.propietarioEmpresa || ""}",${c.clicks}\n`;
    });
    return csv;
  };

  const convertActividadToCSV = (data) => {
    let csv = "Fecha,Usuario,Módulo,Acción,Entidad,Descripción\n";
    data.actividad.forEach((a) => {
      const fecha = new Date(a.createdAt).toLocaleString();
      csv += `"${fecha}","${a.userName || ""}","${a.modulo}","${a.accion}","${a.entidadTitulo || ""}","${a.descripcion || ""}"\n`;
    });
    return csv;
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob(["\uFEFF" + content], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-AR");
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>
            <FaChartBar /> Reportes y Auditoría
          </h1>
          <p className="admin-subtitle">
            Genera reportes detallados con filtros personalizados
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="admin-filters-card">
        <h3>
          <FaFilter /> Configuración del Reporte
        </h3>

        <div className="filters-grid">
          {/* Tipo de reporte */}
          <div className="filter-item">
            <label>Tipo de Reporte:</label>
            <select
              value={tipoReporte}
              onChange={(e) => {
                setTipoReporte(e.target.value);
                setReporte(null);
              }}
              className="filter-select"
            >
              <option value="usuarios">Reportes por Usuarios</option>
              <option value="clientes">Reportes por Clientes</option>
              <option value="clicks">Reportes de Clicks</option>
              <option value="actividad">Reportes de Actividad</option>
            </select>
          </div>

          {/* Usuario específico */}
          <div className="filter-item">
            <label>Usuario Específico (opcional):</label>
            <select
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los usuarios</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} - {u.razonSocial || u.email}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha inicio */}
          <div className="filter-item">
            <label>
              <FaCalendarAlt /> Fecha Inicio:
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Fecha fin */}
          <div className="filter-item">
            <label>
              <FaCalendarAlt /> Fecha Fin:
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filters-actions">
          <button
            className="btn-primary"
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? "Generando..." : "Generar Reporte"}
          </button>
          {reporte && (
            <>
              <button className="btn-success" onClick={exportToCSV}>
                <FaFileCsv /> Exportar CSV
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setReporte(null);
                  setFechaInicio("");
                  setFechaFin("");
                  setUsuarioSeleccionado("");
                }}
              >
                Limpiar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Resultados */}
      {loading && (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Generando reporte...</p>
        </div>
      )}

      {reporte && !loading && (
        <div className="report-results">
          {/* Reporte de Usuarios */}
          {tipoReporte === "usuarios" && (
            <>
              <div className="report-summary">
                <h3>Resumen</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-label">Total Usuarios</div>
                    <div className="summary-value">
                      {reporte.resumen.totalUsuarios}
                    </div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-label">Total Actividad</div>
                    <div className="summary-value">
                      {reporte.resumen.totalActividad}
                    </div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-label">Total Clicks</div>
                    <div className="summary-value">
                      {reporte.resumen.totalClicks}
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-table-container">
                <h3>Detalle de Usuarios</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Empresa</th>
                      <th>Rol</th>
                      <th>Fecha Alta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>{u.razonSocial || "-"}</td>
                        <td>{u.role}</td>
                        <td>{formatFecha(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Reporte de Clientes */}
          {tipoReporte === "clientes" && (
            <>
              <div className="report-summary">
                <h3>Resumen</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-label">Total Clientes</div>
                    <div className="summary-value">
                      {reporte.resumen.totalClientes}
                    </div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-label">Usuarios con Clientes</div>
                    <div className="summary-value">
                      {reporte.resumen.totalUsuariosConClientes}
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-table-container">
                <h3>Detalle de Clientes</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Email</th>
                      <th>Usuario Propietario</th>
                      <th>Empresa</th>
                      <th>Fecha Alta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.clientes.map((c) => (
                      <tr key={c.id}>
                        <td>{c.nombre}</td>
                        <td>{c.email || "-"}</td>
                        <td>{c.usuario?.nombre || "-"}</td>
                        <td>{c.usuario?.razonSocial || "-"}</td>
                        <td>{formatFecha(c.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Reporte de Clicks */}
          {tipoReporte === "clicks" && (
            <>
              <div className="report-summary">
                <h3>Resumen de Clicks</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-label">Total Clicks</div>
                    <div className="summary-value">
                      {reporte.resumen.totalClicks}
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-table-container">
                <h3>Clicks por Módulo</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Módulo</th>
                      <th className="text-center">Total Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.resumen.clicksPorModulo.map((item, index) => (
                      <tr key={index}>
                        <td style={{ textTransform: "capitalize" }}>
                          {item.modulo}
                        </td>
                        <td className="text-center">
                          <span className="stat-badge-lg">{item.total}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-table-container">
                <h3>Top 20 Publicaciones más Clickeadas</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Módulo</th>
                      <th>Publicación</th>
                      <th>Propietario</th>
                      <th className="text-center">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.resumen.clicksPorPublicacion.map((item, index) => (
                      <tr key={index}>
                        <td style={{ textTransform: "capitalize" }}>
                          {item.modulo}
                        </td>
                        <td>
                          {item.publicacionTitulo ||
                            `ID: ${item.publicacionId}`}
                        </td>
                        <td>{item.propietarioEmpresa || "-"}</td>
                        <td className="text-center">
                          <span className="stat-badge-lg">{item.clicks}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Reporte de Actividad */}
          {tipoReporte === "actividad" && (
            <>
              <div className="report-summary">
                <h3>Resumen de Actividad</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-label">Total Registros</div>
                    <div className="summary-value">{reporte.resumen.total}</div>
                  </div>
                </div>
              </div>

              <div className="admin-table-container">
                <h3>Actividad por Módulo y Acción</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Módulo</th>
                      <th>Acción</th>
                      <th className="text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.resumen.porModuloAccion.map((item, index) => (
                      <tr key={index}>
                        <td style={{ textTransform: "capitalize" }}>
                          {item.modulo}
                        </td>
                        <td style={{ textTransform: "capitalize" }}>
                          {item.accion}
                        </td>
                        <td className="text-center">
                          <span className="stat-badge-lg">{item.total}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-table-container">
                <h3>Actividad Reciente (últimos 100 registros)</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Módulo</th>
                      <th>Acción</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.actividad.slice(0, 100).map((item, index) => (
                      <tr key={index}>
                        <td className="text-muted">
                          {new Date(item.createdAt).toLocaleString("es-AR")}
                        </td>
                        <td>{item.userName || "-"}</td>
                        <td style={{ textTransform: "capitalize" }}>
                          {item.modulo}
                        </td>
                        <td style={{ textTransform: "capitalize" }}>
                          {item.accion}
                        </td>
                        <td>{item.descripcion || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {!reporte && !loading && (
        <div className="no-data-message">
          <FaChartBar size={48} color="#ccc" />
          <p>
            Configura los filtros y genera un reporte para ver los resultados
          </p>
        </div>
      )}

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
