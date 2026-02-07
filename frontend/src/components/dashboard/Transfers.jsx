import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaBus,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUsers,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { getTransfers, deleteTransfer } from "../../services/transfers.service";
import ConfirmModal from "../common/ConfirmModal";
import AlertModal from "../common/AlertModal";
import ServiceDetailModal from "../ServiceDetailModal";
import TransferFormModal from "./TransferFormModal";
import TransferEditModal from "./TransferEditModal";

export default function Transfers() {
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
      const data = await getTransfers();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los transfers");
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
      await deleteTransfer(itemToDelete.id);
      loadItems();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setAlertMessage("Error al eliminar el transfer.");
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

  const filteredItems = items.filter(
    (item) =>
      item.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destino.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calcular estadísticas
  const tiposUnicos = [...new Set(items.map((t) => t.tipo))].length;
  const vehiculosUnicos = [...new Set(items.map((t) => t.vehiculo))].length;
  const capacidadTotal = items.reduce(
    (sum, t) => sum + Number(t.capacidadPasajeros || 0),
    0,
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
          <p style={{ color: "#718096" }}>Cargando transfers...</p>
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
            <FaPlus /> Nuevo Transfer
          </button>
          <div className="toolbar-actions">
            <div className="search-box-crm">
              <input
                type="text"
                placeholder="Buscar transfers..."
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
              <FaBus />
            </div>
            <div className="stat-content">
              <h3>{filteredItems.length}</h3>
              <p>Transfers {searchTerm ? "Filtrados" : "Activos"}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <FaBus />
            </div>
            <div className="stat-content">
              <h3>{tiposUnicos}</h3>
              <p>Tipos de Transfer</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <FaBus />
            </div>
            <div className="stat-content">
              <h3>{vehiculosUnicos}</h3>
              <p>Vehículos Disponibles</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{capacidadTotal}</h3>
              <p>Capacidad Total</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="alert alert-info" style={{ margin: "2rem" }}>
            <p>No se encontraron transfers con los filtros aplicados</p>
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
                      title="Editar transfer"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteClick(item)}
                      title="Eliminar transfer"
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
                    <div className="info-item">
                      <span className="info-icon">
                        <FaBus />
                      </span>
                      <span>Vehículo: {item.vehiculo}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">
                        <FaUsers />
                      </span>
                      <span>{item.capacidadPasajeros} pasajeros</span>
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

      <TransferFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadItems}
      />

      <TransferEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadItems}
        transfer={selectedItem}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar Transfer"
        message={`¿Estás seguro de que deseas eliminar el transfer "${itemToDelete?.origen} → ${itemToDelete?.destino}"?`}
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
          tipo="transfer"
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
