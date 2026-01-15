import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateAuto } from "../../services/autos.service";
import AlertModal from "../common/AlertModal";

export default function AutoEditModal({ isOpen, onClose, onSuccess, auto }) {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    categoria: "economico",
    año: new Date().getFullYear(),
    capacidadPasajeros: 4,
    transmision: "automatico",
    precio: "",
    descripcion: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });

  useEffect(() => {
    if (auto) {
      setFormData({
        marca: auto.marca || "",
        modelo: auto.modelo || "",
        categoria: auto.categoria || "economico",
        año: auto.año || new Date().getFullYear(),
        capacidadPasajeros: auto.capacidadPasajeros || 4,
        transmision: auto.transmision || "automatico",
        precio: auto.precio || "",
        descripcion: auto.descripcion || "",
      });
    }
  }, [auto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.marca.trim()) {
      setAlertData({ type: "error", message: "La marca es requerida" });
      setShowAlert(true);
      return;
    }

    if (!formData.modelo.trim()) {
      setAlertData({ type: "error", message: "El modelo es requerido" });
      setShowAlert(true);
      return;
    }

    try {
      await updateAuto(auto.id, formData);
      setAlertData({
        type: "success",
        message: "Auto actualizado exitosamente",
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
        message: "Error al actualizar el auto",
      });
      setShowAlert(true);
    }
  };

  if (!isOpen || !auto) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Editar Auto</h2>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Marca *</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Modelo *</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="economico">Económico</option>
                  <option value="compacto">Compacto</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="lujo">Lujo</option>
                  <option value="van">Van</option>
                </select>
              </div>

              <div className="form-group">
                <label>Transmisión *</label>
                <select
                  name="transmision"
                  value={formData.transmision}
                  onChange={handleChange}
                  required
                >
                  <option value="manual">Manual</option>
                  <option value="automatico">Automático</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Año *</label>
                <input
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleChange}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div className="form-group">
                <label>Capacidad de Pasajeros *</label>
                <input
                  type="number"
                  name="capacidadPasajeros"
                  value={formData.capacidadPasajeros}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio por Día</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
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
