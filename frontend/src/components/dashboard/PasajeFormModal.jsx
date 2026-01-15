import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createPasaje } from "../../services/pasajes.service";
import AlertModal from "../common/AlertModal";

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

    if (!formData.origen.trim() || !formData.destino.trim()) {
      setAlertData({
        type: "error",
        message: "Origen y destino son requeridos",
      });
      setShowAlert(true);
      return;
    }

    try {
      await createPasaje(formData);
      setAlertData({
        type: "success",
        message: "Pasaje creado exitosamente",
      });
      setShowAlert(true);

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

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setAlertData({
        type: "error",
        message: "Error al crear el pasaje",
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
            <h2>Nuevo Pasaje</h2>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="aereo">Aéreo</option>
                  <option value="terrestre">Terrestre</option>
                  <option value="maritimo">Marítimo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Clase</label>
                <select
                  name="clase"
                  value={formData.clase}
                  onChange={handleChange}
                >
                  <option value="economica">Económica</option>
                  <option value="ejecutiva">Ejecutiva</option>
                  <option value="primera">Primera</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Origen *</label>
                <input
                  type="text"
                  name="origen"
                  value={formData.origen}
                  onChange={handleChange}
                  placeholder="Ciudad de origen"
                  required
                />
              </div>

              <div className="form-group">
                <label>Destino *</label>
                <input
                  type="text"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  placeholder="Ciudad de destino"
                  required
                />
              </div>
            </div>

            {formData.tipo === "aereo" && (
              <div className="form-row">
                <div className="form-group">
                  <label>Aerolínea</label>
                  <input
                    type="text"
                    name="aerolinea"
                    value={formData.aerolinea}
                    onChange={handleChange}
                    placeholder="Nombre de la aerolínea"
                  />
                </div>

                <div className="form-group">
                  <label>Número de Vuelo</label>
                  <input
                    type="text"
                    name="numeroVuelo"
                    value={formData.numeroVuelo}
                    onChange={handleChange}
                    placeholder="Ej: AA1234"
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Fecha Salida *</label>
                <input
                  type="date"
                  name="fechaSalida"
                  value={formData.fechaSalida}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora Salida</label>
                <input
                  type="time"
                  name="horaSalida"
                  value={formData.horaSalida}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha Llegada *</label>
                <input
                  type="date"
                  name="fechaLlegada"
                  value={formData.fechaLlegada}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora Llegada</label>
                <input
                  type="time"
                  name="horaLlegada"
                  value={formData.horaLlegada}
                  onChange={handleChange}
                />
              </div>
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

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Crear Pasaje
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
