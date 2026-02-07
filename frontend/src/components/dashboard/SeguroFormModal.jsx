import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createSeguro } from "../../services/seguros.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function SeguroFormModal({ isOpen, onClose, onSuccess }) {
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
    if (!validate()) return;

    try {
      setSubmitting(true);
      await createSeguro(formData);
      setFormData({
        nombre: "",
        tipo: "viaje",
        proveedor: "",
        descripcion: "",
        precio: "",
        montoCobertura: "",
        duracionDias: "",
      });
      setErrors({});
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(
        "Error al crear el seguro. Por favor intenta nuevamente.",
      );
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      tipo: "viaje",
      proveedor: "",
      descripcion: "",
      precio: "",
      montoCobertura: "",
      duracionDias: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div
          className="modal-content large"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Nuevo Seguro</h2>
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
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Seguro de Viaje Premium"
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
                    placeholder="Nombre de la aseguradora"
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0"
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
                    placeholder="Descripción del seguro y beneficios..."
                  ></textarea>
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
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Creando..." : "Crear Seguro"}
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
