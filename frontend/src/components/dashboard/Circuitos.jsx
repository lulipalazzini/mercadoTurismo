import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaRoute,
  FaMapMarkedAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getCircuitos, deleteCircuito } from "../../services/circuitos.service";
import ConfirmModal from "../common/ConfirmModal";
import AlertModal from "../common/AlertModal";
import CircuitoFormModal from "./CircuitoFormModal";
import CircuitoEditModal from "./CircuitoEditModal";

export default function Circuitos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getCircuitos();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los circuitos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteCircuito(itemToDelete.id);
      loadItems();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setAlertMessage("Error al eliminar el circuito.");
      setShowAlert(true);
    } finally {
      setItemToDelete(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const filteredItems = items.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas
  const destinosUnicos = [...new Set(items.flatMap(c => Array.isArray(c.destinos) ? c.destinos : []))].length;
  const duracionPromedio = items.length > 0 
    ? Math.round(items.reduce((sum, c) => sum + Number(c.duracion || 0), 0) / items.length)
    : 0;
  const circuitosCortos = items.filter(c => Number(c.duracion) <= 3).length;

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
          <p style={{ color: "#718096" }}>Cargando circuitos...</p>
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
            onClick={loadItems}
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
          <FaPlus /> Nuevo Circuito
        </button>
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar circuitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <FaRoute />
          </div>
          <div className="stat-content">
            <h3>{filteredItems.length}</h3>
            <p>Circuitos {searchTerm ? "Filtrados" : "Activos"}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{circuitosCortos}</h3>
            <p>Circuitos Cortos (≤3 días)</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaMapMarkedAlt />
          </div>
          <div className="stat-content">
            <h3>{destinosUnicos}</h3>
            <p>Destinos Únicos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{duracionPromedio} días</h3>
            <p>Duración Promedio</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="alert alert-info" style={{ margin: "2rem" }}>
          <p>No se encontraron circuitos con los filtros aplicados</p>
        </div>
      ) : (
        <div className="packages-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="package-card">
              <div className="package-header">
                <div className="package-category">
                  <span className="category-badge category-standard">
                    Circuito
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn-icon"
                    onClick={() => handleEditClick(item)}
                    title="Editar circuito"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteClick(item)}
                    title="Eliminar circuito"
                    style={{ color: "#e53e3e" }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="package-body">
                <h3 className="package-title">{item.nombre}</h3>
                <div className="package-info">
                  <div className="info-item">
                    <span className="info-icon">
                      <FaMapMarkedAlt />
                    </span>
                    <span>
                      {Array.isArray(item.destinos)
                        ? item.destinos.slice(0, 2).join(", ")
                        : "Destinos"}
                      {Array.isArray(item.destinos) && item.destinos.length > 2 && ` +${item.destinos.length - 2} más`}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">
                      <FaCalendarAlt />
                    </span>
                    <span>{item.duracion} días</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">
                      <FaDollarSign />
                    </span>
                    <span>{formatCurrency(item.precio)}</span>
                  </div>
                </div>

                {item.descripcion && (
                  <p className="package-description">
                    {item.descripcion.length > 100
                      ? `${item.descripcion.substring(0, 100)}...`
                      : item.descripcion}
                  </p>
                )}
              </div>

              <div className="package-footer">
                <div className="package-price">
                  <span className="price-label">Lugares incluidos</span>
                  <span className="price-value">
                    {Array.isArray(item.destinos) ? item.destinos.length : 0} destinos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>

    <CircuitoFormModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSuccess={loadItems}
    />

    <CircuitoEditModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onSuccess={loadItems}
      circuito={selectedItem}
    />

    <ConfirmModal
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={confirmDelete}
      title="Eliminar Circuito"
      message={`¿Estás seguro de que deseas eliminar "${itemToDelete?.nombre}"?`}
      isDanger={true}
    />

    <AlertModal
      isOpen={showAlert}
      onClose={() => setShowAlert(false)}
      title="Error"
      message={alertMessage}
      type="error"
    />
    </>
  );
}
