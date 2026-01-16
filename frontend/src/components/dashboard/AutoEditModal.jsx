import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateAuto } from "../../services/autos.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function AutoEditModal({ isOpen, onClose, onSuccess, auto }) {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    categoria: "economico",
    año: new Date().getFullYear(),
    capacidadPasajeros: 4,
    transmision: "automatico",
    precio: "",
    descripcion: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (auto) {
      setFormData({
        marca: auto.marca || "",
        modelo: auto.modelo || "",
        categoria: auto.categoria || "economico",
        año: auto.año || new Date().getFullYear(),
        capacidadPasajeros: auto.capacidadPasajeros || 4,
        transmision: auto.transmision || "automatico",
        precio: auto.precio || "",
        descripcion: auto.descripcion || "",
      });
    }
  }, [auto]);

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

    if (!formData.marca.trim()) {
      newErrors.marca = "La marca es requerida";
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = "El modelo es requerido";
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
      await updateAuto(auto.id, formData);

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al actualizar el auto. Por favor intenta nuevamente.");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !auto) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Auto</h2>
          <button className="btn-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="marca">
                  Marca <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="marca"
                  name="marca"
                  className={`form-control ${errors.marca ? "error" : ""}`}
                  value={formData.marca}
                  onChange={handleChange}
                />
                {errors.marca && <span className="error-message">{errors.marca}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="modelo">
                  Modelo <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="modelo"
                  name="modelo"
                  className={`form-control ${errors.modelo ? "error" : ""}`}
                  value={formData.modelo}
                  onChange={handleChange}
                />
                {errors.modelo && <span className="error-message">{errors.modelo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="categoria">
                  Categoría <span className="required">*</span>
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  className="form-control"
                  value={formData.categoria}
                  onChange={handleChange}
                >
                  <option value="economico">Económico</option>
                  <option value="compacto">Compacto</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="lujo">Lujo</option>
                  <option value="van">Van</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transmision">
                  Transmisión <span className="required">*</span>
                </label>
                <select
                  id="transmision"
                  name="transmision"
                  className="form-control"
                  value={formData.transmision}
                  onChange={handleChange}
                >
                  <option value="manual">Manual</option>
                  <option value="automatico">Automático</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="año">
                  Año <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="año"
                  name="año"
                  className="form-control"
                  value={formData.año}
                  onChange={handleChange}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>

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
                  max="12"
                />
              </div>

              <div className="form-group">
                <label htmlFor="precio">Precio por Día (ARS)</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  className="form-control"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="3"
                  className="form-control"
                  value={formData.descripcion}
                  onChange={handleChange}
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
              {submitting ? "Guardando..." : "Guardar Cambios"}
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
