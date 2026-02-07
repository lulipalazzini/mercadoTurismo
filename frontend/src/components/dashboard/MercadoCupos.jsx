import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaStore,
  FaCalendarAlt,
  FaClock,
  FaBox,
  FaEye,
  FaTag,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationTriangle,
  FaWhatsapp,
  FaPhone,
  FaUser,
  FaFileExcel,
  FaPlane,
} from "react-icons/fa";
import { getCuposMarketplace, getMisCupos } from "../../services/cupos.service";
import PublicarCupoModal from "./PublicarCupoModal";
import ImportarCuposModal from "./ImportarCuposModal";
import AlertModal from "../common/AlertModal";

export default function MercadoCupos() {
  const [cupos, setCupos] = useState([]);
  const [misCupos, setMisCupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [isPublicarModalOpen, setIsPublicarModalOpen] = useState(false);
  const [isImportarModalOpen, setIsImportarModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });

  const user = JSON.parse(localStorage.getItem("currentUser")) || {};

  // Debug: verificar rol del usuario
  console.log("Usuario en MercadoCupos:", user);
  console.log("Rol del usuario:", user.role);

  const canViewMarketplace = true; // Todos los usuarios pueden ver el marketplace
  const canPublish =
    user.role === "operador" ||
    user.role === "agencia" ||
    user.role === "admin" ||
    user.role === "sysadmin";

  console.log("canPublish:", canPublish);
  console.log("canViewMarketplace:", canViewMarketplace);

  // Operadores/agencias ven "mis-cupos" por defecto, otros usuarios ven "marketplace"
  const [vistaActiva, setVistaActiva] = useState(
    canPublish ? "mis-cupos" : "marketplace",
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar mis cupos si puede publicar
      if (canPublish) {
        const misCuposData = await getMisCupos();
        setMisCupos(misCuposData);
      }

      // Cargar marketplace (disponible para todos)
      if (canViewMarketplace) {
        const marketplaceData = await getCuposMarketplace();
        setCupos(marketplaceData);
      }

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar los cupos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCupoPublished = () => {
    loadData();
    setAlertData({
      type: "success",
      message: "Cupo publicado exitosamente",
    });
    setShowAlert(true);
  };

  const handleImportSuccess = (result) => {
    loadData();
    setAlertData({
      type: "success",
      message: `Se importaron ${result.importados} cupos exitosamente`,
    });
    setShowAlert(true);
  };

  const handleWhatsAppClick = (cupo) => {
    if (!cupo.vendedor?.telefono) {
      setAlertData({
        type: "error",
        message: "El operador no tiene número de teléfono disponible",
      });
      setShowAlert(true);
      return;
    }

    const telefono = cupo.vendedor.telefono.replace(/\D/g, "");
    const mensaje = encodeURIComponent(
      `Hola, estoy interesado en el cupo de ${cupo.aerolinea}: ${cupo.descripcion}`,
    );
    const whatsappUrl = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-AR");
  };

  const getDaysRemaining = (fechaVencimiento) => {
    if (!fechaVencimiento) return null;
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      disponible: {
        class: "badge-success",
        icon: <FaCheckCircle />,
        text: "Disponible",
      },
      vendido: {
        class: "badge-secondary",
        icon: <FaBox />,
        text: "Vendido",
      },
      vencido: {
        class: "badge-danger",
        icon: <FaExclamationTriangle />,
        text: "Vencido",
      },
    };
    return badges[estado] || badges.disponible;
  };

  const cuposToDisplay = vistaActiva === "marketplace" ? cupos : misCupos;

  const filteredCupos = cuposToDisplay.filter((cupo) => {
    const matchSearch =
      cupo.aerolinea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cupo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategoria =
      !categoriaFilter || cupo.aerolinea === categoriaFilter;

    return matchSearch && matchCategoria;
  });

  const categorias = [
    ...new Set(cuposToDisplay.map((c) => c.aerolinea)),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando mercado de cupos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="error-state">
          <FaExclamationTriangle />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <div className="header-left">
          <div className="header-icon">
            <FaStore />
          </div>
          <div className="header-info">
            <h1>Mercado de Cupos</h1>
            <p className="header-subtitle">
              {canViewMarketplace
                ? "Explora cupos disponibles de operadores y gestiona tus publicaciones"
                : "Gestiona tus cupos publicados"}
            </p>
          </div>
        </div>
        {canPublish && (
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <button
              className="btn-secondary"
              onClick={() => setIsImportarModalOpen(true)}
              style={{ height: "fit-content" }}
            >
              <FaFileExcel /> Importar Excel
            </button>
            <button
              className="btn-primary"
              onClick={() => setIsPublicarModalOpen(true)}
              style={{ height: "fit-content" }}
            >
              <FaPlus /> Publicar Cupo
            </button>
          </div>
        )}
      </div>

      {/* Tabs de navegación */}
      <div className="tabs-container" style={{ marginBottom: "1.5rem" }}>
        {canPublish && (
          <button
            className={`tab-button ${vistaActiva === "mis-cupos" ? "active" : ""}`}
            onClick={() => setVistaActiva("mis-cupos")}
          >
            <FaBox /> Mis Cupos ({misCupos.length})
          </button>
        )}
        {canViewMarketplace && (
          <button
            className={`tab-button ${vistaActiva === "marketplace" ? "active" : ""}`}
            onClick={() => setVistaActiva("marketplace")}
          >
            <FaStore /> Marketplace ({cupos.length})
          </button>
        )}
      </div>

      <div className="content-filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por tipo o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mercado-stats">
        <div className="stat-card">
          <div className="stat-icon disponible">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-label">Disponibles</span>
            <span className="stat-value">
              {cuposToDisplay.filter((c) => c.estado === "disponible").length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">
            <FaBox />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Cupos</span>
            <span className="stat-value">{cuposToDisplay.length}</span>
          </div>
        </div>
      </div>

      {filteredCupos.length === 0 ? (
        <div className="empty-state">
          <FaStore />
          <h3>No hay cupos disponibles</h3>
          <p>
            {vistaActiva === "marketplace"
              ? "No se encontraron cupos en el marketplace"
              : "Aún no has publicado ningún cupo"}
          </p>
        </div>
      ) : (
        <div className="cupos-grid">
          {filteredCupos.map((cupo) => {
            const daysRemaining = getDaysRemaining(cupo.fechaVencimiento);
            const estadoBadge = getEstadoBadge(cupo.estado);
            const isUrgente = daysRemaining !== null && daysRemaining <= 3;
            const showWhatsApp =
              vistaActiva === "marketplace" && cupo.estado === "disponible";

            return (
              <div
                key={cupo.id}
                className={`cupo-card ${cupo.estado} ${
                  isUrgente ? "urgente" : ""
                }`}
              >
                <div className="cupo-header">
                  <div className="cupo-tipo">
                    <FaPlane />
                    <span>{cupo.aerolinea || "Aereo"}</span>
                  </div>
                  <span className={`cupo-badge ${estadoBadge.class}`}>
                    {estadoBadge.icon}
                    {estadoBadge.text}
                  </span>
                </div>

                <div className="cupo-body">
                  <h3 className="cupo-title">{cupo.descripcion}</h3>

                  {/* Información del vendedor (solo en marketplace) */}
                  {vistaActiva === "marketplace" && cupo.vendedor && (
                    <div
                      className="vendedor-info"
                      style={{
                        padding: "0.75rem",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FaUser style={{ color: "#6c757d" }} />
                        <span>
                          <strong>Operador:</strong> {cupo.vendedor.nombre}
                        </span>
                      </div>
                      {cupo.vendedor.razonSocial && (
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#6c757d",
                            marginTop: "0.25rem",
                          }}
                        >
                          {cupo.vendedor.razonSocial}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="cupo-details">
                    <div className="detail-item">
                      <FaPlane />
                      <span>
                        <strong>Fecha Vuelo:</strong>{" "}
                        {formatDate(cupo.fechaOrigen)}
                      </span>
                    </div>

                    <div className="detail-item">
                      <FaCalendarAlt />
                      <span>
                        <strong>Válido hasta:</strong>{" "}
                        {formatDate(cupo.fechaVencimiento)}
                      </span>
                    </div>

                    {daysRemaining !== null && (
                      <div
                        className={`detail-item ${isUrgente ? "urgente" : ""}`}
                      >
                        <FaClock />
                        <span>
                          <strong>Vence en:</strong>{" "}
                          {daysRemaining > 0
                            ? `${daysRemaining} día${
                                daysRemaining !== 1 ? "s" : ""
                              }`
                            : "Vencido"}
                        </span>
                      </div>
                    )}

                    <div className="detail-item">
                      <FaBox />
                      <span>
                        <strong>Cantidad:</strong> {cupo.cantidad}
                      </span>
                    </div>

                    <div className="detail-item precio">
                      <FaDollarSign />
                      <span className="precio-valor">
                        {formatCurrency(cupo.precioMayorista)}
                      </span>
                      <small className="precio-label">Precio Mayorista</small>
                    </div>
                  </div>

                  {cupo.observaciones && (
                    <div className="cupo-observaciones">
                      <p>{cupo.observaciones}</p>
                    </div>
                  )}
                </div>

                <div className="cupo-footer">
                  {showWhatsApp && (
                    <button
                      className="btn-whatsapp"
                      onClick={() => handleWhatsAppClick(cupo)}
                      style={{
                        background: "#25D366",
                        color: "white",
                        border: "none",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "500",
                        width: "100%",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#1fb855")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#25D366")
                      }
                    >
                      <FaWhatsapp size={20} /> Contactar por WhatsApp
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PublicarCupoModal
        isOpen={isPublicarModalOpen}
        onClose={() => setIsPublicarModalOpen(false)}
        onSuccess={handleCupoPublished}
      />

      <ImportarCuposModal
        isOpen={isImportarModalOpen}
        onClose={() => setIsImportarModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertData.message}
        type={alertData.type}
      />
    </div>
  );
}
