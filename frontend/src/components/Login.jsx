import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, verifyAdminPassword } from "../services/auth.service";
import AdminPasswordModal from "./common/AdminPasswordModal";
import "../styles/auth.css";
import logo from "../assets/logo/MT_marca_01.webp";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar errores al modificar campos
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData.email, formData.password);

      // Verificar si es admin inmediatamente después del login
      const user = JSON.parse(localStorage.getItem("currentUser"));
      console.log("Usuario después del login:", user); // Debug

      if (user && user.role === "admin") {
        // Si es admin, mostrar modal de segunda contraseña
        setUserRole("admin");
        setShowAdminModal(true);
        setLoading(false);
      } else {
        // Si es usuario normal, ir directo al dashboard
        setLoading(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage(error.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  const handleAdminVerified = () => {
    setShowAdminModal(false);
    // Marcar que el admin está verificado en sessionStorage
    sessionStorage.setItem("adminVerified", "true");
    navigate("/dashboard");
  };

  const handleAdminModalClose = () => {
    setShowAdminModal(false);
    // Si cierra el modal, hacer logout
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setErrorMessage("Verificación de administrador cancelada");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img
            src={logo}
            alt="Mercado Turismo"
            style={{ height: "60px", marginBottom: "1rem" }}
          />
          <h1>Acceso Mayorista</h1>
          <p>Inicia sesión para acceder al panel</p>
        </div>

        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="tu@email.com"
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/recuperar-contrasena" className="link-secondary">
            ¿Olvidaste tu contraseña?
          </Link>
          <div className="divider">
            <span>o</span>
          </div>
          <p className="register-prompt">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="link-primary">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="auth-footer">
          <Link to="/" className="link-back">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      <AdminPasswordModal
        isOpen={showAdminModal}
        onClose={handleAdminModalClose}
        onSuccess={handleAdminVerified}
      />
    </div>
  );
}
