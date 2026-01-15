import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateAlojamiento } from "../../services/alojamientos.service";
import AlertModal from "../common/AlertModal";

export default function AlojamientoEditModal({
  isOpen,
  onClose,
  onSuccess,
  alojamiento,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "hotel",
    ubicacion: "",
    direccion: "",
    estrellas: 3,
    descripcion: "",
    precioNoche: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });

  useEffect(() => {
    if (alojamiento) {
      setFormData({
        nombre: alojamiento.nombre || "",
        tipo: alojamiento.tipo || "hotel",
        ubicacion: alojamiento.ubicacion || "",
        direccion: alojamiento.direccion || "",
        estrellas: alojamiento.estrellas || 3,
        descripcion: alojamiento.descripcion || "",
        precioNoche: alojamiento.precioNoche || "",
      });
    }
  }, [alojamiento]);

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
      setAlertData({
        type: "error",
        message: "El nombre es requerido",
      });
      setShowAlert(true);
      return;
    }

    if (!formData.ubicacion.trim()) {
      setAlertData({
        type: "error",
        message: "La ubicación es requerida",
      });
      setShowAlert(true);
      return;
    }

    if (!formData.precioNoche || formData.precioNoche <= 0) {
      setAlertData({
        type: "error",
        message: "El precio por noche debe ser mayor a 0",
      });
      setShowAlert(true);
      return;
    }

    try {
      await updateAlojamiento(alojamiento.id, formData);
      setAlertData({
        type: "success",
        message: "Alojamiento actualizado exitosamente",
      });
      setShowAlert(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar alojamiento:", error);
      setAlertData({
        type: "error",
        message: "Error al actualizar el alojamiento",
      });
      setShowAlert(true);
    }
  };

  if (!isOpen || !alojamiento) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Editar Alojamiento</h2>
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
                <label>Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostel</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="resort">Resort</option>
                  <option value="cabaña">Cabaña</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estrellas</label>
                <select
                  name="estrellas"
                  value={formData.estrellas}
                  onChange={handleChange}
                >
                  <option value="1">1 Estrella</option>
                  <option value="2">2 Estrellas</option>
                  <option value="3">3 Estrellas</option>
                  <option value="4">4 Estrellas</option>
                  <option value="5">5 Estrellas</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ubicación *</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio por Noche *</label>
                <input
                  type="number"
                  name="precioNoche"
                  value={formData.precioNoche}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
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
