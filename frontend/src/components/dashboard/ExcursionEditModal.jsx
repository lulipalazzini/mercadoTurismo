import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateExcursion } from "../../services/excursiones.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function ExcursionEditModal({
  isOpen,
  onClose,
  onSuccess,
  excursion,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    destino: "",
    tipo: "cultural",
    duracion: "",
    precio: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (excursion) {
      setFormData({
        nombre: excursion.nombre || "",
        descripcion: excursion.descripcion || "",
        destino: excursion.destino || "",
        tipo: excursion.tipo || "cultural",
        duracion: excursion.duracion || "",
        precio: excursion.precio || "",
      });
    }
  }, [excursion]);

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
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.destino.trim()) newErrors.destino = "El destino es requerido";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await updateExcursion(excursion.id, formData);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al actualizar la excursión");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      destino: "",
      tipo: "cultural",
      duracion: "",
      precio: "",
    });
    setErrors({});
    setSubmitting(false);
    onClose();
  };

  if (!isOpen || !excursion) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Excursión</h2>
          <button className="btn-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nombre">
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? "error" : ""}`}
                  value={formData.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

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
                />
                {errors.destino && <span className="error-message">{errors.destino}</span>}
              </div>

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
                  <option value="cultural">Cultural</option>
                  <option value="aventura">Aventura</option>
                  <option value="naturaleza">Naturaleza</option>
                  <option value="gastronomica">Gastronómica</option>
                  <option value="deportiva">Deportiva</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="duracion">
                  Duración (horas) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="duracion"
                  name="duracion"
                  className="form-control"
                  value={formData.duracion}
                  onChange={handleChange}
                  min="0.5"
                  step="0.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="precio">
                  Precio (ARS) <span className="required">*</span>
                </label>
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
                <label htmlFor="descripcion">
                  Descripción <span className="required">*</span>
                </label>
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
