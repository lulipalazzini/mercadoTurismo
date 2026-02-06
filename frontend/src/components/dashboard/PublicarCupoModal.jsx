import React, { useState } from "react";
import { FaTimes, FaStore } from "react-icons/fa";
import { createCupo } from "../../services/cupos.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function PublicarCupoModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    descripcion: "",
    cantidad: 1,
    precioMayorista: "",
    precioMinorista: "",
    fechaVencimiento: "",
    fechaOrigen: "",
    aerolinea: "",
    observaciones: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "error", message: "" });

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
    
    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es requerida";
    
    if (!formData.cantidad || formData.cantidad < 1)
      newErrors.cantidad = "La cantidad debe ser mayor a 0";
    
    if (!formData.precioMayorista || formData.precioMayorista <= 0)
      newErrors.precioMayorista = "El precio mayorista debe ser mayor a 0";
    
    if (!formData.precioMinorista || formData.precioMinorista <= 0)
      newErrors.precioMinorista = "El precio minorista debe ser mayor a 0";
    
    if (
      formData.precioMinorista &&
      formData.precioMayorista &&
      parseFloat(formData.precioMinorista) <=
        parseFloat(formData.precioMayorista)
    )
      newErrors.precioMinorista =
        "El precio minorista debe ser mayor al mayorista";
    
    if (!formData.fechaVencimiento)
      newErrors.fechaVencimiento = "La fecha de vencimiento es requerida";

    // ✅ NUEVO: Validar fecha de origen (OBLIGATORIO)
    if (!formData.fechaOrigen)
      newErrors.fechaOrigen = "La fecha de origen es requerida";

    // ✅ NUEVO: Validar aerolínea (OBLIGATORIO)
    if (!formData.aerolinea || !formData.aerolinea.trim())
      newErrors.aerolinea = "La aerolínea es requerida";

    // Validar que la fecha de vencimiento sea futura
    if (formData.fechaVencimiento) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const vencimiento = new Date(formData.fechaVencimiento);
      if (vencimiento < today) {
        newErrors.fechaVencimiento = "La fecha de vencimiento debe ser futura";
      }
    }

    // Validar que fechaOrigen sea válida
    if (formData.fechaOrigen) {
      const origen = new Date(formData.fechaOrigen);
      if (isNaN(origen.getTime())) {
        newErrors.fechaOrigen = "Fecha de origen inválida";
      }
    }

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
      const dataToSend = {
        ...formData,
        tipoProducto: "aereo", // Siempre aereo
        cantidad: parseInt(formData.cantidad),
        precioMayorista: parseFloat(formData.precioMayorista),
        precioMinorista: parseFloat(formData.precioMinorista),
        estado: "disponible",
      };

      await createCupo(dataToSend);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      
      // Mostrar error detallado del backend
      const errorData = error.response?.data;
      let errorMessage = "Error al publicar el cupo";
      
      if (errorData?.detalle) {
        errorMessage = errorData.detalle;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlertConfig({
        type: "error",
        message: errorMessage,
      });
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      descripcion: "",
      cantidad: 1,
      precioMayorista: "",
      precioMinorista: "",
      fechaVencimiento: "",
      fechaOrigen: "",
      aerolinea: "",
      observaciones: "",
    });
    setErrors({});
    setSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaStore /> Publicar Cupo en el Mercado
          </h2>
          <button className="btn-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="descripcion">
                  Descripción del Vuelo <span className="required">*</span>
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
                  placeholder="Ej: Vuelo Buenos Aires - Miami, clase económica, con escala en Panamá"
                />
                {errors.descripcion && (
                  <span className="error-message">{errors.descripcion}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="aerolinea">
                  ✈️ Aerolínea <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="aerolinea"
                  name="aerolinea"
                  className={`form-control ${errors.aerolinea ? "error" : ""}`}
                  value={formData.aerolinea}
                  onChange={handleChange}
                  placeholder="Ej: American Airlines"
                />
                {errors.aerolinea && (
                  <span className="error-message">{errors.aerolinea}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="fechaOrigen">
                  📅 Fecha de Origen <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaOrigen"
                  name="fechaOrigen"
                  className={`form-control ${
                    errors.fechaOrigen ? "error" : ""
                  }`}
                  value={formData.fechaOrigen}
                  onChange={handleChange}
                />
                {errors.fechaOrigen && (
                  <span className="error-message">{errors.fechaOrigen}</span>
                )}
                <small className="form-hint">
                  Fecha del vuelo de ida
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="cantidad">
                  Cantidad Disponible <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  className={`form-control ${errors.cantidad ? "error" : ""}`}
                  value={formData.cantidad}
                  onChange={handleChange}
                  min="1"
                />
                {errors.cantidad && (
                  <span className="error-message">{errors.cantidad}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="precioMayorista">
                  Precio Mayorista (ARS) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precioMayorista"
                  name="precioMayorista"
                  className={`form-control ${
                    errors.precioMayorista ? "error" : ""
                  }`}
                  value={formData.precioMayorista}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                {errors.precioMayorista && (
                  <span className="error-message">
                    {errors.precioMayorista}
                  </span>
                )}
                <small className="form-hint">
                  Precio para operadores mayoristas
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="precioMinorista">
                  Precio Minorista (ARS) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precioMinorista"
                  name="precioMinorista"
                  className={`form-control ${
                    errors.precioMinorista ? "error" : ""
                  }`}
                  value={formData.precioMinorista}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                {errors.precioMinorista && (
                  <span className="error-message">
                    {errors.precioMinorista}
                  </span>
                )}
                <small className="form-hint">
                  Precio para venta al público
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="fechaVencimiento">
                  Fecha de Vencimiento <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaVencimiento"
                  name="fechaVencimiento"
                  className={`form-control ${
                    errors.fechaVencimiento ? "error" : ""
                  }`}
                  value={formData.fechaVencimiento}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.fechaVencimiento && (
                  <span className="error-message">
                    {errors.fechaVencimiento}
                  </span>
                )}
                <small className="form-hint">
                  Hasta cuándo es válida la oferta
                </small>
              </div>

              <div className="form-group full-width">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  rows="2"
                  className="form-control"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Información adicional: clase, equipaje incluido, escalas, restricciones, etc."
                />
              </div>
            </div>

            <div className="info-box">
              <p>
                <strong>Nota:</strong> Todos los cupos son para vuelos aéreos. El cupo será visible para todos los
                operadores en el mercado. Asegúrate de verificar la disponibilidad antes de publicar.
              </p>
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
              {submitting ? "Publicando..." : "Publicar Cupo"}
            </button>
          </div>
        </form>
      </div>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type={alertConfig.type}
        message={alertConfig.message}
      />
    </div>
  );
}
