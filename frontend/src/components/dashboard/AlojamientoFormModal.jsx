import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createAlojamiento } from "../../services/alojamientos.service";
import AlertModal from "../common/AlertModal";

export default function AlojamientoFormModal({ isOpen, onClose, onSuccess }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
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
      await createAlojamiento(formData);
      setAlertData({
        type: "success",
        message: "Alojamiento creado exitosamente",
      });
      setShowAlert(true);

      // Limpiar formulario
      setFormData({
        nombre: "",
        tipo: "hotel",
        ubicacion: "",
        direccion: "",
        estrellas: 3,
        descripcion: "",
        precioNoche: "",
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al crear alojamiento:", error);
      setAlertData({
        type: "error",
        message: "Error al crear el alojamiento",
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
            <h2>Nuevo Alojamiento</h2>
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
                placeholder="Nombre del alojamiento"
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
                  placeholder="Ciudad, País"
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
                  placeholder="Precio"
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
                placeholder="Dirección completa"
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción del alojamiento"
                rows="4"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Crear Alojamiento
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
