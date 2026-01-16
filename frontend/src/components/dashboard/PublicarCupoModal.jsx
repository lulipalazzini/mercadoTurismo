import React, { useState } from "react";
import { FaTimes, FaStore } from "react-icons/fa";
import { createCupo } from "../../services/cupos.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function PublicarCupoModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    tipoProducto: "",
    descripcion: "",
    cantidad: 1,
    precioMayorista: "",
    precioMinorista: "",
    fechaVencimiento: "",
    observaciones: "",
  });

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
    if (!formData.tipoProducto.trim())
      newErrors.tipoProducto = "El tipo de producto es requerido";
    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es requerida";
    if (!formData.cantidad || formData.cantidad < 1)
      newErrors.cantidad = "La cantidad debe ser mayor a 0";
    if (!formData.precioMayorista || formData.precioMayorista <= 0)
      newErrors.precioMayorista = "El precio mayorista debe ser mayor a 0";
    if (!formData.precioMinorista || formData.precioMinorista <= 0)
      newErrors.precioMinorista = "El precio minorista debe ser mayor a 0";
    if (formData.precioMinorista && formData.precioMayorista && 
        parseFloat(formData.precioMinorista) <= parseFloat(formData.precioMayorista))
      newErrors.precioMinorista = "El precio minorista debe ser mayor al mayorista";
    if (!formData.fechaVencimiento)
      newErrors.fechaVencimiento = "La fecha de vencimiento es requerida";

    // Validar que la fecha de vencimiento sea futura
    if (formData.fechaVencimiento) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const vencimiento = new Date(formData.fechaVencimiento);
      if (vencimiento < today) {
        newErrors.fechaVencimiento =
          "La fecha de vencimiento debe ser futura";
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
      setAlertMessage("Error al publicar el cupo");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      tipoProducto: "",
      descripcion: "",
      cantidad: 1,
      precioMayorista: "",
      precioMinorista: "",
      fechaVencimiento: "",
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
              <div className="form-group">
                <label htmlFor="tipoProducto">
                  Tipo de Producto <span className="required">*</span>
                </label>
                <select
                  id="tipoProducto"
                  name="tipoProducto"
                  className={`form-control ${errors.tipoProducto ? "error" : ""}`}
                  value={formData.tipoProducto}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Alojamiento">Alojamiento</option>
                  <option value="Auto">Auto</option>
                  <option value="Circuito">Circuito</option>
                  <option value="Crucero">Crucero</option>
                  <option value="Excursión">Excursión</option>
                  <option value="Pasaje">Pasaje</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Salida Grupal">Salida Grupal</option>
                  <option value="Paquete">Paquete</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.tipoProducto && (
                  <span className="error-message">{errors.tipoProducto}</span>
                )}
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

              <div className="form-group full-width">
                <label htmlFor="descripcion">
                  Descripción del Cupo <span className="required">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="3"
                  className={`form-control ${errors.descripcion ? "error" : ""}`}
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Ej: Hotel 4 estrellas en Bariloche, habitación doble con desayuno incluido"
                />
                {errors.descripcion && (
                  <span className="error-message">{errors.descripcion}</span>
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
                  className={`form-control ${errors.precioMayorista ? "error" : ""}`}
                  value={formData.precioMayorista}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                {errors.precioMayorista && (
                  <span className="error-message">{errors.precioMayorista}</span>
                )}
                <small className="form-hint">Precio para operadores mayoristas</small>
              </div>

              <div className="form-group">
                <label htmlFor="precioMinorista">
                  Precio Minorista (ARS) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precioMinorista"
                  name="precioMinorista"
                  className={`form-control ${errors.precioMinorista ? "error" : ""}`}
                  value={formData.precioMinorista}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                {errors.precioMinorista && (
                  <span className="error-message">{errors.precioMinorista}</span>
                )}
                <small className="form-hint">Precio para venta al público</small>
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
                  <span className="error-message">{errors.fechaVencimiento}</span>
                )}
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
                  placeholder="Información adicional relevante para el comprador"
                />
              </div>
            </div>

            <div className="info-box">
              <p>
                <strong>Nota:</strong> El cupo será visible para todos los
                operadores en el mercado. Asegúrate de verificar la
                disponibilidad antes de publicar.
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
        message={alertMessage}
        type="error"
      />
    </div>
  );
}
