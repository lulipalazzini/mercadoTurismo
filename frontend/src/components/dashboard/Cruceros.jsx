import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaShip,
  FaMapMarkedAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getCruceros, deleteCrucero } from "../../services/cruceros.service";
import ServiceDetailModal from "../ServiceDetailModal";
import ConfirmModal from "../common/ConfirmModal";
import AlertModal from "../common/AlertModal";
import CruceroFormModal from "./CruceroFormModal";
import CruceroEditModal from "./CruceroEditModal";

export default function Cruceros() {
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
      const data = await getCruceros();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los cruceros");
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
      await deleteCrucero(itemToDelete.id);
      loadItems();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setAlertMessage("Error al eliminar el crucero.");
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
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.naviera.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calcular estadísticas
  const navierasUnicas = [...new Set(items.map((c) => c.naviera))].length;
  const today = new Date();
  const proximasSalidas = items.filter(
    (c) => new Date(c.fechaSalida) > today,
  ).length;
  const capacidadPromedio =
    items.length > 0
      ? Math.round(
          items.reduce((sum, c) => sum + Number(c.capacidad || 0), 0) /
            items.length,
        )
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
          <p style={{ color: "#718096" }}>Cargando cruceros...</p>
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
            <FaPlus /> Nuevo Crucero
          </button>
          <div className="toolbar-actions">
            <div className="search-box-crm">
              <input
                type="text"
                placeholder="Buscar cruceros..."
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
              <FaShip />
            </div>
            <div className="stat-content">
              <h3>{filteredItems.length}</h3>
              <p>Cruceros {searchTerm ? "Filtrados" : "Activos"}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <FaShip />
            </div>
            <div className="stat-content">
              <h3>{navierasUnicas}</h3>
              <p>Navieras Únicas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>{proximasSalidas}</h3>
              <p>Próximas Salidas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <FaMapMarkedAlt />
            </div>
            <div className="stat-content">
              <h3>{capacidadPromedio}</h3>
              <p>Capacidad Promedio</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="alert alert-info" style={{ margin: "2rem" }}>
            <p>No se encontraron cruceros con los filtros aplicados</p>
          </div>
        ) : (
          <div className="packages-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="package-card">
                <div className="package-header">
                  <div className="package-category">
                    <span className="category-badge category-standard">
                      {item.naviera}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleEditClick(item)}
                      title="Editar crucero"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteClick(item)}
                      title="Eliminar crucero"
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
                        <FaShip />
                      </span>
                      <span>Barco: {item.barco}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">
                        <FaCalendarAlt />
                      </span>
                      <span>
                        {item.duracion} noches - {formatDate(item.fechaSalida)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">
                        <FaDollarSign />
                      </span>
                      <span>Desde {formatCurrency(item.precioDesde)}</span>
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
                  <div className="package-actions">
                    <button
                      className="btn-icon-action"
                      onClick={() => handlePreviewClick(item)}
                      title="Ver vista previa"
                    >
                      <FaShip />
                    </button>
                    <button
                      className="btn-icon-action"
                      onClick={() => handleEditClick(item)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon-action danger"
                      onClick={() => handleDeleteClick(item)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="package-price">
                    <span className="price-label">Itinerario</span>
                    <span className="price-value">
                      {Array.isArray(item.itinerario)
                        ? item.itinerario.length
                        : 0}{" "}
                      puertos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CruceroFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadItems}
      />

      <CruceroEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadItems}
        crucero={selectedItem}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar Crucero"
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
          tipo="crucero"
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
