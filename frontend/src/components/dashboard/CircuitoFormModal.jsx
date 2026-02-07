import React, { useState } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { createCircuito } from "../../services/circuitos.service";
import AlertModal from "../common/AlertModal";
import DestinoAutocomplete from "../common/DestinoAutocomplete";
import ImageUploader from "../ImageUploader";
import "../../styles/modal.css";

export default function CircuitoFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    duracion: "",
    precio: "",
  });

  const [destinos, setDestinos] = useState([]);
  const [nuevoDestino, setNuevoDestino] = useState("");
  const [incluye, setIncluye] = useState([]);
  const [nuevoIncluye, setNuevoIncluye] = useState("");
  const [noIncluye, setNoIncluye] = useState([]);
  const [nuevoNoIncluye, setNuevoNoIncluye] = useState("");
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

  const handleAddDestino = () => {
    if (nuevoDestino.trim()) {
      setDestinos([...destinos, nuevoDestino.trim()]);
      setNuevoDestino("");
    }
  };

  const handleRemoveDestino = (index) => {
    setDestinos(destinos.filter((_, i) => i !== index));
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

  const handleAddNoIncluye = () => {
    if (nuevoNoIncluye.trim()) {
      setNoIncluye([...noIncluye, nuevoNoIncluye.trim()]);
      setNuevoNoIncluye("");
    }
  };

  const handleRemoveNoIncluye = (index) => {
    setNoIncluye(noIncluye.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!formData.duracion || parseInt(formData.duracion) <= 0) {
      newErrors.duracion = "La duración debe ser mayor a 0";
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
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
      formDataToSend.append("duracion", parseInt(formData.duracion));
      formDataToSend.append("precio", parseFloat(formData.precio));
      formDataToSend.append("destinos", JSON.stringify(destinos));
      formDataToSend.append("incluye", JSON.stringify(incluye));
      formDataToSend.append("noIncluye", JSON.stringify(noIncluye));

      imagenes.forEach((imagen) => {
        if (imagen instanceof File) {
          formDataToSend.append("imagenes", imagen);
        }
      });

      await createCircuito(formDataToSend);

      setFormData({
        nombre: "",
        descripcion: "",
        duracion: "",
        precio: "",
      });
      setDestinos([]);
      setIncluye([]);
      setNoIncluye([]);
      setImagenes([]);
      setErrors({});

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(
        error.message ||
          "Error al crear el circuito. Por favor intenta nuevamente.",
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
      duracion: "",
      precio: "",
    });
    setDestinos([]);
    setIncluye([]);
    setNoIncluye([]);
    setImagenes([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo Circuito</h2>
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
                  Nombre del Circuito <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? "error" : ""}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del circuito"
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
                  rows="3"
                  className={`form-control ${
                    errors.descripcion ? "error" : ""
                  }`}
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del circuito"
                />
                {errors.descripcion && (
                  <span className="error-message">{errors.descripcion}</span>
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
                  Precio (ARS) <span className="required">*</span>
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
                  placeholder="Precio"
                />
                {errors.precio && (
                  <span className="error-message">{errors.precio}</span>
                )}
              </div>

              {/* Destinos (Array) */}
              <div className="form-group full-width">
                <label>Destinos</label>
                <div className="array-input">
                  <DestinoAutocomplete
                    label=""
                    name="nuevoDestino"
                    value={nuevoDestino}
                    onChange={(e) => setNuevoDestino(e.target.value)}
                    placeholder="Ej: París, Francia"
                    error={null}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleAddDestino}
                    style={{ marginTop: "0.5rem" }}
                  >
                    <FaPlus /> Agregar
                  </button>
                </div>
                <div className="items-list">
                  {destinos.map((item, index) => (
                    <div key={index} className="item-chip">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDestino(index)}
                        className="btn-remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
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

              {/* No Incluye (Array) */}
              <div className="form-group full-width">
                <label>No Incluye</label>
                <div className="array-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Vuelos, Comidas, Excursiones opcionales..."
                    value={nuevoNoIncluye}
                    onChange={(e) => setNuevoNoIncluye(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNoIncluye();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleAddNoIncluye}
                  >
                    <FaPlus /> Agregar
                  </button>
                </div>
                <div className="items-list">
                  {noIncluye.map((item, index) => (
                    <div key={index} className="item-chip">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNoIncluye(index)}
                        className="btn-remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Imágenes */}
              <div className="form-group full-width">
                <label>Imágenes del Circuito</label>
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
              {submitting ? "Creando..." : "Crear Circuito"}
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
