import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateSalidaGrupal } from "../../services/salidasGrupales.service";
import AlertModal from "../common/AlertModal";
import DragDropImageUpload from "../common/DragDropImageUpload";
import { getImageUrls } from "../../utils/imageUtils";
import "../../styles/modal.css";

export default function SalidaGrupalEditModal({
  isOpen,
  onClose,
  onSuccess,
  salidaGrupal,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    destino: "",
    fechaSalida: "",
    fechaRegreso: "",
    duracion: "",
    precio: "",
    incluye: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);

  useEffect(() => {
    if (salidaGrupal) {
      setFormData({
        nombre: salidaGrupal.nombre || "",
        descripcion: salidaGrupal.descripcion || "",
        destino: salidaGrupal.destino || "",
        fechaSalida: salidaGrupal.fechaSalida
          ? new Date(salidaGrupal.fechaSalida).toISOString().split("T")[0]
          : "",
        fechaRegreso: salidaGrupal.fechaRegreso
          ? new Date(salidaGrupal.fechaRegreso).toISOString().split("T")[0]
          : "",
        duracion: salidaGrupal.duracion || "",
        precio: salidaGrupal.precio || "",
        incluye: Array.isArray(salidaGrupal.incluye)
          ? salidaGrupal.incluye.join(", ")
          : "",
      });

      // Cargar imágenes existentes
      if (salidaGrupal.imagenes && Array.isArray(salidaGrupal.imagenes)) {
        const imageUrls = getImageUrls(salidaGrupal.imagenes);
        const existingImgs = imageUrls.map((url, index) => ({
          preview: url,
          name: `Imagen ${index + 1}`,
          existing: true,
          originalPath: salidaGrupal.imagenes[index],
        }));
        setImagenesExistentes(existingImgs);
        setImagenes(existingImgs);
      }
    }
  }, [salidaGrupal]);

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
      const formDataToSend = new FormData();

      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("destino", formData.destino);
      formDataToSend.append("fechaSalida", formData.fechaSalida);
      formDataToSend.append("fechaRegreso", formData.fechaRegreso);
      formDataToSend.append("duracion", formData.duracion);
      formDataToSend.append("precio", formData.precio);

      const incluye = formData.incluye
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);
      formDataToSend.append("incluye", JSON.stringify(incluye));

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

      await updateSalidaGrupal(salidaGrupal.id, formDataToSend);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al actualizar la salida grupal");
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
      incluye: "",
    });
    setErrors({});
    setSubmitting(false);
    onClose();
  };

  if (!isOpen || !salidaGrupal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Salida Grupal</h2>
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
