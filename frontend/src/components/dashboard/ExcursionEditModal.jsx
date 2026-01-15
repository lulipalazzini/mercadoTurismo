import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateExcursion } from "../../services/excursiones.service";
import AlertModal from "../common/AlertModal";

export default function ExcursionEditModal({
  isOpen,
  onClose,
  onSuccess,
  excursion,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    destino: "",
    tipo: "cultural",
    duracion: "",
    precio: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });

  useEffect(() => {
    if (excursion) {
      setFormData({
        nombre: excursion.nombre || "",
        descripcion: excursion.descripcion || "",
        destino: excursion.destino || "",
        tipo: excursion.tipo || "cultural",
        duracion: excursion.duracion || "",
        precio: excursion.precio || "",
      });
    }
  }, [excursion]);

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

    try {
      await updateExcursion(excursion.id, formData);
      setAlertData({
        type: "success",
        message: "Excursión actualizada exitosamente",
      });
      setShowAlert(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setAlertData({
        type: "error",
        message: "Error al actualizar la excursión",
      });
      setShowAlert(true);
    }
  };

  if (!isOpen || !excursion) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Editar Excursión</h2>
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
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Destino *</label>
                <input
                  type="text"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="cultural">Cultural</option>
                  <option value="aventura">Aventura</option>
                  <option value="naturaleza">Naturaleza</option>
                  <option value="gastronomica">Gastronómica</option>
                  <option value="deportiva">Deportiva</option>
                  <option value="otra">Otra</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duración (horas) *</label>
                <input
                  type="number"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  min="0.5"
                  step="0.5"
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
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar Cambios
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
