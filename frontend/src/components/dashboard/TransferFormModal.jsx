import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createTransfer } from "../../services/transfers.service";
import AlertModal from "../common/AlertModal";

export default function TransferFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    tipo: "aeropuerto-hotel",
    origen: "",
    destino: "",
    vehiculo: "sedan",
    capacidadPasajeros: 4,
    precio: "",
    duracionEstimada: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.origen.trim() || !formData.destino.trim()) {
      setAlertData({
        type: "error",
        message: "Origen y destino son requeridos",
      });
      setShowAlert(true);
      return;
    }

    try {
      await createTransfer(formData);
      setAlertData({
        type: "success",
        message: "Transfer creado exitosamente",
      });
      setShowAlert(true);

      setFormData({
        tipo: "aeropuerto-hotel",
        origen: "",
        destino: "",
        vehiculo: "sedan",
        capacidadPasajeros: 4,
        precio: "",
        duracionEstimada: "",
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setAlertData({
        type: "error",
        message: "Error al crear el transfer",
      });
      setShowAlert(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Nuevo Transfer</h2>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="aeropuerto-hotel">Aeropuerto → Hotel</option>
                  <option value="hotel-aeropuerto">Hotel → Aeropuerto</option>
                  <option value="interhotel">Inter-Hotel</option>
                  <option value="punto-a-punto">Punto a Punto</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vehículo *</label>
                <select
                  name="vehiculo"
                  value={formData.vehiculo}
                  onChange={handleChange}
                  required
                >
                  <option value="sedan">Sedan</option>
                  <option value="van">Van</option>
                  <option value="minibus">Minibus</option>
                  <option value="bus">Bus</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Origen *</label>
                <input
                  type="text"
                  name="origen"
                  value={formData.origen}
                  onChange={handleChange}
                  placeholder="Punto de origen"
                  required
                />
              </div>

              <div className="form-group">
                <label>Destino *</label>
                <input
                  type="text"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  placeholder="Punto de destino"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Capacidad de Pasajeros *</label>
                <input
                  type="number"
                  name="capacidadPasajeros"
                  value={formData.capacidadPasajeros}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duración Estimada (minutos)</label>
                <input
                  type="number"
                  name="duracionEstimada"
                  value={formData.duracionEstimada}
                  onChange={handleChange}
                  min="1"
                  placeholder="Ej: 45"
                />
              </div>

              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precio"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Crear Transfer
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertData.type === "success" ? "Éxito" : "Error"}
        message={alertData.message}
        type={alertData.type}
      />
    </>
  );
}
