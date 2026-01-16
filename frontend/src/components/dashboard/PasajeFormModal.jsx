import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createPasaje } from "../../services/pasajes.service";
import AlertModal from "../common/AlertModal";
import "../../styles/modal.css";

export default function PasajeFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    tipo: "aereo",
    origen: "",
    destino: "",
    aerolinea: "",
    numeroVuelo: "",
    fechaSalida: "",
    fechaLlegada: "",
    horaSalida: "",
    horaLlegada: "",
    clase: "economica",
    precio: "",
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

    if (!formData.origen.trim()) {
      newErrors.origen = "El origen es requerido";
    }

    if (!formData.destino.trim()) {
      newErrors.destino = "El destino es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      await createPasaje(formData);

      setFormData({
        tipo: "aereo",
        origen: "",
        destino: "",
        aerolinea: "",
        numeroVuelo: "",
        fechaSalida: "",
        fechaLlegada: "",
        horaSalida: "",
        horaLlegada: "",
        clase: "economica",
        precio: "",
      });
      setErrors({});

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error al crear el pasaje. Por favor intenta nuevamente.");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      tipo: "aereo",
      origen: "",
      destino: "",
      aerolinea: "",
      numeroVuelo: "",
      fechaSalida: "",
      fechaLlegada: "",
      horaSalida: "",
      horaLlegada: "",
      clase: "economica",
      precio: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo Pasaje</h2>
          <button className="btn-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Tipo */}
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
                  <option value="aereo">Aéreo</option>
                  <option value="terrestre">Terrestre</option>
                  <option value="maritimo">Marítimo</option>
                </select>
              </div>

              {/* Clase */}
              <div className="form-group">
                <label htmlFor="clase">Clase</label>
                <select
                  id="clase"
                  name="clase"
                  className="form-control"
                  value={formData.clase}
                  onChange={handleChange}
                >
                  <option value="economica">Económica</option>
                  <option value="ejecutiva">Ejecutiva</option>
                  <option value="primera">Primera</option>
                </select>
              </div>

              {/* Origen */}
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
                  placeholder="Ciudad de origen"
                />
                {errors.origen && (
                  <span className="error-message">{errors.origen}</span>
                )}
              </div>

              {/* Destino */}
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
                  placeholder="Ciudad de destino"
                />
                {errors.destino && (
                  <span className="error-message">{errors.destino}</span>
                )}
              </div>

              {/* Aerolínea - solo para tipo aereo */}
              {formData.tipo === "aereo" && (
                <>
                  <div className="form-group">
                    <label htmlFor="aerolinea">Aerolínea</label>
                    <input
                      type="text"
                      id="aerolinea"
                      name="aerolinea"
                      className="form-control"
                      value={formData.aerolinea}
                      onChange={handleChange}
                      placeholder="Nombre de la aerolínea"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numeroVuelo">Número de Vuelo</label>
                    <input
                      type="text"
                      id="numeroVuelo"
                      name="numeroVuelo"
                      className="form-control"
                      value={formData.numeroVuelo}
                      onChange={handleChange}
                      placeholder="Ej: AA1234"
                    />
                  </div>
                </>
              )}

              {/* Fecha Salida */}
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

              {/* Hora Salida */}
              <div className="form-group">
                <label htmlFor="horaSalida">Hora Salida</label>
                <input
                  type="time"
                  id="horaSalida"
                  name="horaSalida"
                  className="form-control"
                  value={formData.horaSalida}
                  onChange={handleChange}
                />
              </div>

              {/* Fecha Llegada */}
              <div className="form-group">
                <label htmlFor="fechaLlegada">
                  Fecha Llegada <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaLlegada"
                  name="fechaLlegada"
                  className="form-control"
                  value={formData.fechaLlegada}
                  onChange={handleChange}
                />
              </div>

              {/* Hora Llegada */}
              <div className="form-group">
                <label htmlFor="horaLlegada">Hora Llegada</label>
                <input
                  type="time"
                  id="horaLlegada"
                  name="horaLlegada"
                  className="form-control"
                  value={formData.horaLlegada}
                  onChange={handleChange}
                />
              </div>

              {/* Precio */}
              <div className="form-group">
                <label htmlFor="precio">
                  Precio (ARS) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  min="0"
                  step="0.01"
                  className="form-control"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precio"
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
              {submitting ? "Creando..." : "Crear Pasaje"}
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
