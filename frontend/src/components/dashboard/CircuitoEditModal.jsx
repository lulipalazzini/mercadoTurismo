import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateCircuito } from "../../services/circuitos.service";
import AlertModal from "../common/AlertModal";
import DragDropImageUpload from "../common/DragDropImageUpload";
import { getImageUrls } from "../../utils/imageUtils";
import "../../styles/modal.css";

export default function CircuitoEditModal({
  isOpen,
  onClose,
  onSuccess,
  circuito,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    destinos: "",
    duracion: "",
    precio: "",
    incluye: "",
    noIncluye: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);

  useEffect(() => {
    if (circuito) {
      setFormData({
        nombre: circuito.nombre || "",
        descripcion: circuito.descripcion || "",
        destinos: Array.isArray(circuito.destinos)
          ? circuito.destinos.join(", ")
          : "",
        duracion: circuito.duracion || "",
        precio: circuito.precio || "",
        incluye: Array.isArray(circuito.incluye)
          ? circuito.incluye.join(", ")
          : "",
        noIncluye: Array.isArray(circuito.noIncluye)
          ? circuito.noIncluye.join(", ")
          : "",
      });

      // Cargar imágenes existentes
      if (circuito.imagenes && Array.isArray(circuito.imagenes)) {
        const imageUrls = getImageUrls(circuito.imagenes);
        const existingImgs = imageUrls.map((url, index) => ({
          preview: url,
          name: `Imagen ${index + 1}`,
          existing: true,
          originalPath: circuito.imagenes[index],
        }));
        setImagenesExistentes(existingImgs);
        setImagenes(existingImgs);
      }
    }
  }, [circuito]);

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
    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es requerida";
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
      const formDataToSend = new FormData();

      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("duracion", formData.duracion);
      formDataToSend.append("precio", formData.precio);

      const destinos = formData.destinos
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d);
      formDataToSend.append("destinos", JSON.stringify(destinos));

      const incluye = formData.incluye
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);
      formDataToSend.append("incluye", JSON.stringify(incluye));

      const noIncluye = formData.noIncluye
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);
      formDataToSend.append("noIncluye", JSON.stringify(noIncluye));

      imagenes.forEach((imagen) => {
        if (imagen.file instanceof File) {
          formDataToSend.append("imagenes", imagen.file);
        }
      });

      const imagenesAMantener = imagenes
        .filter((img) => img.existing && img.originalPath)
        .map((img) => img.originalPath);

      if (imagenesAMantener.length > 0) {
        formDataToSend.append(
          "imagenesExistentes",
          JSON.stringify(imagenesAMantener),
        );
      }

      await updateCircuito(circuito.id, formDataToSend);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al actualizar el circuito");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      destinos: "",
      duracion: "",
      precio: "",
      incluye: "",
      noIncluye: "",
    });
    setErrors({});
    setSubmitting(false);
    onClose();
  };

  if (!isOpen || !circuito) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Circuito</h2>
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
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
                )}
              </div>

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
                />
                {errors.descripcion && (
                  <span className="error-message">{errors.descripcion}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="destinos">
                  Destinos <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="destinos"
                  name="destinos"
                  className="form-control"
                  value={formData.destinos}
                  onChange={handleChange}
                  placeholder="París, Londres, Roma"
                />
              </div>

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
                <label htmlFor="incluye">Incluye</label>
                <textarea
                  id="incluye"
                  name="incluye"
                  rows="2"
                  className="form-control"
                  value={formData.incluye}
                  onChange={handleChange}
                  placeholder="Alojamiento, Desayuno, Guía"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="noIncluye">No Incluye</label>
                <textarea
                  id="noIncluye"
                  name="noIncluye"
                  rows="2"
                  className="form-control"
                  value={formData.noIncluye}
                  onChange={handleChange}
                  placeholder="Vuelos, Comidas extras"
                />
              </div>

              {/* Imágenes */}
              <div className="form-group full-width">
                <label>Imágenes</label>
                <DragDropImageUpload
                  onChange={setImagenes}
                  maxFiles={6}
                  maxSizeMB={5}
                  existingImages={imagenesExistentes}
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
