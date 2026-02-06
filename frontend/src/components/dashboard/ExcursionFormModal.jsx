import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createExcursion } from "../../services/excursiones.service";
import AlertModal from "../common/AlertModal";
import DestinoAutocomplete from "../common/DestinoAutocomplete";
import ImageUploader from "../ImageUploader";
import "../../styles/modal.css";

export default function ExcursionFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    destino: "",
    tipo: "cultural",
    duracion: "",
    precio: "",
  });

  const [imagenes, setImagenes] = useState([]);
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

    if (!formData.destino.trim()) {
      newErrors.destino = "El destino es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
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

      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("destino", formData.destino);
      formDataToSend.append("tipo", formData.tipo);
      if (formData.duracion)
        formDataToSend.append("duracion", parseInt(formData.duracion));
      if (formData.precio)
        formDataToSend.append("precio", parseFloat(formData.precio));

      imagenes.forEach((imagen) => {
        if (imagen instanceof File) {
          formDataToSend.append("imagenes", imagen);
        }
      });

      await createExcursion(formDataToSend);

      setFormData({
        nombre: "",
        descripcion: "",
        destino: "",
        tipo: "cultural",
        duracion: "",
        precio: "",
      });
      setImagenes([]);
      setErrors({});

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(
        error.message ||
          "Error al crear la excursión. Por favor intenta nuevamente.",
      );
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
    setImagenes([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nueva Excursión</h2>
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
                  Nombre de la Excursión <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? "error" : ""}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre de la excursión"
                />
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
                )}
              </div>

              {/* Destino */}
              <DestinoAutocomplete
                label="Destino"
                name="destino"
                value={formData.destino}
                onChange={handleChange}
                placeholder="Ciudad o lugar"
                error={errors.destino}
                required
              />

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
                  <option value="cultural">Cultural</option>
                  <option value="aventura">Aventura</option>
                  <option value="naturaleza">Naturaleza</option>
                  <option value="gastronomica">Gastronómica</option>
                  <option value="deportiva">Deportiva</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              {/* Duración */}
              <div className="form-group">
                <label htmlFor="duracion">
                  Duración (horas) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="duracion"
                  name="duracion"
                  min="0.5"
                  step="0.5"
                  className="form-control"
                  value={formData.duracion}
                  onChange={handleChange}
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

              {/* Descripción */}
              <div className="form-group full-width">
                <label htmlFor="descripcion">
                  Descripción <span className="required">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="4"
                  className={`form-control ${
                    errors.descripcion ? "error" : ""
                  }`}
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción de la excursión"
                />
                {errors.descripcion && (
                  <span className="error-message">{errors.descripcion}</span>
                )}
              </div>

              {/* Imágenes */}
              <div className="form-group full-width">
                <label>Imágenes de la Excursión (máximo 6)</label>
                <ImageUploader
                  images={imagenes}
                  onChange={setImagenes}
                  maxImages={6}
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
              {submitting ? "Creando..." : "Crear Excursión"}
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
