import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createCrucero } from "../../services/cruceros.service";
import AlertModal from "../common/AlertModal";

export default function CruceroFormModal({ isOpen, onClose, onSuccess }) {
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

    if (!formData.naviera.trim()) {
      setAlertData({ type: "error", message: "La naviera es requerida" });
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

      await createCrucero(dataToSend);
      setAlertData({
        type: "success",
        message: "Crucero creado exitosamente",
      });
      setShowAlert(true);

      setFormData({
        nombre: "",
        naviera: "",
        barco: "",
        descripcion: "",
        itinerario: "",
        duracion: "",
        fechaSalida: "",
        precio: "",
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setAlertData({
        type: "error",
        message: "Error al crear el crucero",
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
            <h2>Nuevo Crucero</h2>
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
                placeholder="Nombre del crucero"
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
                  placeholder="Ej: Royal Caribbean"
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
                  placeholder="Nombre del barco"
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
                placeholder="Descripción del crucero"
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
                placeholder="Ej: Miami, Cozumel, Grand Cayman"
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
                  placeholder="Precio"
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
                Crear Crucero
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
