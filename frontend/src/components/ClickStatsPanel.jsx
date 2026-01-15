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
          <h3 className="section-title-reports">
            <FaMousePointer style={{ marginRight: "0.5rem" }} />
            Estadísticas de Interacción
          </h3>
          <p className="section-subtitle-reports">
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
            <h3>{stats.totalClicks.toLocaleString()}</h3>
            <p>Total de Clicks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <FaMousePointer style={{ color: "#7b1fa2" }} />
          </div>
          <div className="stat-content">
            <h3>{stats.stats.filter((s) => s.clicks > 0).length}</h3>
            <p>Categorías Activas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <span style={{ fontSize: "1.5rem" }}>
              {stats.stats[0] ? getCardTypeIcon(stats.stats[0].cardType) : "🏆"}
            </span>
          </div>
          <div className="stat-content">
            <h3>
              {stats.stats[0] ? getCardTypeLabel(stats.stats[0].cardType) : "-"}
            </h3>
            <p>Más Popular</p>
          </div>
        </div>
      </div>

      {/* Tabla de estadísticas */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Ranking de Servicios</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive" style={{ marginBottom: "20px" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Pos.</th>
                  <th>Servicio</th>
                  <th style={{ textAlign: "right" }}>Clicks</th>
                  <th style={{ width: "40%" }}>Distribución</th>
                  <th style={{ textAlign: "right", width: "100px" }}>%</th>
                </tr>
              </thead>
              <tbody>
                {stats.stats.map((stat, index) => (
                  <tr key={stat.cardType}>
                    <td>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: index < 3 ? "#4a5568" : "#e2e8f0",
                          color: index < 3 ? "white" : "#4a5568",
                          display: "flex",
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
                        <span style={{ fontWeight: "500" }}>
                          {getCardTypeLabel(stat.cardType)}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: "600" }}>
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
                    <td style={{ textAlign: "right", color: "#718096" }}>
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
            color: "#a0aec0",
            fontSize: "0.875rem",
          }}
        >
          Última actualización: {new Date().toLocaleString("es-ES")}
        </div>
      </div>
    </div>
  );
}
