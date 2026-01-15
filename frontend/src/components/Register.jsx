import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth.service";
import "../styles/auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar errores al modificar
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (formData.telefono && formData.telefono.length < 8) {
      newErrors.telefono = "Teléfono inválido";
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
      
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono || undefined,
        direccion: formData.direccion || undefined,
      };

      await register(userData);

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en register:", error);
      setErrorMessage(error.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Registro de Usuario</h1>
          <p>Únete a nuestra plataforma mayorista</p>
        </div>

        {errorMessage && (
          <div className="alert alert-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre completo <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? "error" : ""}
              placeholder="Juan Pérez"
              disabled={loading}
            />
            {errors.nombre && (
              <span className="error-message">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Correo electrónico <span className="required">*</span>
            </label>
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
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={errors.telefono ? "error" : ""}
              placeholder="+54 11 1234-5678"
              disabled={loading}
            />
            {errors.telefono && (
              <span className="error-message">{errors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Av. Corrientes 1234, CABA"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmar contraseña <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="auth-links">
          <p className="register-prompt">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="link-primary">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="auth-footer">
          <Link to="/" className="link-back">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
