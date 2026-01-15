import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaEdit,
  FaUserCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { updateUser } from "../../services/auth.service";
import AlertModal from "../common/AlertModal";

export default function Ajustes() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        nombre: currentUser.nombre || "",
        email: currentUser.email || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.email.trim()) {
      setAlertData({
        type: "error",
        message: "Por favor completa todos los campos",
      });
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);
      const response = await updateUser(user.id, formData);
      
      // Actualizar localStorage con los nuevos datos
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setAlertData({
        type: "success",
        message: "Información actualizada correctamente",
      });
      setShowAlert(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setAlertData({
        type: "error",
        message: error.response?.data?.message || "Error al actualizar la información",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setAlertData({
        type: "error",
        message: "Por favor completa todos los campos",
      });
      setShowAlert(true);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlertData({
        type: "error",
        message: "Las contraseñas no coinciden",
      });
      setShowAlert(true);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setAlertData({
        type: "error",
        message: "La contraseña debe tener al menos 6 caracteres",
      });
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);
      await updateUser(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setAlertData({
        type: "success",
        message: "Contraseña actualizada correctamente",
      });
      setShowAlert(true);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setAlertData({
        type: "error",
        message: error.response?.data?.message || "Error al cambiar la contraseña",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role) => {
    const roles = {
      admin: "Administrador",
      agencia: "Agencia",
      operador_agencia: "Operador de Agencia",
      operador_independiente: "Operador Independiente",
    };
    return roles[role] || "Usuario";
  };

  if (!user) {
    return (
      <div className="section-container">
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "#718096" }}>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="section-container">
        {/* Header */}
        <div className="section-toolbar" style={{ borderBottom: "1px solid #e1e4e8", paddingBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2d3748", margin: 0 }}>
              <FaUserCircle style={{ marginRight: "0.5rem" }} />
              Configuración de Cuenta
            </h2>
            <p style={{ color: "#718096", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Administra tu información personal y preferencias
            </p>
          </div>
        </div>

        {/* User Info Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
          {/* Profile Card */}
          <div className="package-card" style={{ height: "fit-content" }}>
            <div className="package-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaUser style={{ color: "#667eea" }} />
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>Información Personal</h3>
              </div>
              {!isEditing && (
                <button
                  className="btn-icon"
                  onClick={() => setIsEditing(true)}
                  title="Editar información"
                >
                  <FaEdit />
                </button>
              )}
            </div>

            <div className="package-body">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#4a5568", marginBottom: "0.5rem" }}>
                        <FaUser style={{ marginRight: "0.5rem" }} />
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="form-input"
                        style={{ width: "100%", padding: "0.625rem", border: "1px solid #e2e8f0", borderRadius: "0.375rem" }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#4a5568", marginBottom: "0.5rem" }}>
                        <FaEnvelope style={{ marginRight: "0.5rem" }} />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        style={{ width: "100%", padding: "0.625rem", border: "1px solid #e2e8f0", borderRadius: "0.375rem" }}
                        required
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{ 
                          flex: 1,
                          padding: "0.625rem 1rem",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.7 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-1px)")}
                        onMouseLeave={(e) => !loading && (e.target.style.transform = "translateY(0)")}
                      >
                        <FaSave /> {loading ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            nombre: user.nombre || "",
                            email: user.email || "",
                          });
                        }}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#718096", marginBottom: "0.25rem" }}>
                      NOMBRE
                    </label>
                    <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "500", color: "#2d3748" }}>
                      {user.nombre || "No especificado"}
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#718096", marginBottom: "0.25rem" }}>
                      EMAIL
                    </label>
                    <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "500", color: "#2d3748" }}>
                      {user.email || "No especificado"}
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#718096", marginBottom: "0.25rem" }}>
                      ROL
                    </label>
                    <span
                      className="category-badge"
                      style={{
                        background: user.role === "admin" ? "#e3f2fd" : "#f3e5f5",
                        color: user.role === "admin" ? "#0d47a1" : "#6a1b9a",
                        display: "inline-block",
                      }}
                    >
                      <FaShieldAlt style={{ marginRight: "0.25rem" }} />
                      {getRoleName(user.role)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Card */}
          <div className="package-card" style={{ height: "fit-content" }}>
            <div className="package-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaLock style={{ color: "#667eea" }} />
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>Seguridad</h3>
              </div>
            </div>

            <div className="package-body">
              {!isChangingPassword ? (
                <div>
                  <p style={{ fontSize: "0.875rem", color: "#718096", marginBottom: "1rem" }}>
                    Mantén tu cuenta segura actualizando tu contraseña periódicamente.
                  </p>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    style={{ 
                      width: "100%",
                      padding: "0.625rem 1rem",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  >
                    <FaLock /> Cambiar Contraseña
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#4a5568", marginBottom: "0.5rem" }}>
                        Contraseña actual
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        style={{ width: "100%", padding: "0.625rem", border: "1px solid #e2e8f0", borderRadius: "0.375rem" }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#4a5568", marginBottom: "0.5rem" }}>
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        style={{ width: "100%", padding: "0.625rem", border: "1px solid #e2e8f0", borderRadius: "0.375rem" }}
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#4a5568", marginBottom: "0.5rem" }}>
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        style={{ width: "100%", padding: "0.625rem", border: "1px solid #e2e8f0", borderRadius: "0.375rem" }}
                        required
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{ 
                          flex: 1,
                          padding: "0.625rem 1rem",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.7 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-1px)")}
                        onMouseLeave={(e) => !loading && (e.target.style.transform = "translateY(0)")}
                      >
                        <FaSave /> {loading ? "Guardando..." : "Cambiar"}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
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
