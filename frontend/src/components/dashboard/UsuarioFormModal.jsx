import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { createUser } from "../../services/users.service";
import AlertModal from "../common/AlertModal";

export default function UsuarioFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    role: "operador",
    telefono: "",
    direccion: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setAlertData({
        type: "error",
        message: "Por favor completa todos los campos obligatorios",
      });
      setShowAlert(true);
      return;
    }

    if (formData.password.length < 6) {
      setAlertData({
        type: "error",
        message: "La contraseña debe tener al menos 6 caracteres",
      });
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);
      await createUser(formData);
      setAlertData({
        type: "success",
        message: "Usuario creado exitosamente",
      });
      setShowAlert(true);
      setFormData({
        nombre: "",
        email: "",
        password: "",
        role: "operador",
        telefono: "",
        direccion: "",
      });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setAlertData({
        type: "error",
        message: error.response?.data?.message || "Error al crear el usuario",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>
              <FaUser /> Nuevo Usuario
            </h2>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaUser /> Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaEnvelope /> Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej: juan@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaLock /> Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaShieldAlt /> Rol *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="operador">Operador</option>
                    <option value="agencia">Agencia</option>
                    <option value="admin">Administrador</option>
                    <option value="sysadmin">Super Administrador</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaPhone /> Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: +54 11 1234-5678"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaMapMarkerAlt /> Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Ej: Av. Corrientes 1234"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Creando..." : "Crear Usuario"}
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
