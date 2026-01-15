import React from "react";
import {
  FaChartLine,
  FaDownload,
  FaCalendarAlt,
  FaDollarSign,
  FaUsers,
  FaClipboardList,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import ClickStatsPanel from "../ClickStatsPanel";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Reportes() {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  // Datos para el gráfico de líneas - Ventas Mensuales
  const ventasData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        label: "Ventas 2024",
        data: [
          1850000, 2100000, 1950000, 2200000, 2400000, 2150000, 2300000,
          2500000, 2350000, 2600000, 2450000, 2800000,
        ],
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#667eea",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const ventasOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return "Ventas: " + formatCurrency(context.parsed.y);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + (value / 1000).toFixed(0) + "k";
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Datos para el gráfico de dona - Reservas por Estado
  const reservasData = {
    labels: ["Confirmadas", "Pendientes", "Cotización", "Canceladas"],
    datasets: [
      {
        data: [47, 18, 12, 5],
        backgroundColor: [
          "#48bb78", // Verde - Confirmadas
          "#ed8936", // Naranja - Pendientes
          "#f6ad55", // Amarillo - Cotización
          "#a0aec0", // Gris - Canceladas
        ],
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 10,
      },
    ],
  };

  const reservasOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return label + ": " + value + " (" + percentage + "%)";
          },
        },
      },
    },
  };

  return (
    <div className="section-container">
      {/* Toolbar */}
      <div className="section-toolbar">
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <FaCalendarAlt className="search-icon" />
            <input type="date" placeholder="Fecha desde" />
            <span style={{ margin: "0 0.5rem" }}>-</span>
            <input type="date" placeholder="Fecha hasta" />
          </div>
          <select className="filter-select">
            <option>Último mes</option>
            <option>Últimos 3 meses</option>
            <option>Últimos 6 meses</option>
            <option>Último año</option>
          </select>
        </div>
        <button className="btn-primary">
          <FaDownload /> Exportar PDF
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaDollarSign style={{ color: "#1976d2" }} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(2450000)}</h3>
            <p>Ventas del Mes</p>
            <small
              style={{
                color: "#48bb78",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <FaArrowUp /> +15.3% vs mes anterior
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <FaClipboardList style={{ color: "#7b1fa2" }} />
          </div>
          <div className="stat-content">
            <h3>47</h3>
            <p>Reservas Confirmadas</p>
            <small
              style={{
                color: "#48bb78",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <FaArrowUp /> +8.2% vs mes anterior
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaUsers style={{ color: "#388e3c" }} />
          </div>
          <div className="stat-content">
            <h3>126</h3>
            <p>Clientes Activos</p>
            <small
              style={{
                color: "#48bb78",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <FaArrowUp /> +12.5% vs mes anterior
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaTrophy style={{ color: "#f57c00" }} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(245000)}</h3>
            <p>Comisiones Ganadas</p>
            <small
              style={{
                color: "#e53e3e",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <FaArrowDown /> -3.1% vs mes anterior
            </small>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e1e4e8",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
              margin: "0 0 1rem 0",
            }}
          >
            <FaChartLine style={{ color: "#667eea" }} /> Ventas Mensuales
          </h3>
          <div style={{ height: "300px" }}>
            <Line data={ventasData} options={ventasOptions} />
          </div>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e1e4e8",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
              margin: "0 0 1rem 0",
            }}
          >
            <FaClipboardList style={{ color: "#667eea" }} /> Reservas por Estado
          </h3>
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Doughnut data={reservasData} options={reservasOptions} />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div
        style={{
          marginTop: "1.5rem",
          background: "white",
          border: "1px solid #e1e4e8",
          borderRadius: "12px",
          padding: "1.5rem",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <FaTrophy style={{ color: "#667eea" }} /> Paquetes Más Vendidos
        </h3>
        <div className="table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Paquete</th>
                <th>Reservas</th>
                <th>Ingresos</th>
                <th>Comisiones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-center">
                  <span
                    style={{
                      background: "#ffd700",
                      color: "#744210",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    1
                  </span>
                </td>
                <td className="cell-package">Mendoza Premium 5 días</td>
                <td className="cell-center">18</td>
                <td className="cell-money">{formatCurrency(810000)}</td>
                <td className="cell-money cell-commission">
                  {formatCurrency(81000)}
                </td>
              </tr>
              <tr>
                <td className="cell-center">
                  <span
                    style={{
                      background: "#c0c0c0",
                      color: "#2d3748",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    2
                  </span>
                </td>
                <td className="cell-package">Bariloche Ski Week</td>
                <td className="cell-center">15</td>
                <td className="cell-money">{formatCurrency(675000)}</td>
                <td className="cell-money cell-commission">
                  {formatCurrency(67500)}
                </td>
              </tr>
              <tr>
                <td className="cell-center">
                  <span
                    style={{
                      background: "#cd7f32",
                      color: "#fff",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    3
                  </span>
                </td>
                <td className="cell-package">Cataratas del Iguazú</td>
                <td className="cell-center">12</td>
                <td className="cell-money">{formatCurrency(432000)}</td>
                <td className="cell-money cell-commission">
                  {formatCurrency(43200)}
                </td>
              </tr>
              <tr>
                <td className="cell-center">4</td>
                <td className="cell-package">Buenos Aires Cultural</td>
                <td className="cell-center">9</td>
                <td className="cell-money">{formatCurrency(288000)}</td>
                <td className="cell-money cell-commission">
                  {formatCurrency(28800)}
                </td>
              </tr>
              <tr>
                <td className="cell-center">5</td>
                <td className="cell-package">Salta y Jujuy 7 días</td>
                <td className="cell-center">7</td>
                <td className="cell-money">{formatCurrency(245000)}</td>
                <td className="cell-money cell-commission">
                  {formatCurrency(24500)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas de Clicks */}
      <ClickStatsPanel />
    </div>
  );
}
