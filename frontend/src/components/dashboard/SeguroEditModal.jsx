import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateSeguro } from "../../services/seguros.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function SeguroEditModal({
  isOpen,
  onClose,
  onSuccess,
  seguro,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "viaje",
    proveedor: "",
    descripcion: "",
    precio: "",
    montoCobertura: "",
    duracionDias: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (seguro) {
      setFormData({
        nombre: seguro.nombre || "",
        tipo: seguro.tipo || "viaje",
        proveedor: seguro.proveedor || "",
        descripcion: seguro.descripcion || "",
        precio: seguro.precio || "",
        montoCobertura: seguro.montoCobertura || "",
        duracionDias: seguro.duracionDias || "",
      });
    }
  }, [seguro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.proveedor.trim())
      newErrors.proveedor = "El proveedor es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !seguro) return;

    try {
      setSubmitting(true);
      await updateSeguro(seguro.id, formData);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al actualizar el seguro.");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !seguro) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content large"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Editar Seguro</h2>
            <button className="btn-close" onClick={onClose}>
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
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                  {errors.nombre && (
                    <span className="error-message">{errors.nombre}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="tipo">Tipo de Seguro</label>
                  <select
                    id="tipo"
                    name="tipo"
                    className="form-control"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <option value="viaje">Viaje</option>
                    <option value="cancelacion">Cancelación</option>
                    <option value="medico">Médico</option>
                    <option value="equipaje">Equipaje</option>
                    <option value="completo">Completo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="proveedor">
                    Proveedor <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="proveedor"
                    name="proveedor"
                    className="form-control"
                    value={formData.proveedor}
                    onChange={handleChange}
                  />
                  {errors.proveedor && (
                    <span className="error-message">{errors.proveedor}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="precio">Precio</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    className="form-control"
                    value={formData.precio}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="montoCobertura">Monto de Cobertura</label>
                  <input
                    type="number"
                    id="montoCobertura"
                    name="montoCobertura"
                    className="form-control"
                    value={formData.montoCobertura}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duracionDias">Duración (días)</label>
                  <input
                    type="number"
                    id="duracionDias"
                    name="duracionDias"
                    className="form-control"
                    value={formData.duracionDias}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Error"
        message={alertMessage}
        type="error"
      />
    </>
  );
}
