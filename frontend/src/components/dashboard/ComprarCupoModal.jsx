import React, { useState } from "react";
import { FaTimes, FaShoppingCart, FaExclamationTriangle } from "react-icons/fa";
import { updateCupo } from "../../services/cupos.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function ComprarCupoModal({ isOpen, onClose, onSuccess, cupo }) {
  const [cantidadCompra, setCantidadCompra] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    setCantidadCompra(value);
    if (errors.cantidad) {
      setErrors((prev) => ({ ...prev, cantidad: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!cantidadCompra || cantidadCompra < 1) {
      newErrors.cantidad = "La cantidad debe ser mayor a 0";
    }
    if (cantidadCompra > cupo?.cantidad) {
      newErrors.cantidad = `Solo hay ${cupo.cantidad} unidades disponibles`;
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
      // Actualizar la cantidad del cupo o marcarlo como vendido
      const nuevaCantidad = cupo.cantidad - cantidadCompra;
      const nuevoEstado = nuevaCantidad === 0 ? "vendido" : "disponible";

      await updateCupo(cupo.id, {
        cantidad: nuevaCantidad,
        estado: nuevoEstado,
      });

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al comprar el cupo");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCantidadCompra(1);
    setErrors({});
    setSubmitting(false);
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-AR");
  };

  const getDaysRemaining = () => {
    if (!cupo?.fechaVencimiento) return null;
    const today = new Date();
    const vencimiento = new Date(cupo.fechaVencimiento);
    const diffTime = vencimiento - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calcularTotal = () => {
    return (cupo?.precioMayorista || 0) * cantidadCompra;
  };

  if (!isOpen || !cupo) return null;

  const daysRemaining = getDaysRemaining();
  const isUrgente = daysRemaining !== null && daysRemaining <= 3;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaShoppingCart /> Comprar Cupo
          </h2>
          <button className="btn-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="cupo-detalle-compra">
              <div className="detalle-header">
                <h3>{cupo.descripcion}</h3>
                <span className="tipo-badge">✈️ {cupo.aerolinea || "Aéreo"}</span>
              </div>

              <div className="detalle-info">
                <div className="info-row">
                  <span className="info-label">Aerolínea:</span>
                  <span className="info-value">{cupo.aerolinea}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha vuelo:</span>
                  <span className="info-value">{formatDate(cupo.fechaOrigen)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Precio unitario:</span>
                  <span className="info-value precio">
                    {formatCurrency(cupo.precio)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Disponibles:</span>
                  <span className="info-value">{cupo.cantidad} unidades</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Oferta vence:</span>
                  <span className={`info-value ${isUrgente ? "urgente" : ""}`}>
                    {formatDate(cupo.fechaVencimiento)}
                    {daysRemaining !== null && (
                      <span className="dias-restantes">
                        {" "}
                        ({daysRemaining} día{daysRemaining !== 1 ? "s" : ""})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {isUrgente && (
                <div className="warning-box">
                  <FaExclamationTriangle />
                  <p>
                    Este cupo vence pronto. Asegúrate de poder utilizarlo antes
                    de la fecha de vencimiento.
                  </p>
                </div>
              )}

              {cupo.observaciones && (
                <div className="observaciones-box">
                  <h4>Observaciones:</h4>
                  <p>{cupo.observaciones}</p>
                </div>
              )}
            </div>

            <div className="form-compra">
              <div className="form-group">
                <label htmlFor="cantidadCompra">
                  Cantidad a comprar <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="cantidadCompra"
                  name="cantidadCompra"
                  className={`form-control ${errors.cantidad ? "error" : ""}`}
                  value={cantidadCompra}
                  onChange={handleChange}
                  min="1"
                  max={cupo.cantidad}
                />
                {errors.cantidad && (
                  <span className="error-message">{errors.cantidad}</span>
                )}
              </div>

              <div className="total-compra">
                <div className="total-row">
                  <span className="total-label">Subtotal:</span>
                  <span className="total-value">
                    {formatCurrency(calcularTotal())}
                  </span>
                </div>
                <div className="total-row destacado">
                  <span className="total-label">Total a pagar:</span>
                  <span className="total-value">
                    {formatCurrency(calcularTotal())}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-box">
              <p>
                <strong>Importante:</strong> Al confirmar la compra, el cupo
                será asignado a tu cuenta. Asegúrate de tener saldo suficiente y
                de poder utilizar el cupo antes de su vencimiento.
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
              {submitting ? "Procesando..." : "Confirmar Compra"}
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
