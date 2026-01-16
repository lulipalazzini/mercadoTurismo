import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createTransfer } from "../../services/transfers.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

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

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.origen.trim()) {
      newErrors.origen = "El origen es requerido";
    }

    if (!formData.destino.trim()) {
      newErrors.destino = "El destino es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      await createTransfer(formData);

      setFormData({
        tipo: "aeropuerto-hotel",
        origen: "",
        destino: "",
        vehiculo: "sedan",
        capacidadPasajeros: 4,
        precio: "",
        duracionEstimada: "",
      });
      setErrors({});

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al crear el transfer. Por favor intenta nuevamente.");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      tipo: "aeropuerto-hotel",
      origen: "",
      destino: "",
      vehiculo: "sedan",
      capacidadPasajeros: 4,
      precio: "",
      duracionEstimada: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo Transfer</h2>
          <button className="btn-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Tipo */}
              <div className="form-group">
                <label htmlFor="tipo">
                  Tipo <span className="required">*</span>
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  className="form-control"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="aeropuerto-hotel">Aeropuerto → Hotel</option>
                  <option value="hotel-aeropuerto">Hotel → Aeropuerto</option>
                  <option value="interhotel">Inter-Hotel</option>
                  <option value="punto-a-punto">Punto a Punto</option>
                </select>
              </div>

              {/* Vehículo */}
              <div className="form-group">
                <label htmlFor="vehiculo">
                  Vehículo <span className="required">*</span>
                </label>
                <select
                  id="vehiculo"
                  name="vehiculo"
                  className="form-control"
                  value={formData.vehiculo}
                  onChange={handleChange}
                >
                  <option value="sedan">Sedan</option>
                  <option value="van">Van</option>
                  <option value="minibus">Minibus</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              {/* Origen */}
              <div className="form-group">
                <label htmlFor="origen">
                  Origen <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="origen"
                  name="origen"
                  className={`form-control ${errors.origen ? "error" : ""}`}
                  value={formData.origen}
                  onChange={handleChange}
                  placeholder="Punto de origen"
                />
                {errors.origen && (
                  <span className="error-message">{errors.origen}</span>
                )}
              </div>

              {/* Destino */}
              <div className="form-group">
                <label htmlFor="destino">
                  Destino <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="destino"
                  name="destino"
                  className={`form-control ${errors.destino ? "error" : ""}`}
                  value={formData.destino}
                  onChange={handleChange}
                  placeholder="Punto de destino"
                />
                {errors.destino && (
                  <span className="error-message">{errors.destino}</span>
                )}
              </div>

              {/* Capacidad de Pasajeros */}
              <div className="form-group">
                <label htmlFor="capacidadPasajeros">
                  Capacidad de Pasajeros <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="capacidadPasajeros"
                  name="capacidadPasajeros"
                  className="form-control"
                  value={formData.capacidadPasajeros}
                  onChange={handleChange}
                  min="1"
                  max="50"
                />
              </div>

              {/* Duración Estimada */}
              <div className="form-group">
                <label htmlFor="duracionEstimada">
                  Duración Estimada (minutos)
                </label>
                <input
                  type="number"
                  id="duracionEstimada"
                  name="duracionEstimada"
                  className="form-control"
                  value={formData.duracionEstimada}
                  onChange={handleChange}
                  min="1"
                  placeholder="Ej: 45"
                />
              </div>

              {/* Precio */}
              <div className="form-group">
                <label htmlFor="precio">
                  Precio (ARS) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  min="0"
                  step="0.01"
                  className="form-control"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precio"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creando..." : "Crear Transfer"}
            </button>
          </div>
        </form>
      </div>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
        type="error"
      />
    </div>
  );
}
