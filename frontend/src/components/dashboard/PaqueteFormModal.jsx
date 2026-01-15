import React, { useState } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { createPaquete } from "../../services/paquetes.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function PaqueteFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    destino: "",
    duracion: "",
    precio: "",
    cupoMaximo: "",
    fechaInicio: "",
    fechaFin: "",
    imagen: "",
  });

  const [incluye, setIncluye] = useState([]);
  const [nuevoItem, setNuevoItem] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddItem = () => {
    if (nuevoItem.trim()) {
      setIncluye([...incluye, nuevoItem.trim()]);
      setNuevoItem("");
    }
  };

  const handleRemoveItem = (index) => {
    setIncluye(incluye.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "Mínimo 3 caracteres";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = "Mínimo 10 caracteres";
    }

    if (!formData.destino.trim()) {
      newErrors.destino = "El destino es requerido";
    }

    if (!formData.duracion) {
      newErrors.duracion = "La duración es requerida";
    } else if (parseInt(formData.duracion) < 1) {
      newErrors.duracion = "Mínimo 1 día";
    }

    if (!formData.precio) {
      newErrors.precio = "El precio es requerido";
    } else if (parseFloat(formData.precio) < 0) {
      newErrors.precio = "El precio debe ser positivo";
    }

    if (!formData.cupoMaximo) {
      newErrors.cupoMaximo = "El cupo es requerido";
    } else if (parseInt(formData.cupoMaximo) < 1) {
      newErrors.cupoMaximo = "Mínimo 1 persona";
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es requerida";
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = "La fecha de fin es requerida";
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

      const paqueteData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        destino: formData.destino,
        duracion: parseInt(formData.duracion),
        precio: parseFloat(formData.precio),
        cupoMaximo: parseInt(formData.cupoMaximo),
        cupoDisponible: parseInt(formData.cupoMaximo),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        incluye: incluye,
        imagen: formData.imagen || null,
        activo: true,
      };

      await createPaquete(paqueteData);

      // Reset form
      setFormData({
        nombre: "",
        descripcion: "",
        destino: "",
        duracion: "",
        precio: "",
        cupoMaximo: "",
        fechaInicio: "",
        fechaFin: "",
        imagen: "",
      });
      setIncluye([]);
      setNuevoItem("");
      setErrors({});

      // Notificar éxito
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear paquete:", error);
      setAlertMessage(
        "Error al crear el paquete. Por favor intenta nuevamente."
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
      duracion: "",
      precio: "",
      cupoMaximo: "",
      fechaInicio: "",
      fechaFin: "",
      imagen: "",
    });
    setIncluye([]);
    setNuevoItem("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Nuevo Paquete</h2>
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
                  Nombre del Paquete <span className="required">*</span>
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
                />
                {errors.descripcion && (
                  <span className="error-message">{errors.descripcion}</span>
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
                />
                {errors.destino && (
                  <span className="error-message">{errors.destino}</span>
                )}
              </div>

              {/* Duración */}
              <div className="form-group">
                <label htmlFor="duracion">
                  Duración (días) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="duracion"
                  name="duracion"
                  min="1"
                  className={`form-control ${errors.duracion ? "error" : ""}`}
                  value={formData.duracion}
                  onChange={handleChange}
                />
                {errors.duracion && (
                  <span className="error-message">{errors.duracion}</span>
                )}
              </div>

              {/* Precio */}
              <div className="form-group">
                <label htmlFor="precio">
                  Precio por persona (ARS) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  min="0"
                  step="0.01"
                  className={`form-control ${errors.precio ? "error" : ""}`}
                  value={formData.precio}
                  onChange={handleChange}
                />
                {errors.precio && (
                  <span className="error-message">{errors.precio}</span>
                )}
              </div>

              {/* Cupo Máximo */}
              <div className="form-group">
                <label htmlFor="cupoMaximo">
                  Cupo Máximo <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="cupoMaximo"
                  name="cupoMaximo"
                  min="1"
                  className={`form-control ${errors.cupoMaximo ? "error" : ""}`}
                  value={formData.cupoMaximo}
                  onChange={handleChange}
                />
                {errors.cupoMaximo && (
                  <span className="error-message">{errors.cupoMaximo}</span>
                )}
              </div>

              {/* Fecha Inicio */}
              <div className="form-group">
                <label htmlFor="fechaInicio">
                  Fecha de Inicio <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  className={`form-control ${
                    errors.fechaInicio ? "error" : ""
                  }`}
                  value={formData.fechaInicio}
                  onChange={handleChange}
                />
                {errors.fechaInicio && (
                  <span className="error-message">{errors.fechaInicio}</span>
                )}
              </div>

              {/* Fecha Fin */}
              <div className="form-group">
                <label htmlFor="fechaFin">
                  Fecha de Fin <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  className={`form-control ${errors.fechaFin ? "error" : ""}`}
                  value={formData.fechaFin}
                  onChange={handleChange}
                />
                {errors.fechaFin && (
                  <span className="error-message">{errors.fechaFin}</span>
                )}
              </div>

              {/* URL de Imagen */}
              <div className="form-group full-width">
                <label htmlFor="imagen">URL de Imagen</label>
                <input
                  type="url"
                  id="imagen"
                  name="imagen"
                  className="form-control"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imagen}
                  onChange={handleChange}
                />
              </div>

              {/* Incluye (Array) */}
              <div className="form-group full-width">
                <label>Incluye</label>
                <div className="array-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Piscina, Desayuno, Traslados..."
                    value={nuevoItem}
                    onChange={(e) => setNuevoItem(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddItem();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleAddItem}
                  >
                    <FaPlus /> Agregar
                  </button>
                </div>
                <div className="items-list">
                  {incluye.map((item, index) => (
                    <div key={index} className="item-chip">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="btn-remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
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
              {submitting ? "Creando..." : "Crear Paquete"}
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
