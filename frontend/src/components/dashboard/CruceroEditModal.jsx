import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateCrucero } from "../../services/cruceros.service";
import AlertModal from "../common/AlertModal";
import DragDropImageUpload from "../common/DragDropImageUpload";
import { getImageUrls } from "../../utils/imageUtils";
import "../../styles/modal.css";

export default function CruceroEditModal({
  isOpen,
  onClose,
  onSuccess,
  crucero,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    naviera: "",
    barco: "",
    descripcion: "",
    itinerario: "",
    duracion: "",
    fechaSalida: "",
    precio: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);

  useEffect(() => {
    if (crucero) {
      setFormData({
        nombre: crucero.nombre || "",
        naviera: crucero.naviera || "",
        barco: crucero.barco || "",
        descripcion: crucero.descripcion || "",
        itinerario: Array.isArray(crucero.itinerario)
          ? crucero.itinerario.join(", ")
          : "",
        duracion: crucero.duracion || "",
        fechaSalida: crucero.fechaSalida
          ? new Date(crucero.fechaSalida).toISOString().split("T")[0]
          : "",
        precio: crucero.precio || "",
      });

      // Cargar imágenes existentes
      if (crucero.imagenes && Array.isArray(crucero.imagenes)) {
        const imageUrls = getImageUrls(crucero.imagenes);
        const existingImgs = imageUrls.map((url, index) => ({
          preview: url,
          name: `Imagen ${index + 1}`,
          existing: true,
          originalPath: crucero.imagenes[index],
        }));
        setImagenesExistentes(existingImgs);
        setImagenes(existingImgs);
      }
    }
  }, [crucero]);

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
    if (!formData.naviera.trim()) newErrors.naviera = "La naviera es requerida";
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
      formDataToSend.append("naviera", formData.naviera);
      formDataToSend.append("barco", formData.barco);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("duracion", formData.duracion);
      formDataToSend.append("fechaSalida", formData.fechaSalida);
      formDataToSend.append("precio", formData.precio);

      const itinerario = formData.itinerario
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);
      formDataToSend.append("itinerario", JSON.stringify(itinerario));

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

      await updateCrucero(crucero.id, formDataToSend);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al actualizar el crucero");
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
      itinerario: "",
      duracion: "",
      fechaSalida: "",
      precio: "",
    });
    setErrors({});
    setSubmitting(false);
    onClose();
  };

  if (!isOpen || !crucero) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Crucero</h2>
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
                />
                {errors.naviera && (
                  <span className="error-message">{errors.naviera}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="barco">
                  Barco <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="barco"
                  name="barco"
                  className="form-control"
                  value={formData.barco}
                  onChange={handleChange}
                />
              </div>

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
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="itinerario">
                  Itinerario <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="itinerario"
                  name="itinerario"
                  className="form-control"
                  value={formData.itinerario}
                  onChange={handleChange}
                  placeholder="Miami, Cozumel, Gran Caimán, Jamaica"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duracion">
                  Duración (noches) <span className="required">*</span>
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
