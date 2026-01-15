import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaPlane,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getPasajes, deletePasaje } from "../../services/pasajes.service";
import ConfirmModal from "../common/ConfirmModal";
import AlertModal from "../common/AlertModal";
import PasajeFormModal from "./PasajeFormModal";
import PasajeEditModal from "./PasajeEditModal";

export default function Pasajes() {
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
      const data = await getPasajes();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los pasajes");
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
      await deletePasaje(itemToDelete.id);
      loadItems();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setAlertMessage("Error al eliminar el pasaje.");
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-AR");
  };

  const filteredItems = items.filter(
    (item) =>
      item.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.aerolinea &&
        item.aerolinea.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calcular estadísticas
  const aereos = items.filter(p => p.tipo === 'Aéreo').length;
  const destinosUnicos = [...new Set(items.map(p => p.destino))].length;
  const precioPromedio = items.length > 0
    ? Math.round(items.reduce((sum, p) => sum + Number(p.precio || 0), 0) / items.length)
    : 0;

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
          <p style={{ color: "#718096" }}>Cargando pasajes...</p>
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
          <FaPlus /> Nuevo Pasaje
        </button>
        <div className="toolbar-actions">
          <div className="search-box-crm">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar pasajes..."
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
            <FaPlane />
          </div>
          <div className="stat-content">
            <h3>{filteredItems.length}</h3>
            <p>Pasajes {searchTerm ? "Filtrados" : "Activos"}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <FaPlane />
          </div>
          <div className="stat-content">
            <h3>{aereos}</h3>
            <p>Pasajes Aéreos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <FaMapMarkerAlt />
          </div>
          <div className="stat-content">
            <h3>{destinosUnicos}</h3>
            <p>Destinos Únicos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(precioPromedio)}</h3>
            <p>Precio Promedio</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="alert alert-info" style={{ margin: "2rem" }}>
          <p>No se encontraron pasajes con los filtros aplicados</p>
        </div>
      ) : (
        <div className="packages-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="package-card">
              <div className="package-header">
                <div className="package-category">
                  <span className="category-badge category-standard">
                    {item.tipo}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn-icon"
                    onClick={() => handleEditClick(item)}
                    title="Editar pasaje"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteClick(item)}
                    title="Eliminar pasaje"
                    style={{ color: "#e53e3e" }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="package-body">
                <h3 className="package-title">
                  {item.origen} → {item.destino}
                </h3>
                <div className="package-info">
                  {item.aerolinea && (
                    <div className="info-item">
                      <span className="info-icon">
                        <FaPlane />
                      </span>
                      <span>
                        {item.aerolinea}
                        {item.numeroVuelo ? ` ${item.numeroVuelo}` : ""}
                      </span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-icon">
                      <FaCalendarAlt />
                    </span>
                    <span>{formatDate(item.fechaSalida)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">
                      <FaDollarSign />
                    </span>
                    <span>{formatCurrency(item.precio)}</span>
                  </div>
                </div>
              </div>

              <div className="package-footer">
                <div className="package-price">
                  <span className="price-label">Clase</span>
                  <span className="price-value">
                    {item.clase || "Económica"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>

    <PasajeFormModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSuccess={loadItems}
    />

    <PasajeEditModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onSuccess={loadItems}
      pasaje={selectedItem}
    />

    <ConfirmModal
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={confirmDelete}
      title="Eliminar Pasaje"
      message={`¿Estás seguro de que deseas eliminar el pasaje "${itemToDelete?.origen} → ${itemToDelete?.destino}"?`}
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
