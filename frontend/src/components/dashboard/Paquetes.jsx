import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaBullseye,
  FaStar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaBox,
  FaEye,
  FaClipboardList,
  FaEllipsisV,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getPaquetes, deletePaquete } from "../../services/paquetes.service";
import PaqueteFormModal from "./PaqueteFormModal";
import PaqueteEditModal from "./PaqueteEditModal";
import ConfirmModal from "../common/ConfirmModal";
import AlertModal from "../common/AlertModal";
import PreviewModal from "../common/PreviewModal";
import PaqueteCard from "../PaqueteCard";

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [destinoFilter, setDestinoFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPaquete, setSelectedPaquete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paqueteToDelete, setPaqueteToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [paqueteToPreview, setPaqueteToPreview] = useState(null);

  useEffect(() => {
    loadPaquetes();
  }, []);

  const loadPaquetes = async () => {
    try {
      setLoading(true);
      const data = await getPaquetes();
      setPaquetes(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los paquetes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaqueteCreated = () => {
    loadPaquetes(); // Recargar la lista después de crear
  };

  const handleEditClick = (paquete) => {
    setSelectedPaquete(paquete);
    setIsEditModalOpen(true);
  };

  const handlePaqueteUpdated = () => {
    loadPaquetes(); // Recargar la lista después de editar
  };

  const handleDeleteClick = (paquete) => {
    setPaqueteToDelete(paquete);
    setShowConfirm(true);
  };

  const handlePreviewClick = (paquete) => {
    setPaqueteToPreview(paquete);
    setShowPreview(true);
  };

  const confirmDelete = async () => {
    if (!paqueteToDelete) return;

    try {
      await deletePaquete(paqueteToDelete.id);
      loadPaquetes(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar paquete:", error);
      setAlertMessage(
        "Error al eliminar el paquete. Por favor intenta nuevamente."
      );
      setShowAlert(true);
    } finally {
      setPaqueteToDelete(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getCategoryColor = (categoria) => {
    return categoria === "Premium" ? "category-premium" : "category-standard";
  };

  // Obtener destinos únicos para el filtro
  const destinos = [...new Set(paquetes.map((p) => p.destino))].sort();

  // Filtrar paquetes
  const paquetesFiltrados = paquetes.filter((paquete) => {
    const matchSearch = paquete.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchDestino = !destinoFilter || paquete.destino === destinoFilter;
    return matchSearch && matchDestino;
  });

  if (loading) {
    return (
      <div className="section-container">
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
          <p style={{ color: "#718096" }}>Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container">
        <div className="alert alert-danger" style={{ margin: "2rem" }}>
          {error}
          <button
            onClick={loadPaquetes}
            className="btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="section-container">
        {/* Toolbar */}
        <div className="section-toolbar">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Nuevo Paquete
          </button>
          <div className="toolbar-actions">
            <div className="search-box-crm">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar paquetes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={destinoFilter}
              onChange={(e) => setDestinoFilter(e.target.value)}
            >
              <option value="">Todos los destinos</option>
              {destinos.map((destino) => (
                <option key={destino} value={destino}>
                  {destino}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <FaBullseye />
            </div>
            <div className="stat-content">
              <h3>{paquetesFiltrados.length}</h3>
              <p>
                Paquetes {searchTerm || destinoFilter ? "Filtrados" : "Activos"}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <FaStar />
            </div>
            <div className="stat-content">
              <h3>
                {paquetes.filter((p) => p.categoria === "Premium").length}
              </h3>
              <p>Premium</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <FaMapMarkerAlt />
            </div>
            <div className="stat-content">
              <h3>{destinos.length}</h3>
              <p>Destinos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>
                {paquetes.length > 0
                  ? Math.round(
                      paquetes.reduce((sum, p) => sum + (p.comision || 10), 0) /
                        paquetes.length
                    )
                  : 0}
                %
              </h3>
              <p>Comisión Promedio</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {paquetesFiltrados.length === 0 ? (
          <div className="alert alert-info" style={{ margin: "2rem" }}>
            <p>No se encontraron paquetes con los filtros aplicados</p>
          </div>
        ) : (
          <div className="packages-grid">
            {paquetesFiltrados.map((paquete) => (
              <div key={paquete.id} className="package-card">
                <div className="package-header">
                  <div className="package-category">
                    <span
                      className={`category-badge ${getCategoryColor(
                        paquete.categoria
                      )}`}
                    >
                      {paquete.categoria || "Estándar"}
                    </span>
                    {paquete.disponible !== false && (
                      <span className="available-badge">
                        <FaCheckCircle /> Disponible
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleEditClick(paquete)}
                      title="Editar paquete"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteClick(paquete)}
                      title="Eliminar paquete"
                      style={{ color: "#e53e3e" }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="package-body">
                  <h3 className="package-title">{paquete.nombre}</h3>
                  <div className="package-info">
                    <div className="info-item">
                      <span className="info-icon">
                        <FaMapMarkerAlt />
                      </span>
                      <span>{paquete.destino}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">
                        <FaCalendarAlt />
                      </span>
                      <span>{paquete.duracion} días</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">
                        <FaBox />
                      </span>
                      <span>
                        {paquete.cupoDisponible || paquete.stock || 0}{" "}
                        disponibles
                      </span>
                    </div>
                  </div>

                  {paquete.incluye && paquete.incluye.length > 0 && (
                    <div className="package-includes">
                      <strong>Incluye:</strong>
                      <div className="includes-tags">
                        {paquete.incluye.slice(0, 4).map((item, index) => (
                          <span key={index} className="include-tag">
                            {item}
                          </span>
                        ))}
                        {paquete.incluye.length > 4 && (
                          <span className="include-tag">
                            +{paquete.incluye.length - 4} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="package-pricing">
                    <div className="price-main">
                      <span className="price-label">Precio por persona</span>
                      <span className="price-amount">
                        {formatCurrency(paquete.precio)}
                      </span>
                    </div>
                    {paquete.comision && (
                      <div className="price-commission">
                        <span className="commission-label">Tu comisión:</span>
                        <span className="commission-amount">
                          {paquete.comision}% (
                          {formatCurrency(
                            (paquete.precio * paquete.comision) / 100
                          )}
                          )
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="package-footer">
                  <button 
                    className="btn-secondary btn-block"
                    onClick={() => handlePreviewClick(paquete)}
                  >
                    <FaEye /> Ver Detalles
                  </button>
                  <button className="btn-primary btn-block">
                    <FaClipboardList /> Reservar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PaqueteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaqueteCreated}
      />

      <PaqueteEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handlePaqueteUpdated}
        paquete={selectedPaquete}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setPaqueteToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de eliminar el paquete "${paqueteToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        danger={true}
      />

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
        type="error"
      />

      <PreviewModal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setPaqueteToPreview(null);
        }}
        title="Vista Previa - Como lo ve el cliente"
      >
        {paqueteToPreview && <PaqueteCard paquete={paqueteToPreview} />}
      </PreviewModal>
    </>
  );
}
