import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createAlojamiento } from "../../services/alojamientos.service";
import AlertModal from "../common/AlertModal";
import DestinoAutocomplete from "../common/DestinoAutocomplete";
import "../../styles/modal.css";

export default function AlojamientoFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "hotel",
    ubicacion: "",
    direccion: "",
    estrellas: 3,
    descripcion: "",
    precioNoche: "",
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es requerida";
    }

    if (!formData.precioNoche || parseFloat(formData.precioNoche) <= 0) {
      newErrors.precioNoche = "El precio debe ser mayor a 0";
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
      await createAlojamiento(formData);

      setFormData({
        nombre: "",
        tipo: "hotel",
        ubicacion: "",
        direccion: "",
        estrellas: 3,
        descripcion: "",
        precioNoche: "",
      });
      setErrors({});

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear alojamiento:", error);
      setAlertMessage(
        "Error al crear el alojamiento. Por favor intenta nuevamente."
      );
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      tipo: "hotel",
      ubicacion: "",
      direccion: "",
      estrellas: 3,
      descripcion: "",
      precioNoche: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo Alojamiento</h2>
          <button className="btn-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Nombre */}
              <div className="form-group full-width">
                <label htmlFor="nombre">
                  Nombre del Alojamiento <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? "error" : ""}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del alojamiento"
                />
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
                )}
              </div>

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
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostel</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="resort">Resort</option>
                  <option value="cabaña">Cabaña</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Estrellas */}
              <div className="form-group">
                <label htmlFor="estrellas">Estrellas</label>
                <select
                  id="estrellas"
                  name="estrellas"
                  className="form-control"
                  value={formData.estrellas}
                  onChange={handleChange}
                >
                  <option value="1">1 Estrella</option>
                  <option value="2">2 Estrellas</option>
                  <option value="3">3 Estrellas</option>
                  <option value="4">4 Estrellas</option>
                  <option value="5">5 Estrellas</option>
                </select>
              </div>

              {/* Ubicación */}
              <DestinoAutocomplete
                label="Ubicación"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Ciudad, País"
                error={errors.ubicacion}
                required
              />

              {/* Precio por Noche */}
              <div className="form-group">
                <label htmlFor="precioNoche">
                  Precio por Noche (ARS) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precioNoche"
                  name="precioNoche"
                  className={`form-control ${
                    errors.precioNoche ? "error" : ""
                  }`}
                  value={formData.precioNoche}
                  onChange={handleChange}
                  placeholder="Precio"
                  min="0"
                  step="0.01"
                />
                {errors.precioNoche && (
                  <span className="error-message">{errors.precioNoche}</span>
                )}
              </div>

              {/* Dirección */}
              <div className="form-group full-width">
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  className="form-control"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Dirección completa"
                />
              </div>

              {/* Descripción */}
              <div className="form-group full-width">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="4"
                  className="form-control"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del alojamiento"
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
              {submitting ? "Creando..." : "Crear Alojamiento"}
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
