import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaUsers,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  getSalidasGrupales,
  deleteSalidaGrupal,
} from "../../services/salidasGrupales.service";
import ConfirmModal from "../common/ConfirmModal";
import AlertModal from "../common/AlertModal";
import SalidaGrupalFormModal from "./SalidaGrupalFormModal";
import SalidaGrupalEditModal from "./SalidaGrupalEditModal";

export default function SalidasGrupales() {
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
      const data = await getSalidasGrupales();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las salidas grupales");
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
      await deleteSalidaGrupal(itemToDelete.id);
      loadItems();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setAlertMessage("Error al eliminar la salida grupal.");
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

  const filteredItems = items.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas
  const today = new Date();
  const proximasSalidas = items.filter(
    (s) => new Date(s.fechaSalida) > today
  ).length;
  const destinosUnicos = [...new Set(items.map((s) => s.destino))].length;
  const cuposDisponibles = items.reduce(
    (sum, s) => sum + (Number(s.cuposDisponibles) || 0),
    0
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
          <p style={{ color: "#718096" }}>Cargando salidas grupales...</p>
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
            <FaPlus /> Nueva Salida Grupal
          </button>
          <div className="toolbar-actions">
            <div className="search-box-crm">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar salidas grupales..."
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
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{filteredItems.length}</h3>
              <p>Salidas {searchTerm ? "Filtradas" : "Activas"}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>{proximasSalidas}</h3>
              <p>Próximas Salidas</p>
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
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{cuposDisponibles}</h3>
              <p>Cupos Disponibles</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="alert alert-info" style={{ margin: "2rem" }}>
            <p>No se encontraron salidas grupales con los filtros aplicados</p>
          </div>
        ) : (
          <div className="packages-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="package-card">
                <div className="package-header">
                  <div className="package-category">
                    <span className="category-badge category-standard">
                      Salida Grupal
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleEditClick(item)}
                      title="Editar salida grupal"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteClick(item)}
                      title="Eliminar salida grupal"
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
                      <span>{item.destino}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">
                        <FaCalendarAlt />
                      </span>
                      <span>
                        {formatDate(item.fechaSalida)} - {item.duracion} días
                      </span>
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
                    <span className="price-label">Regreso</span>
                    <span className="price-value">
                      {formatDate(item.fechaRegreso)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SalidaGrupalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadItems}
      />

      <SalidaGrupalEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadItems}
        salidaGrupal={selectedItem}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar Salida Grupal"
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
