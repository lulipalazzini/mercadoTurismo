import React, { useState } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { createSalidaGrupal } from "../../services/salidasGrupales.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function SalidaGrupalFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    destino: "",
    fechaSalida: "",
    fechaRegreso: "",
    duracion: "",
    precio: "",
  });

  const [incluye, setIncluye] = useState([]);
  const [nuevoIncluye, setNuevoIncluye] = useState("");

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

  const handleAddIncluye = () => {
    if (nuevoIncluye.trim()) {
      setIncluye([...incluye, nuevoIncluye.trim()]);
      setNuevoIncluye("");
    }
  };

  const handleRemoveIncluye = (index) => {
    setIncluye(incluye.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
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

      const dataToSend = {
        ...formData,
        incluye: incluye,
      };

      await createSalidaGrupal(dataToSend);

      setFormData({
        nombre: "",
        descripcion: "",
        destino: "",
        fechaSalida: "",
        fechaRegreso: "",
        duracion: "",
        precio: "",
      });
      setIncluye([]);
      setErrors({});

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(
        "Error al crear la salida grupal. Por favor intenta nuevamente."
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
      fechaSalida: "",
      fechaRegreso: "",
      duracion: "",
      precio: "",
    });
    setIncluye([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nueva Salida Grupal</h2>
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
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? "error" : ""}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre de la salida grupal"
                />
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
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
                  placeholder="Destino principal"
                />
                {errors.destino && (
                  <span className="error-message">{errors.destino}</span>
                )}
              </div>

              {/* Duracion */}
              <div className="form-group">
                <label htmlFor="duracion">
                  Duración (días) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="duracion"
                  name="duracion"
                  className="form-control"
                  value={formData.duracion}
                  onChange={handleChange}
                  min="1"
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
                  rows="3"
                  className={`form-control ${
                    errors.descripcion ? "error" : ""
                  }`}
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción de la salida grupal"
                />
                {errors.descripcion && (
                  <span className="error-message">{errors.descripcion}</span>
                )}
              </div>

              {/* Fecha Salida */}
              <div className="form-group">
                <label htmlFor="fechaSalida">
                  Fecha Salida <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaSalida"
                  name="fechaSalida"
                  className="form-control"
                  value={formData.fechaSalida}
                  onChange={handleChange}
                />
              </div>

              {/* Fecha Regreso */}
              <div className="form-group">
                <label htmlFor="fechaRegreso">
                  Fecha Regreso <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaRegreso"
                  name="fechaRegreso"
                  className="form-control"
                  value={formData.fechaRegreso}
                  onChange={handleChange}
                />
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
                  className="form-control"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precio"
                />
              </div>

              {/* Incluye (Array) */}
              <div className="form-group full-width">
                <label>Incluye</label>
                <div className="array-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Alojamiento, Desayunos, Traslados..."
                    value={nuevoIncluye}
                    onChange={(e) => setNuevoIncluye(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIncluye();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleAddIncluye}
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
                        onClick={() => handleRemoveIncluye(index)}
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
              {submitting ? "Creando..." : "Crear Salida Grupal"}
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
