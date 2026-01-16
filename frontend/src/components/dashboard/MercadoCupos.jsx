import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaStore,
  FaCalendarAlt,
  FaClock,
  FaBox,
  FaShoppingCart,
  FaEye,
  FaTag,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getCupos } from "../../services/cupos.service";
import PublicarCupoModal from "./PublicarCupoModal";
import ComprarCupoModal from "./ComprarCupoModal";
import AlertModal from "../common/AlertModal";

export default function MercadoCupos() {
  const [cupos, setCupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("disponible");
  const [isPublicarModalOpen, setIsPublicarModalOpen] = useState(false);
  const [isComprarModalOpen, setIsComprarModalOpen] = useState(false);
  const [selectedCupo, setSelectedCupo] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    loadCupos();
  }, []);

  const loadCupos = async () => {
    try {
      setLoading(true);
      const data = await getCupos();
      setCupos(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los cupos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCupoPublished = () => {
    loadCupos();
  };

  const handleComprarClick = (cupo) => {
    setSelectedCupo(cupo);
    setIsComprarModalOpen(true);
  };

  const handleCupoComprado = () => {
    loadCupos();
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
        icon: <FaShoppingCart />,
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

  const filteredCupos = cupos.filter((cupo) => {
    const matchSearch =
      cupo.tipoProducto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cupo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategoria =
      !categoriaFilter || cupo.tipoProducto === categoriaFilter;

    const matchEstado = !estadoFilter || cupo.estado === estadoFilter;

    return matchSearch && matchCategoria && matchEstado;
  });

  const categorias = [...new Set(cupos.map((c) => c.tipoProducto))].filter(
    Boolean
  );

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
              Compra y vende cupos disponibles con otros operadores
            </p>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => setIsPublicarModalOpen(true)}
        >
          <FaPlus /> Publicar Cupo
        </button>
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

          <select
            className="filter-select"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="disponible">Disponibles</option>
            <option value="vendido">Vendidos</option>
            <option value="vencido">Vencidos</option>
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
              {cupos.filter((c) => c.estado === "disponible").length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon vendido">
            <FaShoppingCart />
          </div>
          <div className="stat-info">
            <span className="stat-label">Vendidos</span>
            <span className="stat-value">
              {cupos.filter((c) => c.estado === "vendido").length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">
            <FaBox />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Cupos</span>
            <span className="stat-value">{cupos.length}</span>
          </div>
        </div>
      </div>

      {filteredCupos.length === 0 ? (
        <div className="empty-state">
          <FaStore />
          <h3>No hay cupos disponibles</h3>
          <p>No se encontraron cupos que coincidan con tu búsqueda</p>
        </div>
      ) : (
        <div className="cupos-grid">
          {filteredCupos.map((cupo) => {
            const daysRemaining = getDaysRemaining(cupo.fechaVencimiento);
            const estadoBadge = getEstadoBadge(cupo.estado);
            const isUrgente = daysRemaining !== null && daysRemaining <= 3;

            return (
              <div
                key={cupo.id}
                className={`cupo-card ${cupo.estado} ${
                  isUrgente ? "urgente" : ""
                }`}
              >
                <div className="cupo-header">
                  <div className="cupo-tipo">
                    <FaBox />
                    <span>{cupo.tipoProducto || "Cupo"}</span>
                  </div>
                  <span className={`cupo-badge ${estadoBadge.class}`}>
                    {estadoBadge.icon}
                    {estadoBadge.text}
                  </span>
                </div>

                <div className="cupo-body">
                  <h3 className="cupo-title">{cupo.descripcion}</h3>

                  <div className="cupo-details">
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
                  {cupo.estado === "disponible" && (
                    <button
                      className="btn-primary"
                      onClick={() => handleComprarClick(cupo)}
                    >
                      <FaShoppingCart /> Comprar Cupo
                    </button>
                  )}
                  <button className="btn-secondary">
                    <FaEye /> Ver Detalles
                  </button>
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

      <ComprarCupoModal
        isOpen={isComprarModalOpen}
        onClose={() => {
          setIsComprarModalOpen(false);
          setSelectedCupo(null);
        }}
        onSuccess={handleCupoComprado}
        cupo={selectedCupo}
      />

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message="Información del mercado de cupos"
        type="info"
      />
    </div>
  );
}
