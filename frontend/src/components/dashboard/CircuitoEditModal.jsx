import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateCircuito } from "../../services/circuitos.service";
import AlertModal from "../common/AlertModal";

export default function CircuitoEditModal({
  isOpen,
  onClose,
  onSuccess,
  circuito,
}) {
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

  useEffect(() => {
    if (circuito) {
      setFormData({
        nombre: circuito.nombre || "",
        descripcion: circuito.descripcion || "",
        destinos: Array.isArray(circuito.destinos)
          ? circuito.destinos.join(", ")
          : "",
        duracion: circuito.duracion || "",
        precio: circuito.precio || "",
        incluye: Array.isArray(circuito.incluye)
          ? circuito.incluye.join(", ")
          : "",
        noIncluye: Array.isArray(circuito.noIncluye)
          ? circuito.noIncluye.join(", ")
          : "",
      });
    }
  }, [circuito]);

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

      await updateCircuito(circuito.id, dataToSend);
      setAlertData({
        type: "success",
        message: "Circuito actualizado exitosamente",
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
        message: "Error al actualizar el circuito",
      });
      setShowAlert(true);
    }
  };

  if (!isOpen || !circuito) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Editar Circuito</h2>
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

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
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
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>No Incluye (separados por comas)</label>
              <textarea
                name="noIncluye"
                value={formData.noIncluye}
                onChange={handleChange}
                rows="2"
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
