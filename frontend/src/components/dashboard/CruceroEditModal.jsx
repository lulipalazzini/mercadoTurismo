import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateCrucero } from "../../services/cruceros.service";
import AlertModal from "../common/AlertModal";

export default function CruceroEditModal({
  isOpen,
  onClose,
  onSuccess,
  crucero,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    naviera: "",
    barco: "",
    descripcion: "",
    itinerario: "",
    duracion: "",
    fechaSalida: "",
    precio: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });

  useEffect(() => {
    if (crucero) {
      setFormData({
        nombre: crucero.nombre || "",
        naviera: crucero.naviera || "",
        barco: crucero.barco || "",
        descripcion: crucero.descripcion || "",
        itinerario: Array.isArray(crucero.itinerario)
          ? crucero.itinerario.join(", ")
          : "",
        duracion: crucero.duracion || "",
        fechaSalida: crucero.fechaSalida
          ? new Date(crucero.fechaSalida).toISOString().split("T")[0]
          : "",
        precio: crucero.precio || "",
      });
    }
  }, [crucero]);

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
        itinerario: formData.itinerario
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
      };

      await updateCrucero(crucero.id, dataToSend);
      setAlertData({
        type: "success",
        message: "Crucero actualizado exitosamente",
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
        message: "Error al actualizar el crucero",
      });
      setShowAlert(true);
    }
  };

  if (!isOpen || !crucero) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Editar Crucero</h2>
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
                <label>Naviera *</label>
                <input
                  type="text"
                  name="naviera"
                  value={formData.naviera}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Barco *</label>
                <input
                  type="text"
                  name="barco"
                  value={formData.barco}
                  onChange={handleChange}
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
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Itinerario * (puertos separados por comas)</label>
              <input
                type="text"
                name="itinerario"
                value={formData.itinerario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duración (noches) *</label>
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
                <label>Fecha de Salida *</label>
                <input
                  type="date"
                  name="fechaSalida"
                  value={formData.fechaSalida}
                  onChange={handleChange}
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
