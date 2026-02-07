import React, { useState } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { createCrucero } from "../../services/cruceros.service";
import AlertModal from "../common/AlertModal";
import DestinoAutocomplete from "../common/DestinoAutocomplete";
import ImageUploader from "../ImageUploader";
import "../../styles/modal.css";

export default function CruceroFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    naviera: "",
    barco: "",
    descripcion: "",
    duracion: "",
    fechaSalida: "",
    precio: "",
  });

  const [itinerario, setItinerario] = useState([]);
  const [nuevoItinerario, setNuevoItinerario] = useState("");
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

  const handleAddItinerario = () => {
    if (nuevoItinerario.trim()) {
      setItinerario([...itinerario, nuevoItinerario.trim()]);
      setNuevoItinerario("");
    }
  };

  const handleRemoveItinerario = (index) => {
    setItinerario(itinerario.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.naviera.trim()) {
      newErrors.naviera = "La naviera es requerida";
    }

    if (!formData.barco.trim()) {
      newErrors.barco = "El barco es requerido";
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
      formDataToSend.append("naviera", formData.naviera);
      formDataToSend.append("barco", formData.barco);
      if (formData.descripcion)
        formDataToSend.append("descripcion", formData.descripcion);
      if (formData.duracion)
        formDataToSend.append("duracion", parseInt(formData.duracion));
      if (formData.fechaSalida)
        formDataToSend.append("fechaSalida", formData.fechaSalida);
      if (formData.precio)
        formDataToSend.append("precio", parseFloat(formData.precio));
      formDataToSend.append("itinerario", JSON.stringify(itinerario));

      imagenes.forEach((imagen) => {
        if (imagen instanceof File) {
          formDataToSend.append("imagenes", imagen);
        }
      });

      await createCrucero(formDataToSend);

      setFormData({
        nombre: "",
        naviera: "",
        barco: "",
        descripcion: "",
        duracion: "",
        fechaSalida: "",
        precio: "",
      });
      setItinerario([]);
      setImagenes([]);
      setErrors({});

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(
        error.message ||
          "Error al crear el crucero. Por favor intenta nuevamente.",
      );
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      naviera: "",
      barco: "",
      descripcion: "",
      duracion: "",
      fechaSalida: "",
      precio: "",
    });
    setItinerario([]);
    setImagenes([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo Crucero</h2>
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
                  Nombre del Crucero <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? "error" : ""}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del crucero"
                />
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
                )}
              </div>

              {/* Naviera */}
              <div className="form-group">
                <label htmlFor="naviera">
                  Naviera <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="naviera"
                  name="naviera"
                  className={`form-control ${errors.naviera ? "error" : ""}`}
                  value={formData.naviera}
                  onChange={handleChange}
                  placeholder="Ej: Royal Caribbean"
                />
                {errors.naviera && (
                  <span className="error-message">{errors.naviera}</span>
                )}
              </div>

              {/* Barco */}
              <div className="form-group">
                <label htmlFor="barco">
                  Barco <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="barco"
                  name="barco"
                  className={`form-control ${errors.barco ? "error" : ""}`}
                  value={formData.barco}
                  onChange={handleChange}
                  placeholder="Nombre del barco"
                />
                {errors.barco && (
                  <span className="error-message">{errors.barco}</span>
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
                  className="form-control"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del crucero"
                />
              </div>

              {/* Duración */}
              <div className="form-group">
                <label htmlFor="duracion">
                  Duración (noches) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="duracion"
                  name="duracion"
                  min="1"
                  className="form-control"
                  value={formData.duracion}
                  onChange={handleChange}
                />
              </div>

              {/* Fecha de Salida */}
              <div className="form-group">
                <label htmlFor="fechaSalida">
                  Fecha de Salida <span className="required">*</span>
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

              {/* Itinerario (Array) */}
              <div className="form-group full-width">
                <label>Itinerario (puertos)</label>
                <div className="array-input">
                  <DestinoAutocomplete
                    label=""
                    name="nuevoItinerario"
                    value={nuevoItinerario}
                    onChange={(e) => setNuevoItinerario(e.target.value)}
                    placeholder="Ej: Miami, Florida, Estados Unidos"
                    error={null}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleAddItinerario}
                    style={{ marginTop: "0.5rem" }}
                  >
                    <FaPlus /> Agregar
                  </button>
                </div>
                <div className="items-list">
                  {itinerario.map((item, index) => (
                    <div key={index} className="item-chip">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItinerario(index)}
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
                <label>Imágenes del Crucero (máximo 6)</label>
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
              {submitting ? "Creando..." : "Crear Crucero"}
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
