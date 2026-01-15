import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createCircuito } from "../../services/circuitos.service";
import AlertModal from "../common/AlertModal";

export default function CircuitoFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    destinos: "",
    duracion: "",
    precio: "",
    incluye: "",
    noIncluye: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setAlertData({ type: "error", message: "El nombre es requerido" });
      setShowAlert(true);
      return;
    }

    if (!formData.duracion || formData.duracion <= 0) {
      setAlertData({
        type: "error",
        message: "La duración debe ser mayor a 0",
      });
      setShowAlert(true);
      return;
    }

    if (!formData.precio || formData.precio <= 0) {
      setAlertData({ type: "error", message: "El precio debe ser mayor a 0" });
      setShowAlert(true);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        destinos: formData.destinos
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d),
        incluye: formData.incluye
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
        noIncluye: formData.noIncluye
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
      };

      await createCircuito(dataToSend);
      setAlertData({
        type: "success",
        message: "Circuito creado exitosamente",
      });
      setShowAlert(true);

      setFormData({
        nombre: "",
        descripcion: "",
        destinos: "",
        duracion: "",
        precio: "",
        incluye: "",
        noIncluye: "",
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setAlertData({
        type: "error",
        message: "Error al crear el circuito",
      });
      setShowAlert(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Nuevo Circuito</h2>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre del circuito"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción del circuito"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Destinos * (separados por comas)</label>
              <input
                type="text"
                name="destinos"
                value={formData.destinos}
                onChange={handleChange}
                placeholder="Ej: París, Londres, Roma"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duración (días) *</label>
                <input
                  type="number"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precio"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Incluye (separados por comas)</label>
              <textarea
                name="incluye"
                value={formData.incluye}
                onChange={handleChange}
                placeholder="Ej: Alojamiento, Desayunos, Traslados"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>No Incluye (separados por comas)</label>
              <textarea
                name="noIncluye"
                value={formData.noIncluye}
                onChange={handleChange}
                placeholder="Ej: Vuelos, Comidas, Excursiones opcionales"
                rows="2"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Crear Circuito
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertData.type === "success" ? "Éxito" : "Error"}
        message={alertData.message}
        type={alertData.type}
      />
    </>
  );
}
