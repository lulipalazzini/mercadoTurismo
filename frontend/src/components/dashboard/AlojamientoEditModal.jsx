import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateAlojamiento } from "../../services/alojamientos.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function AlojamientoEditModal({
  isOpen,
  onClose,
  onSuccess,
  alojamiento,
}) {
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

  useEffect(() => {
    if (alojamiento) {
      setFormData({
        nombre: alojamiento.nombre || "",
        tipo: alojamiento.tipo || "hotel",
        ubicacion: alojamiento.ubicacion || "",
        direccion: alojamiento.direccion || "",
        estrellas: alojamiento.estrellas || 3,
        descripcion: alojamiento.descripcion || "",
        precioNoche: alojamiento.precioNoche || "",
      });
    }
  }, [alojamiento]);

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
      await updateAlojamiento(alojamiento.id, formData);

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al actualizar alojamiento:", error);
      setAlertMessage(
        "Error al actualizar el alojamiento. Por favor intenta nuevamente."
      );
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !alojamiento) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Alojamiento</h2>
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
              <div className="form-group">
                <label htmlFor="ubicacion">
                  Ubicación <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  className={`form-control ${errors.ubicacion ? "error" : ""}`}
                  value={formData.ubicacion}
                  onChange={handleChange}
                />
                {errors.ubicacion && (
                  <span className="error-message">{errors.ubicacion}</span>
                )}
              </div>

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
