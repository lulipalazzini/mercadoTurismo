import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updatePasaje } from "../../services/pasajes.service";
import AlertModal from "../common/AlertModal";

export default function PasajeEditModal({
  isOpen,
  onClose,
  onSuccess,
  pasaje,
}) {
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

  useEffect(() => {
    if (pasaje) {
      setFormData({
        tipo: pasaje.tipo || "aereo",
        origen: pasaje.origen || "",
        destino: pasaje.destino || "",
        aerolinea: pasaje.aerolinea || "",
        numeroVuelo: pasaje.numeroVuelo || "",
        fechaSalida: pasaje.fechaSalida
          ? new Date(pasaje.fechaSalida).toISOString().split("T")[0]
          : "",
        fechaLlegada: pasaje.fechaLlegada
          ? new Date(pasaje.fechaLlegada).toISOString().split("T")[0]
          : "",
        horaSalida: pasaje.horaSalida || "",
        horaLlegada: pasaje.horaLlegada || "",
        clase: pasaje.clase || "economica",
        precio: pasaje.precio || "",
      });
    }
  }, [pasaje]);

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
      await updatePasaje(pasaje.id, formData);
      setAlertData({
        type: "success",
        message: "Pasaje actualizado exitosamente",
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
        message: "Error al actualizar el pasaje",
      });
      setShowAlert(true);
    }
  };

  if (!isOpen || !pasaje) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Editar Pasaje</h2>
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
                  />
                </div>

                <div className="form-group">
                  <label>Número de Vuelo</label>
                  <input
                    type="text"
                    name="numeroVuelo"
                    value={formData.numeroVuelo}
                    onChange={handleChange}
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
