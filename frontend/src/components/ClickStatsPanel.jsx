import React, { useEffect, useState } from "react";
import { getClickStats } from "../services/clickStats.service";
import { FaChartBar, FaMousePointer, FaSync } from "react-icons/fa";

export default function ClickStatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const data = await getClickStats();
      if (data) {
        setStats(data);
        setError(null);
      } else {
        setError("No se pudieron cargar las estadísticas");
      }
    } catch (err) {
      setError("Error al cargar las estadísticas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCardTypeLabel = (cardType) => {
    const labels = {
      alojamiento: "Alojamientos",
      auto: "Autos",
      circuito: "Circuitos",
      crucero: "Cruceros",
      excursion: "Excursiones",
      paquete: "Paquetes",
      pasaje: "Pasajes",
      salidaGrupal: "Salidas Grupales",
      seguro: "Seguros",
      transfer: "Transfers",
    };
    return labels[cardType] || cardType;
  };

  const getCardTypeIcon = (cardType) => {
    const icons = {
      alojamiento: "🏨",
      auto: "🚗",
      circuito: "🗺️",
      crucero: "🚢",
      excursion: "🏔️",
      paquete: "📦",
      pasaje: "✈️",
      salidaGrupal: "👥",
      seguro: "🛡️",
      transfer: "🚐",
    };
    return icons[cardType] || "📊";
  };

  const getPercentage = (clicks) => {
    if (!stats || stats.totalClicks === 0) return 0;
    return ((clicks / stats.totalClicks) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div
          className="spinner"
          style={{
            margin: "0 auto 1rem",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #4a5568",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p style={{ color: "#718096" }}>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning" style={{ margin: "1rem 0" }}>
        <p>{error}</p>
        <button
          onClick={loadStats}
          className="btn-secondary"
          style={{ marginTop: "0.5rem" }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!stats || stats.stats.length === 0) {
    return (
      <div className="alert alert-info" style={{ margin: "1rem 0" }}>
        <p>No hay estadísticas de clicks disponibles aún</p>
      </div>
    );
  }

  return (
    <div className="report-section">
      <div className="section-header-reports">
        <div>
          <h3 className="section-title-reports" style={{ color: "#1a202c" }}>
            <FaMousePointer style={{ marginRight: "0.5rem" }} />
            Estadísticas de Interacción
          </h3>
          <p className="section-subtitle-reports" style={{ color: "#4a5568" }}>
            Análisis de clicks por tipo de servicio
          </p>
        </div>
        <button
          onClick={loadStats}
          className="btn-secondary"
          title="Actualizar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "20px",
          }}
        >
          <FaSync /> Actualizar
        </button>
      </div>

      {/* Cards de resumen */}
      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaChartBar style={{ color: "#1976d2" }} />
          </div>
          <div className="stat-content">
            <h3 style={{ color: "#1a202c" }}>
              {stats.totalClicks.toLocaleString()}
            </h3>
            <p style={{ color: "#4a5568" }}>Total de Clicks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <FaMousePointer style={{ color: "#7b1fa2" }} />
          </div>
          <div className="stat-content">
            <h3 style={{ color: "#1a202c" }}>
              {stats.stats.filter((s) => s.clicks > 0).length}
            </h3>
            <p style={{ color: "#4a5568" }}>Categorías Activas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <span style={{ fontSize: "1.5rem" }}>
              {stats.stats[0] ? getCardTypeIcon(stats.stats[0].cardType) : "🏆"}
            </span>
          </div>
          <div className="stat-content">
            <h3 style={{ color: "#1a202c" }}>
              {stats.stats[0] ? getCardTypeLabel(stats.stats[0].cardType) : "-"}
            </h3>
            <p style={{ color: "#4a5568" }}>Más Popular</p>
          </div>
        </div>
      </div>

      {/* Tabla de estadísticas */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title" style={{ color: "#1a202c", margin: 0 }}>
            Ranking de Servicios
          </h4>
        </div>
        <div className="card-body">
          <div className="table-responsive" style={{ marginBottom: "20px" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th
                    style={{
                      width: "80px",
                      textAlign: "center",
                      color: "#1a202c",
                    }}
                  >
                    Pos.
                  </th>
                  <th style={{ textAlign: "left", color: "#1a202c" }}>
                    Servicio
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      width: "120px",
                      color: "#1a202c",
                    }}
                  >
                    Clicks
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      width: "35%",
                      color: "#1a202c",
                    }}
                  >
                    Distribución
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      width: "100px",
                      color: "#1a202c",
                    }}
                  >
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.stats.map((stat, index) => (
                  <tr key={stat.cardType}>
                    <td style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: index < 3 ? "#4a5568" : "#e2e8f0",
                          color: index < 3 ? "white" : "#4a5568",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                        }}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "1.25rem" }}>
                          {getCardTypeIcon(stat.cardType)}
                        </span>
                        <span style={{ fontWeight: "500", color: "#1a202c" }}>
                          {getCardTypeLabel(stat.cardType)}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#1a202c",
                      }}
                    >
                      {stat.clicks.toLocaleString()}
                    </td>
                    <td>
                      <div
                        style={{
                          background: "#e2e8f0",
                          borderRadius: "4px",
                          height: "8px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            background: `linear-gradient(90deg, ${
                              index < 3 ? "#4299e1" : "#718096"
                            }, ${index < 3 ? "#3182ce" : "#a0aec0"})`,
                            width: `${getPercentage(stat.clicks)}%`,
                            height: "100%",
                            borderRadius: "4px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        color: "#4a5568",
                        fontWeight: "500",
                      }}
                    >
                      {getPercentage(stat.clicks)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="card-footer"
          style={{
            textAlign: "center",
            color: "#4a5568",
            fontSize: "0.875rem",
          }}
        >
          Última actualización: {new Date().toLocaleString("es-ES")}
        </div>
      </div>

      {/* Top Publicaciones por Categoría */}
      {stats.statsByCategory &&
        Object.keys(stats.statsByCategory).length > 0 && (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <div className="card-header">
              <h4
                className="card-title"
                style={{ color: "#1a202c", margin: 0 }}
              >
                Top Publicaciones por Categoría
              </h4>
            </div>
            <div className="card-body">
              {Object.entries(stats.statsByCategory).map(
                ([category, services]) => {
                  // Mostrar solo categorías que tengan servicios específicos trackeados
                  if (!services || services.length === 0) return null;

                  return (
                    <div
                      key={category}
                      style={{
                        marginBottom: "2rem",
                        paddingBottom: "1.5rem",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>
                          {getCardTypeIcon(category)}
                        </span>
                        <h5
                          style={{
                            color: "#1a202c",
                            margin: 0,
                            fontSize: "1.125rem",
                          }}
                        >
                          {getCardTypeLabel(category)}
                        </h5>
                      </div>

                      <div className="table-responsive">
                        <table
                          className="data-table"
                          style={{ fontSize: "0.875rem" }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  width: "60px",
                                  textAlign: "center",
                                  color: "#4a5568",
                                }}
                              >
                                #
                              </th>
                              <th
                                style={{ textAlign: "left", color: "#4a5568" }}
                              >
                                Publicación
                              </th>
                              <th
                                style={{
                                  textAlign: "center",
                                  width: "120px",
                                  color: "#4a5568",
                                }}
                              >
                                Clicks
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {services.slice(0, 5).map((service, idx) => (
                              <tr key={service.serviceId}>
                                <td style={{ textAlign: "center" }}>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "24px",
                                      height: "24px",
                                      borderRadius: "50%",
                                      background:
                                        idx === 0
                                          ? "#ffd700"
                                          : idx === 1
                                            ? "#c0c0c0"
                                            : idx === 2
                                              ? "#cd7f32"
                                              : "#e2e8f0",
                                      color: idx < 3 ? "white" : "#4a5568",
                                      fontSize: "0.75rem",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {idx + 1}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ color: "#1a202c" }}>
                                    {service.serviceName ||
                                      `Servicio #${service.serviceId}`}
                                  </span>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <span
                                    style={{
                                      background: "#e3f2fd",
                                      color: "#1976d2",
                                      padding: "0.25rem 0.75rem",
                                      borderRadius: "12px",
                                      fontSize: "0.875rem",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {service.clicks}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {services.length > 5 && (
                        <p
                          style={{
                            textAlign: "center",
                            color: "#718096",
                            fontSize: "0.813rem",
                            marginTop: "0.75rem",
                            marginBottom: 0,
                          }}
                        >
                          Mostrando top 5 de {services.length} publicaciones
                        </p>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
    </div>
  );
}
