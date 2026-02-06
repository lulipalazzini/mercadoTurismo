import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaHotel,
  FaStar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import {
  getAlojamientos,
  deleteAlojamiento,
} from "../../services/alojamientos.service";
import ConfirmModal from "../common/ConfirmModal";
import AlertModal from "../common/AlertModal";
import ServiceDetailModal from "../ServiceDetailModal";
import AlojamientoFormModal from "./AlojamientoFormModal";
import AlojamientoEditModal from "./AlojamientoEditModal";

export default function Alojamientos() {
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
  const [showPreview, setShowPreview] = useState(false);
  const [itemToPreview, setItemToPreview] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getAlojamientos();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los alojamientos");
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

  const handlePreviewClick = (item) => {
    setItemToPreview(item);
    setShowPreview(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteAlojamiento(itemToDelete.id);
      loadItems();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setAlertMessage("Error al eliminar el alojamiento.");
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
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <p style={{ color: "#718096" }}>Cargando alojamientos...</p>
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
            <FaPlus /> Nuevo Alojamiento
          </button>
          <div className="toolbar-actions">
            <div className="search-box-crm">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar alojamientos..."
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
              <FaHotel />
            </div>
            <div className="stat-content">
              <h3>{filteredItems.length}</h3>
              <p>Alojamientos {searchTerm ? "Filtrados" : "Activos"}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <FaStar />
            </div>
            <div className="stat-content">
              <h3>{items.filter((a) => a.estrellas >= 4).length}</h3>
              <p>4+ Estrellas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <FaMapMarkerAlt />
            </div>
            <div className="stat-content">
              <h3>{[...new Set(items.map((a) => a.ubicacion))].length}</h3>
              <p>Ubicaciones</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>
                {items.length > 0
                  ? formatCurrency(
                      Math.round(
                        items.reduce(
                          (sum, a) => sum + Number(a.precioNoche || 0),
                          0,
                        ) / items.length,
                      ),
                    )
                  : "$0"}
              </h3>
              <p>Precio Promedio</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="alert alert-info" style={{ margin: "2rem" }}>
            <p>No se encontraron alojamientos con los filtros aplicados</p>
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
                      title="Editar alojamiento"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteClick(item)}
                      title="Eliminar alojamiento"
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
                        <FaMapMarkerAlt />
                      </span>
                      <span>{item.ubicacion}</span>
                    </div>
                    {item.estrellas && (
                      <div className="info-item">
                        <span className="info-icon">
                          <FaStar />
                        </span>
                        <span>{item.estrellas} estrellas</span>
                      </div>
                    )}
                    <div className="info-item">
                      <span className="info-icon">
                        <FaDollarSign />
                      </span>
                      <span>{formatCurrency(item.precioNoche)}/noche</span>
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
                  <button
                    className="btn-secondary btn-block"
                    onClick={() => handlePreviewClick(item)}
                  >
                    <FaEye /> Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlojamientoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadItems}
      />

      <AlojamientoEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadItems}
        alojamiento={selectedItem}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar Alojamiento"
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

      {showPreview && itemToPreview && (
        <ServiceDetailModal
          item={itemToPreview}
          tipo="alojamiento"
          onClose={() => {
            setShowPreview(false);
            setItemToPreview(null);
          }}
          isPreview={true}
        />
      )}
    </>
  );
}
