import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateTren } from "../../services/trenes.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function TrenEditModal({ isOpen, onClose, onSuccess, tren }) {
  const [formData, setFormData] = useState({
    nombreServicio: "",
    origen: "",
    destino: "",
    clase: "turista",
    precio: "",
    duracionHoras: "",
    capacidadPasajeros: "",
    descripcion: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (tren) {
      setFormData({
        nombreServicio: tren.nombreServicio || "",
        origen: tren.origen || "",
        destino: tren.destino || "",
        clase: tren.clase || "turista",
        precio: tren.precio || "",
        duracionHoras: tren.duracionHoras || "",
        capacidadPasajeros: tren.capacidadPasajeros || "",
        descripcion: tren.descripcion || "",
      });
    }
  }, [tren]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombreServicio.trim())
      newErrors.nombreServicio = "El nombre del servicio es requerido";
    if (!formData.origen.trim()) newErrors.origen = "El origen es requerido";
    if (!formData.destino.trim()) newErrors.destino = "El destino es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !tren) return;

    try {
      setSubmitting(true);
      await updateTren(tren.id, formData);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al actualizar el tren.");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !tren) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content large"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Editar Servicio de Tren</h2>
            <button className="btn-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombreServicio">
                    Nombre del Servicio <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombreServicio"
                    name="nombreServicio"
                    className="form-control"
                    value={formData.nombreServicio}
                    onChange={handleChange}
                  />
                  {errors.nombreServicio && (
                    <span className="error-message">
                      {errors.nombreServicio}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="clase">Clase</label>
                  <select
                    id="clase"
                    name="clase"
                    className="form-control"
                    value={formData.clase}
                    onChange={handleChange}
                  >
                    <option value="turista">Turista</option>
                    <option value="primera">Primera Clase</option>
                    <option value="ejecutiva">Ejecutiva</option>
                    <option value="premium">Premium</option>
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
                    className="form-control"
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
                    className="form-control"
                    value={formData.destino}
                    onChange={handleChange}
                  />
                  {errors.destino && (
                    <span className="error-message">{errors.destino}</span>
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
                  <label htmlFor="duracionHoras">Duración (horas)</label>
                  <input
                    type="number"
                    id="duracionHoras"
                    name="duracionHoras"
                    className="form-control"
                    value={formData.duracionHoras}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="capacidadPasajeros">
                    Capacidad de Pasajeros
                  </label>
                  <input
                    type="number"
                    id="capacidadPasajeros"
                    name="capacidadPasajeros"
                    className="form-control"
                    value={formData.capacidadPasajeros}
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
