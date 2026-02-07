import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateTransfer } from "../../services/transfers.service";
import AlertModal from "../common/AlertModal";
import DragDropImageUpload from "../common/DragDropImageUpload";
import { getImageUrls } from "../../utils/imageUtils";
import "../../styles/modal.css";

export default function TransferEditModal({
  isOpen,
  onClose,
  onSuccess,
  transfer,
}) {
  const [formData, setFormData] = useState({
    tipo: "aeropuerto-hotel",
    origen: "",
    destino: "",
    vehiculo: "sedan",
    capacidadPasajeros: 4,
    precio: "",
    duracionEstimada: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);

  useEffect(() => {
    if (transfer) {
      setFormData({
        tipo: transfer.tipo || "aeropuerto-hotel",
        origen: transfer.origen || "",
        destino: transfer.destino || "",
        vehiculo: transfer.vehiculo || "sedan",
        capacidadPasajeros: transfer.capacidadPasajeros || 4,
        precio: transfer.precio || "",
        duracionEstimada: transfer.duracionEstimada || "",
      });

      // Cargar imágenes existentes
      if (transfer.imagenes && Array.isArray(transfer.imagenes)) {
        const imageUrls = getImageUrls(transfer.imagenes);
        const existingImgs = imageUrls.map((url, index) => ({
          preview: url,
          name: `Imagen ${index + 1}`,
          existing: true,
          originalPath: transfer.imagenes[index],
        }));
        setImagenesExistentes(existingImgs);
        setImagenes(existingImgs);
      }
    }
  }, [transfer]);

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
    if (!formData.origen.trim()) newErrors.origen = "El origen es requerido";
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
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

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

      await updateTransfer(transfer.id, formDataToSend);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al actualizar el transfer");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      tipo: "aeropuerto-hotel",
      origen: "",
      destino: "",
      vehiculo: "sedan",
      capacidadPasajeros: 4,
      precio: "",
      duracionEstimada: "",
    });
    setErrors({});
    setSubmitting(false);
    onClose();
  };

  if (!isOpen || !transfer) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Transfer</h2>
          <button className="btn-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
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
                  <option value="aeropuerto-hotel">Aeropuerto → Hotel</option>
                  <option value="hotel-aeropuerto">Hotel → Aeropuerto</option>
                  <option value="interhotel">Inter-Hotel</option>
                  <option value="punto-a-punto">Punto a Punto</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="vehiculo">
                  Vehículo <span className="required">*</span>
                </label>
                <select
                  id="vehiculo"
                  name="vehiculo"
                  className="form-control"
                  value={formData.vehiculo}
                  onChange={handleChange}
                >
                  <option value="sedan">Sedan</option>
                  <option value="van">Van</option>
                  <option value="minibus">Minibus</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="origen">
                  Origen <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="origen"
                  name="origen"
                  className={`form-control ${errors.origen ? "error" : ""}`}
                  value={formData.origen}
                  onChange={handleChange}
                />
                {errors.origen && (
                  <span className="error-message">{errors.origen}</span>
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

              <div className="form-group">
                <label htmlFor="capacidadPasajeros">
                  Capacidad de Pasajeros <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="capacidadPasajeros"
                  name="capacidadPasajeros"
                  className="form-control"
                  value={formData.capacidadPasajeros}
                  onChange={handleChange}
                  min="1"
                  max="50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duracionEstimada">
                  Duración Estimada (minutos)
                </label>
                <input
                  type="number"
                  id="duracionEstimada"
                  name="duracionEstimada"
                  className="form-control"
                  value={formData.duracionEstimada}
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
